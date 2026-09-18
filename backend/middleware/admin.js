import jwt from "jsonwebtoken"

const admin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    if (!decoded.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      })
    }

    req.userId = decoded.userId

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    })
  }
}

export default admin