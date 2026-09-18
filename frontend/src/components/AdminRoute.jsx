
import { Navigate, Outlet } from "react-router-dom"

function AdminRoute() {
  const token = localStorage.getItem("token")

  let user = null

  try {
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      user = JSON.parse(storedUser)
    }
  } catch (error) {
    console.error("Invalid user data in localStorage:", error)

    localStorage.removeItem("user")
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute

