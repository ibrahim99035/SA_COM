const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const moment = require('moment');

const app = express();
const db = new sqlite3.Database('mydatabase.db');

app.use(express.static(__dirname + '/views'));
app.use(express.json());

// Create Team table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Team (
      id INTEGER PRIMARY KEY,
      name TEXT,
      role TEXT,
      photo TEXT
    )
  `);
});

// Create Cards table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Cards (
      id INTEGER PRIMARY KEY,
      title TEXT,
      description TEXT,
      photo TEXT
    )
  `);
});

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isTeam = req.baseUrl === '/admin/teams';
    const destinationPath = isTeam ? 'views/images/assets' : 'views/images/assets';
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const timestamp = moment().format('YYYYMMDD_HHmmss');
    cb(null, `${timestamp}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/home.html');
});

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/views/admin.html');
});

// CRUD operations for Team table
// Retrieve all teams
app.get('/admin/teams', (req, res) => {
  db.all('SELECT * FROM Team', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create a new team
app.post('/admin/teams', upload.single('photo'), (req, res) => {
  const { name, role } = req.body;
  const photo = req.file.filename;

  db.run('INSERT INTO Team (name, role, photo) VALUES (?, ?, ?)', [name, role, photo], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// Update team name
app.put('/admin/teams/name/:id', (req, res) => {
  const { name } = req.body;
  const teamId = req.params.id;
  db.run('UPDATE Team SET name = ? WHERE id = ?', [name, teamId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Team name updated successfully' });
  });
});

// Update team role
app.put('/admin/teams/role/:id', (req, res) => {
  const { role } = req.body;
  const teamId = req.params.id;
  db.run('UPDATE Team SET role = ? WHERE id = ?', [role, teamId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Team role updated successfully' });
  });
});

// Update team photo
app.put('/admin/teams/photo/:id', upload.single('photo'), (req, res) => {
  const { photo } = req.file;
  const teamId = req.params.id;
  db.run('UPDATE Team SET photo = ? WHERE id = ?', [photo, teamId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Team photo updated successfully' });
  });
});

// Delete a team
app.delete('/admin/teams/:id', (req, res) => {
  const teamId = req.params.id;
  db.run('DELETE FROM Team WHERE id = ?', [teamId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Team deleted successfully' });
  });
});

// CRUD operations for Cards table
// Retrieve all cards
app.get('/admin/cards', (req, res) => {
  db.all('SELECT * FROM Cards', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create a new card
app.post('/admin/cards', upload.single('photo'), (req, res) => {
  const { title, description } = req.body;
  const photo = req.file.filename;

  db.run('INSERT INTO Cards (title, description, photo) VALUES (?, ?, ?)', [title, description, photo], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// Update card title
app.put('/admin/cards/title/:id', (req, res) => {
  const { title } = req.body;
  const cardId = req.params.id;
  db.run('UPDATE Cards SET title = ? WHERE id = ?', [title, cardId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Card title updated successfully' });
  });
});

// Update card description
app.put('/admin/cards/description/:id', (req, res) => {
  const { description } = req.body;
  const cardId = req.params.id;
  db.run('UPDATE Cards SET description = ? WHERE id = ?', [description, cardId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Card description updated successfully' });
  });
});

// Update card photo
app.put('/admin/cards/photo/:id', upload.single('photo'), (req, res) => {
  const { photo } = req.file;
  const cardId = req.params.id;
  db.run('UPDATE Cards SET photo = ? WHERE id = ?', [photo, cardId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Card photo updated successfully' });
  });
});

// Delete a card
app.delete('/admin/cards/:id', (req, res) => {
  const cardId = req.params.id;
  db.run('DELETE FROM Cards WHERE id = ?', [cardId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Card deleted successfully' });
  });
});

// Retrieve all data from both Team and Cards tables
app.get('/admin/allData', (req, res) => {
  // Retrieve data from Team table
  const teamsQuery = 'SELECT * FROM Team';
  db.all(teamsQuery, (err, teams) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Retrieve data from Cards table
    const cardsQuery = 'SELECT * FROM Cards';
    db.all(cardsQuery, (err, cards) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Combine and send the data
      const allData = {
        teams: teams,
        cards: cards,
      };

      res.json(allData);
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});