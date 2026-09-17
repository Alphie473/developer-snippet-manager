const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1162007',
  database: 'devvault',
  waitForConnections: true,
  connectionLimit: 10,
});

// GET /api/snippets (Read All)
app.get('/api/snippets', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM snippets ORDER BY id DESC');
    const formatted = rows.map((row) => ({
      ...row,
      tags: row.tags ? row.tags.split(',') : [],
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/snippets (Create)
app.post('/api/snippets', async (req, res) => {
  const { title, language, tags, code } = req.body;
  const tagString = Array.isArray(tags) ? tags.join(',') : '';

  try {
    const [result] = await pool.query(
      'INSERT INTO snippets (title, language, tags, code) VALUES (?, ?, ?, ?)',
      [title, language, tagString, code]
    );
    res.status(201).json({ id: result.insertId, title, language, tags, code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/snippets/:id (Delete)
app.delete('/api/snippets/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM snippets WHERE id = ?', [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});