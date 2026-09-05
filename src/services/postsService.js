const pool = require("../db/pool");

async function getAllPosts() {
  const result = await pool.query(
    `SELECT id, author_id, title, content, published, created_at
     FROM posts
     ORDER BY id`
  );

  return result.rows;
}

async function getPostById(id) {
  const result = await pool.query(
    "SELECT id, author_id, title, content, published, created_at FROM posts WHERE id = $1",
    [id]
  );

  return result.rows[0];
}

async function createPost({
  author_id,
  title,
  content,
  published = false,
}) {
  const result = await pool.query(
    `INSERT INTO posts (author_id, title, content, published)
     VALUES ($1, $2, $3, $4)
     RETURNING id, author_id, title, content, published, created_at`,
    [author_id, title, content, published]
  );

  return result.rows[0];
}

async function updatePost(id,
  { author_id, title, content, published = false }
) {
  const result = await pool.query(
    `UPDATE posts
     SET author_id = $1, title = $2, content = $3, published = $4
     WHERE id = $5
     RETURNING id, author_id, title, content, published, created_at`,
    [author_id, title, content, published, id]
  );

  return result.rows[0];
}

async function getPostsByAuthorId(authorId) {
  const result = await pool.query(
  `SELECT
     p.id,
     p.author_id,
     p.title,
     p.content,
     p.published,
     p.created_at,
     a.name AS author_name,
     a.email AS author_email,
     a.bio AS author_bio
   FROM posts AS p
   JOIN authors AS a ON p.author_id = a.id
   WHERE p.author_id = $1
   ORDER BY p.id`,
  [authorId]
  );

  return result.rows;
}

async function deletePost(id) {
  const result = await pool.query(
    `DELETE FROM posts
     WHERE id = $1
     RETURNING id`,
    [id]
  );

  return result.rows[0];
}

module.exports = {
  getAllPosts,
  getPostById,
  getPostsByAuthorId,
  createPost,
  updatePost,
  deletePost,
};