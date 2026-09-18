
import express from "express"
import adminAuth from "../middleware/adminAuth.js"

import {
  getAllUsers,
  deleteUser
} from "../controllers/adminUserController.js"

const adminUserRouter = express.Router()

// Admin only
adminUserRouter.get("/", adminAuth, getAllUsers)

adminUserRouter.delete(
  "/:id",
  adminAuth,
  deleteUser
)

export default adminUserRouter

