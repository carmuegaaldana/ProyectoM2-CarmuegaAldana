const express = require("express");
const { 
    getAllPosts,
    getPostById,
    getPostsByAuthorId,
    createPost,
    updatePost,
    deletePost,
 } = require("../services/postsService");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const posts = await getAllPosts();

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

router.get("/author/:authorId", async (req, res, next) => {
  try {
    const posts = await getPostsByAuthorId(req.params.authorId);

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: "Post no encontrado",
      });
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { author_id, title, content, published } = req.body;

    if (
      !author_id ||
      typeof title !== "string" ||
      !title.trim() ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        error: "Author_id, title y content son obligatorios",
      });
    }

    if (published !== undefined && typeof published !== "boolean") {
      return res.status(400).json({
        error: "Published debe ser un valor booleano",
      });
    }

    const post = await createPost({
      author_id,
      title: title.trim(),
      content: content.trim(),
      published,
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { author_id, title, content, published } = req.body;

    if (
      !author_id ||
      typeof title !== "string" ||
      !title.trim() ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        error: "Author_id, title y content son obligatorios",
      });
    }

    if (published !== undefined && typeof published !== "boolean") {
      return res.status(400).json({
        error: "Published debe ser un valor booleano",
      });
    }

    const post = await updatePost(req.params.id, {
      author_id,
      title: title.trim(),
      content: content.trim(),
      published,
    });

    if (!post) {
      return res.status(404).json({
        error: "Post no encontrado",
      });
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deletedPost = await deletePost(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({
        error: "Post no encontrado",
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;