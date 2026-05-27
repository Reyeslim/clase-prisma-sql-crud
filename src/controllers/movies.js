import { moviesService } from "../services/movies.js"

const getMovies = async (req, res, next) => {
  try {
    const data = await moviesService.getAllMovies()
    res.json({
      ok: true,
      data: data,
    })
  } catch (error) {
    next(error)
  }
}

const getMovieById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const movie = await moviesService.getMovieById(id)

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
  } catch (error) {
    next(error)
  }
}

const createMovie = async (req, res, next) => {
  try {
    const { title, year, director } = req.body

    const newMovie = await moviesService.createMovie({ title, year, director })
    res.status(201).json({ ok: true, data: newMovie }) // 201 created
  } catch (error) {
    next(error)
  }
}

const updateMovie = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const updatedMovie = await moviesService.updateMovie(id, req.body)

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
  } catch (error) {
    next(error)
  }
}

const deleteMovie = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    await moviesService.deleteMovie(id)

    res.json({
      ok: true,
      message: "Película eliminada correctamente",
    })
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        ok: false,
        message: "Película no encontrada",
      })
    }
    next(error)
  }
}

export const moviesController = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
}
