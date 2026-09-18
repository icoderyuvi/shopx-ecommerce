import express from "express"
import {
  registerUser,
  loginUser
} from "../controllers/userController.js"
import auth from "../middleware/auth.js"
import userModel from "../models/userModel.js"

const userRouter = express.Router()

// Register
userRouter.post("/register", registerUser)

// Login
userRouter.post("/login", loginUser)

// Get logged-in user's profile
userRouter.get("/profile", auth, async (req, res) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error("Profile error:", error)

    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
})

// Get all users - Admin only
userRouter.get("/all", auth, async (req, res) => {
  try {
    const admin = await userModel.findById(req.userId)

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    if (!admin.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      })
    }

    const users = await userModel
      .find({})
      .select("-password")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      users
    })
  } catch (error) {
    console.error("Get users error:", error)

    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
})

// Change user role - Admin only
userRouter.put("/:id/role", auth, async (req, res) => {
  try {
    const admin = await userModel.findById(req.userId)

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found"
      })
    }

    if (!admin.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      })
    }

    // Prevent changing your own role
    if (req.params.id === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own admin role"
      })
    }

    const { isAdmin } = req.body

    if (typeof isAdmin !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAdmin must be true or false"
      })
    }

    const user = await userModel.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    user.isAdmin = isAdmin

    await user.save()

    res.json({
      success: true,
      message: "User role updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error("Change role error:", error)

    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
})

// Delete user - Admin only
userRouter.delete("/:id", auth, async (req, res) => {
  try {
    const admin = await userModel.findById(req.userId)

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found"
      })
    }

    if (!admin.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      })
    }

    // Prevent admin from deleting themselves
    if (req.params.id === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account"
      })
    }

    const user = await userModel.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    await userModel.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "User deleted successfully"
    })
  } catch (error) {
    console.error("Delete user error:", error)

    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
})

export default userRouter