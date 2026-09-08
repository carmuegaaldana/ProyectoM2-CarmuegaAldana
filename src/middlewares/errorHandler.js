function errorHandler(error, req, res, next) {
  if (error.type === "entity.parse.failed") {
  return res.status(400).json({
    error: "JSON inválido",
  });
  }
  if (error.code === "23505") {
    return res.status(400).json({
      error: "El email ya está registrado",
    });
  }
  if (error.code === "23503") {
    return res.status(400).json({
      error: "El autor indicado no existe",
    });
  }
  console.error(error);

  res.status(500).json({
    error: "Error interno del servidor",
  });
}

module.exports = errorHandler;