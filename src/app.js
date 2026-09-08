const express = require("express");
const authorsRoutes = require("./routes/authorsRoutes");
const postsRoutes = require("./routes/postsRoutes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use("/authors", authorsRoutes);
app.use("/posts", postsRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API MiniBlog funcionando",
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;