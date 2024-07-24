const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

app.get('/api/notes', (req, res) => {
  fs.readFile(dbPath, (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile(dbPath, (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const newNote = { id: notes.length + 1, ...req.body };
    notes.push(newNote);
    fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
