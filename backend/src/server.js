import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const port = process.env.PORT || 5001

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// CORS — allow localhost in dev, same-origin in production
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL || true   // 'true' mirrors the request origin (same-domain)
    : "http://localhost:5173",
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// API Routes
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import chatRoute from './routes/chat.route.js'

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/chat", chatRoute)

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../../frontend/dist")

  // Serve static files from the React/Vite build
  app.use(express.static(frontendDistPath))

  // Catch-all: send index.html for any non-API route (client-side routing)
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"))
  })
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  connectDB()
})
