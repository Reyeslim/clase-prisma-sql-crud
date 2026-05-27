import express from "express"
import { moviesController } from "../controllers/movies.js"
import { validateMovie } from "../middlewares/validateMovie.js"

const router = express.Router()

router.get("/", moviesController.getMovies)
router.get("/:id", moviesController.getMovieById)

router.post("/", validateMovie, moviesController.createMovie)
router.put("/:id", moviesController.updateMovie)
router.delete("/:id", moviesController.deleteMovie)

export default router
