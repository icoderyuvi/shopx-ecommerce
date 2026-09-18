import jwt from "jsonwebtoken"

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login."
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      })
    }

    req.userId = decoded.userId
    req.isAdmin = true

    next()
  } catch (error) {
    console.error("Admin auth error:", error)

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    })
  }
}

export default adminAuth