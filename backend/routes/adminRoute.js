import express from "express"
import adminAuth from "../middleware/adminAuth.js"

import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus
} from "../controllers/adminController.js"

const adminRouter = express.Router()

adminRouter.get("/stats", adminAuth, getDashboardStats)

adminRouter.get("/orders", adminAuth, getAllOrders)

adminRouter.put(
  "/orders/:id/status",
  adminAuth,
  updateOrderStatus
)

export default adminRouter