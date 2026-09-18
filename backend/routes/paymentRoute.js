import express from "express"

import auth from "../middleware/auth.js"

import {
  createRazorpayOrder,
  verifyRazorpayPayment
} from "../controllers/paymentController.js"

const paymentRouter = express.Router()

paymentRouter.post(
  "/create",
  auth,
  createRazorpayOrder
)

paymentRouter.post(
  "/verify",
  auth,
  verifyRazorpayPayment
)

export default paymentRouter