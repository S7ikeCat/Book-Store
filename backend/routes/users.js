const express = require('express');
const router = express.Router();
const { pool } = require('../src/db/postgres');

// --- Получить всех пользователей ---
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, role_id FROM "Login"');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Удалить пользователя ---
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM "Login" WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Редактировать пользователя ---
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, role_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE "Login" SET email = $1, role_id = $2 WHERE id = $3 RETURNING *',
      [email, role_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;