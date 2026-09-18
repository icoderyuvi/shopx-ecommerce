import jwt from "jsonwebtoken"

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login."
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    req.userId = decoded.userId
    req.isAdmin = decoded.isAdmin

    next()
  } catch (error) {
    console.error("Auth error:", error)

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    })
  }
}

export default auth