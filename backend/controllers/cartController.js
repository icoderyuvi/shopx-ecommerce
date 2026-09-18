import userModel from "../models/userModel.js"

export const getCart = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .select("cartData")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.json({
      success: true,
      cartData: Array.isArray(user.cartData)
        ? user.cartData
        : []
    })
  } catch (error) {
    console.error("Get cart error:", error)

    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}

export const updateCart = async (req, res) => {
  try {
    const { cartData } = req.body

    if (!Array.isArray(cartData)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart data"
      })
    }

    await userModel.findByIdAndUpdate(
      req.userId,
      {
        cartData
      },
      {
        new: true
      }
    )

    res.json({
      success: true,
      message: "Cart updated successfully"
    })
  } catch (error) {
    console.error("Update cart error:", error)

    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}