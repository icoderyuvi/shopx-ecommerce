import express from "express"
import auth from "../middleware/auth.js"
import {
  createOrder,
  getUserOrders
} from "../controllers/orderController.js"

const orderRouter = express.Router()

orderRouter.post("/create", auth, createOrder)
orderRouter.get("/user", auth, getUserOrders)

export default orderRouter