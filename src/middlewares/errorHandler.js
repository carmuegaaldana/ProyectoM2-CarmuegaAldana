function errorHandler(error, req, res, next) {
  if (error.code === "23505") {
    return res.status(400).json({
      error: "El email ya está registrado",
    });
  }

  console.error(error);

  res.status(500).json({
    error: "Error interno del servidor",
  });
}

module.exports = errorHandler;