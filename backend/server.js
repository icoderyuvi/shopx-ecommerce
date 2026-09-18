import "dotenv/config"
import express from "express"
import cors from "cors"
import dns from "dns"

import connectDB from "./config/mongodb.js"

import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import productRouter from "./routes/productRoute.js"
import paymentRouter from "./routes/paymentRoute.js"
import adminRouter from "./routes/adminRoute.js"
import adminUserRouter from "./routes/adminUserRoute.js"

const app = express()

const PORT = process.env.PORT || 4000

// DNS servers
dns.setServers(["8.8.8.8", "1.1.1.1"])

// Connect MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/product", productRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/admin", adminRouter)
app.use("/api/admin/users", adminUserRouter)


// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ShopX API is running"
  })
})

// API test route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API test successful"
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})