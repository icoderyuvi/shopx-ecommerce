import { useContext, useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL
import { ShopContext } from "../context/ShopContext"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const getProfile = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        navigate("/login")
        return
      }

      try {
        const response = await fetch(
          `${API_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const data = await response.json()

        if (!data.success) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          navigate("/login")
          return
        }

        setUser(data.user)
      } catch (error) {
        setError("Unable to load profile")
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [navigate])
const { logout } = useContext(ShopContext)

const handleLogout = () => {
  logout()
  navigate("/login")
}

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] px-4 py-12">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-semibold">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your account information
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">

          <div className="flex items-center gap-4 pb-6 border-b">
            <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {user?.name}
              </h2>

              <p className="text-gray-500">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="py-6 space-y-5">

            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="mt-1 font-medium">
                {user?.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 font-medium">
                {user?.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Account Created
              </p>

              <p className="mt-1 font-medium">
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  )
}

export default Profile