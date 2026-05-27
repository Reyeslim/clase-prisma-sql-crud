// Se ejecuta antes del controller en la ruta POST /movies
// Verifica que el body contiene los campos obligatorios

export const validateMovie = (req, res, next) => {
  const { title } = req.body
  if (!title) {
    return res.status(400).json({
      ok: false,
      error: "El campo title es obligatorio",
    })
  }

  next()
}
