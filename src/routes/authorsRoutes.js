const express = require("express");
const { getAllAuthors } = require("../services/authorsService");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const authors = await getAllAuthors();

    res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
});

module.exports = router;