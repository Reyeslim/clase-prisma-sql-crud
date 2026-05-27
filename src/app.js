import express from "express"
import moviesRouter from "./routes/movies.js"
import { notFound } from "./middlewares/notFound.js"
import { errorHandler } from "./middlewares/errorHandler.js"

const app = express()

app.use(express.json())

app.use("/movies", moviesRouter)

app.use(notFound)
app.use(errorHandler)

app.get("/", (req, res) => {
  res.json({
    message: "API Crud completo activa",
  })
})

export default app
