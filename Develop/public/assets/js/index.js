document.addEventListener('DOMContentLoaded', function() {
  const noteForm = document.getElementById('note-form');
  noteForm.addEventListener('submit', function(event) {
      event.preventDefault();
      handleNoteSave();
  });

  document.querySelector('.new-note').addEventListener('click', handleNewNoteView);
  document.querySelector('.clear-btn').addEventListener('click', clearForm);
  document.querySelector('.save-note').addEventListener('click', handleNoteSave);


  getAndRenderNotes();
});

let activeNote = {};

const getNotes = async () => {
  try {
      const response = await fetch('http://localhost:3000/api/notes', {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
      });
      return await response.json();
  } catch (error) {
      console.error('Error fetching notes:', error);
  }
};


const saveNote = async (note) => {
  try {
      const response = await fetch('http://localhost:3000/api/notes', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(note),
      });
      if (!response.ok) {
          throw new Error('Failed to save note');
      }
      return await response.json();
  } catch (error) {
      console.error('Error saving note:', error);
  }
};



const deleteNote = async (id) => {
  const response = await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
  });
  return response.json();
};

const renderActiveNote = () => {
  const saveButton = document.querySelector('.save-note');
  const clearButton = document.querySelector('.clear-btn');
  const newNoteButton = document.querySelector('.new-note');
  const noteTitle = document.querySelector('.note-title');
  const noteText = document.querySelector('.note-textarea');

  if (activeNote.id) {
      saveButton.style.display = 'none';
      clearButton.style.display = 'inline';
      newNoteButton.style.display = 'inline';
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
  } else {
      saveButton.style.display = 'inline';
      clearButton.style.display = 'none';
      newNoteButton.style.display = 'none';
      noteTitle.removeAttribute('readonly');
      noteText.removeAttribute('readonly');
      noteTitle.value = '';
      noteText.value = '';
  }
};

const handleNoteSave = () => {
  const noteTitle = document.querySelector('.note-title').value;
  const noteText = document.querySelector('.note-textarea').value;
  const noteToSave = { title: noteTitle, text: noteText };
  if (activeNote.id) {
      noteToSave.id = activeNote.id;
  }
  saveNote(noteToSave).then(() => {
      getAndRenderNotes();
      renderActiveNote();
  });
};

const handleNewNoteView = () => {
  activeNote = {};
  renderActiveNote();
};

const clearForm = () => {
  document.querySelector('.note-title').value = '';
  document.querySelector('.note-textarea').value = '';
  activeNote = {};
  renderActiveNote();
};

const getAndRenderNotes = () => {
  getNotes().then(notes => {
      const noteList = document.querySelector('.list-group');
      noteList.innerHTML = '';
      notes.forEach(note => {
          const noteElement = document.createElement('li');
          noteElement.classList.add('list-group-item');
          noteElement.innerHTML = `
              <span class='list-item-title'>${note.title}</span>
              <i class="fas fa-trash-alt text-danger delete-note"></i>
          `;
          noteElement.querySelector('.list-item-title').addEventListener('click', () => {
              activeNote = note;
              renderActiveNote();
          });
          noteElement.querySelector('.delete-note').addEventListener('click', (e) => {
              e.stopPropagation();
              deleteNote(note.id).then(() => getAndRenderNotes());
          });
          noteList.appendChild(noteElement);
      });
  });
};
