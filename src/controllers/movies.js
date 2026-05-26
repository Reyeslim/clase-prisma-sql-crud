import { moviesService } from "../services/movies.js"

const getMovies = (req, res) => {
  const data = moviesService.getAllMovies()
  res.json({
    ok: true,
    data: data,
  })
}

const getMovieById = (req, res, next) => {
  const id = parseInt(req.params.id)
  const movie = moviesService.getMovieById(id)

  if (!movie) {
    return res.status(404).json({
      ok: false,
      message: "Película no encontrada",
    })
  }

  res.json({
    ok: true,
    data: movie,
  })
}

const createMovie = (req, res) => {
  const { title, year, director } = req.body

  if (!title || !year) {
    return res
      .status(400)
      .json({ ok: false, message: "Título y año son obligatorios" })
  }

  const newMovie = moviesService.createMovie({ title, year, director })
  res.status(201).json({ ok: true, data: newMovie }) // 201 created
}

const updateMovie = (req, res) => {
  const id = parseInt(req.params.id)
  const updatedMovie = moviesService.updateMovie(id, req.body)

  if (!updatedMovie) {
    return res.status(404).json({
      ok: false,
      message: "Película no encontrada",
    })
  }

  res.json({
    ok: true,
    data: updatedMovie,
  })
}

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id)
  const deletedMovie = moviesService.deleteMovie(id)

  if (!deletedMovie) {
    return res.status(404).json({
      ok: false,
      message: "Película no encontrada",
    })
  }

  res.json({
    ok: true,
    message: "Película eliminada correctamente",
  })
}

export const moviesController = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
}
