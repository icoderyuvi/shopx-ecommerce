
import userModel from "../models/userModel.js"

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select("-password")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      users
    })
  } catch (error) {
    console.error("Get all users error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    })
  }
}

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    // Prevent admin from deleting their own account
    if (id === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account"
      })
    }

    const user = await userModel.findByIdAndDelete(id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.json({
      success: true,
      message: "User deleted successfully"
    })
  } catch (error) {
    console.error("Delete user error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to delete user"
    })
  }
}

