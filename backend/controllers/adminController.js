
import orderModel from "../models/orderModel.js"
import productModel from "../models/productModel.js"
import userModel from "../models/userModel.js"

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await productModel.countDocuments()
    const totalUsers = await userModel.countDocuments()
    const totalOrders = await orderModel.countDocuments()

    const orders = await orderModel.find({})

    const totalRevenue = orders.reduce(
      (total, order) => total + Number(order.amount),
      0
    )

    // Get latest 5 orders
    const recentOrders = await orderModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue,
        recentOrders
      }
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics"
    })
  }
}

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      orders
    })
  } catch (error) {
    console.error("Get all orders error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    })
  }
}

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const allowedStatuses = [
      "Order Placed",
      "Packing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      })
    }

    const order = await orderModel.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true
      }
    )

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      })
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order
    })
  } catch (error) {
    console.error("Update order status error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to update order status"
    })
  }
}

