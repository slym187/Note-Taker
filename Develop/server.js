const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "Develop/public" directory
app.use(express.static(path.join(__dirname, 'Develop', 'public')));

// Route to serve the main HTML file (index.html) using an absolute path
app.get('/', (req, res) => {
    const indexPath = 'C:\\Users\\Ruby Hill\\bootcamp\\Note-Taker\\index.html';
    console.log('Serving index.html from:', indexPath);
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error sending index.html:', err);
            res.status(500).send('Error serving index.html');
        }
    });
});

// Route to serve the notes HTML file (notes.html) using an absolute path
app.get('/notes.html', (req, res) => {
    const notesPath = 'C:\\Users\\Ruby Hill\\bootcamp\\Note-Taker\\notes.html';
    console.log('Serving notes.html from:', notesPath);
    res.sendFile(notesPath, (err) => {
        if (err) {
            console.error('Error sending notes.html:', err);
            res.status(500).send('Error serving notes.html');
        }
    });
});

// API route to get all notes
app.get('/api/notes', (req, res) => {
    const dbPath = path.join(__dirname, 'Develop', 'db', 'db.json');
    console.log('Reading notes from:', dbPath);
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading db.json:', err);
            return res.status(500).json({ error: 'Failed to read notes' });
        }
        res.json(JSON.parse(data));
    });
});

// API route to save a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();

    const dbPath = path.join(__dirname, 'Develop', 'db', 'db.json');
    console.log('Saving note to:', dbPath);
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading db.json:', err);
            return res.status(500).json({ error: 'Failed to save note' });
        }
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                console.error('Error writing to db.json:', err);
                return res.status(500).json({ error: 'Failed to save note' });
            }
            res.json(newNote);
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
