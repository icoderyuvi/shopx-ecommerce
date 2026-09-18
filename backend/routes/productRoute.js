
import express from "express"

import adminAuth from "../middleware/adminAuth.js"

import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js"

const productRouter = express.Router()

// Admin-only routes
productRouter.post("/add", adminAuth, addProduct)
productRouter.put("/:id", adminAuth, updateProduct)
productRouter.delete("/:id", adminAuth, deleteProduct)

// Public routes
productRouter.get("/", getProducts)
productRouter.get("/:id", getProductById)

export default productRouter

