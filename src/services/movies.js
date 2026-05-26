import { movies } from "../db/movies.js"

const getAllMovies = () => {
  return movies
}

const getMovieById = (id) => {
  return movies.find((movie) => movie.id === id)
}

const createMovie = (data) => {
  const newMovie = {
    id: Date.now(),
    ...data,
  }
  movies.push(newMovie)
  return newMovie
}

const updateMovie = (id, data) => {
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex === -1) {
    return null
  }

  movies[movieIndex] = {
    ...movies[movieIndex],
    ...data,
  }

  return movies[movieIndex]
}

const deleteMovie = (id) => {
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex === -1) {
    return false
  }

  movies.splice(movieIndex, 1)
  return true
}

export const moviesService = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
}
