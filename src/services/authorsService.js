const pool = require("../db/pool");

async function getAllAuthors() {
  const result = await pool.query(
    "SELECT id, name, email, bio, created_at FROM authors ORDER BY id"
  );

  return result.rows;
}

module.exports = {
  getAllAuthors,
};