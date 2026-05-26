import express from "express"
import moviesRouter from "./routes/movies.js"

const app = express()

app.use(express.json())

app.use("/movies", moviesRouter)

app.get("/", (req, res) => {
  res.json({
    message: "API Crud completo activa",
  })
})

export default app
