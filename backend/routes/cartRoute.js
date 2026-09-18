import express from "express"
import auth from "../middleware/auth.js"
import {
  getCart,
  updateCart
} from "../controllers/cartController.js"

const cartRouter = express.Router()

cartRouter.get("/", auth, getCart)
cartRouter.post("/update", auth, updateCart)

export default cartRouter