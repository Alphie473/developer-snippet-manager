require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
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
      'INSERT INTO snippets (title, language, tags, code) VALUES ($1, $2, $3, $4) RETURNING id',
[title, language, tagString, code]
    );
    res.status(201).json({ id: result.rows[0].id, title, language, tags, code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/snippets/:id (Delete)
app.delete('/api/snippets/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM snippets ORDER BY id DESC');
    const snippet = result.rows.find((row) => row.id === parseInt(req.params.id));
    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }
    await pool.query('DELETE FROM snippets WHERE id = $1', [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});