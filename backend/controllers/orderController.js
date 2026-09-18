import orderModel from "../models/orderModel.js"
import productModel from "../models/productModel.js"
import userModel from "../models/userModel.js"

const DELIVERY_FEE = 10

// Create Cash on Delivery order
export const createOrder = async (req, res) => {
  try {
    const { items, address } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      })
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required"
      })
    }

    const productIds = items.map(item => item.productId)

    const products = await productModel.find({
      _id: { $in: productIds }
    })

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products no longer exist"
      })
    }

    let subtotal = 0

    const verifiedItems = items.map(item => {
      const product = products.find(
        product =>
          product._id.toString() === item.productId.toString()
      )

      if (!product) {
        throw new Error("Product not found")
      }

      const quantity = Number(item.quantity)

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Invalid quantity")
      }

      if (
        product.sizes?.length > 0 &&
        !product.sizes.includes(item.size)
      ) {
        throw new Error(`Invalid size for ${product.name}`)
      }

      subtotal += product.price * quantity

      return {
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        size: item.size,
        quantity
      }
    })

    const amount = subtotal + DELIVERY_FEE

    const order = await orderModel.create({
      userId: req.userId,
      items: verifiedItems,
      amount,
      address,
      paymentMethod: "COD",
      payment: false
    })

    await userModel.findByIdAndUpdate(req.userId, {
      cartData: []
    })

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    })
  } catch (error) {
    console.error("Create order error:", error)

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order"
    })
  }
}

// Get logged-in user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      orders
    })
  } catch (error) {
    console.error("Get user orders error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    })
  }
}