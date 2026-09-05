const express = require("express");
const authorsRoutes = require("./routes/authorsRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use("/authors", authorsRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API MiniBlog funcionando",
  });
});

app.use(errorHandler);

module.exports = app;