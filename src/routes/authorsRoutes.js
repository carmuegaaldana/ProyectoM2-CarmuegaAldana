const express = require("express");

const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../services/authorsService");

const validateId = require("../middlewares/validateId");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const authors = await getAllAuthors();

    res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validateId, async (req, res, next) => {
  try {
    const author = await getAuthorById(req.params.id);

    if (!author) {
      return res.status(404).json({
        error: "Autor no encontrado",
      });
    }

    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        error: "Name y email son obligatorios",
      });
    }

    const author = await createAuthor({
      name: name.trim(),
      email: email.trim(),
      bio,
    });

    res.status(201).json(author);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validateId, async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      
      return res.status(400).json({
        error: "Name y email son obligatorios",
      });
    }

    const author = await updateAuthor(req.params.id, {
      name: name.trim(),
      email: email.trim(),
      bio,
    });

    if (!author) {
      return res.status(404).json({
        error: "Autor no encontrado",
      });
    }

    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", validateId, async (req, res, next) => {
  try {
    const deletedAuthor = await deleteAuthor(req.params.id);

    if (!deletedAuthor) {
      return res.status(404).json({
        error: "Autor no encontrado",
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;