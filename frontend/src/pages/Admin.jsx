
import { useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL
import { Link } from "react-router-dom"

function Admin() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Please login as admin.")
      }

      const response = await fetch(
        `${API_URL}/api/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const text = await response.text()

      let data

      try {
        data = JSON.parse(text)
      } catch {
        console.error("Server returned non-JSON response:", text)

        throw new Error(
          "Server returned an invalid response. Please check the backend."
        )
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load dashboard statistics"
        )
      }

      setStats({
        totalProducts: data.stats?.totalProducts || 0,
        totalUsers: data.stats?.totalUsers || 0,
        totalOrders: data.stats?.totalOrders || 0,
        totalRevenue: data.stats?.totalRevenue || 0,
        recentOrders: data.stats?.recentOrders || []
      })
    } catch (error) {
      console.error("Dashboard stats error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">
          Dashboard Error
        </h1>

        <p className="mt-3 text-red-500">
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            ShopX Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your store and monitor your business.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Products */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Total Products
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg">
                📦
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold">
              {stats.totalProducts}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Products in store
            </p>
          </div>

          {/* Users */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Total Users
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg">
                👤
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold">
              {stats.totalUsers}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Registered customers
            </p>
          </div>

          {/* Orders */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Total Orders
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg">
                🛒
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold">
              {stats.totalOrders}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Orders received
            </p>
          </div>

          {/* Revenue */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Total Revenue
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg">
                ₹
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold">
              ₹{Number(stats.totalRevenue).toLocaleString("en-IN")}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Total order value
            </p>
          </div>

        </div>

        {/* Recent Orders */}
        <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest orders received by your store.
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="text-sm font-semibold hover:underline"
            >
              View All
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="mt-6 rounded-xl bg-gray-50 p-8 text-center">
              <p className="text-gray-500">
                No orders yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b text-sm text-gray-500">
                    <th className="pb-4 font-medium">
                      Order
                    </th>

                    <th className="pb-4 font-medium">
                      Date
                    </th>

                    <th className="pb-4 font-medium">
                      Payment
                    </th>

                    <th className="pb-4 font-medium">
                      Status
                    </th>

                    <th className="pb-4 text-right font-medium">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr
                      key={order._id}
                      className="border-b last:border-0"
                    >
                      <td className="py-4">
                        <p className="font-semibold">
                          #{order._id?.slice(-6).toUpperCase()}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {Array.isArray(order.items)
                            ? order.items.length
                            : 0}{" "}
                          item(s)
                        </p>
                      </td>

                      <td className="py-4 text-sm text-gray-600">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString("en-IN")
                          : "-"}
                      </td>

                      <td className="py-4">
                        <span className="text-sm">
                          {order.paymentMethod === "RAZORPAY"
                            ? "Online"
                            : "COD"}
                        </span>
                      </td>

                      <td className="py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                          {order.status || "Order Placed"}
                        </span>
                      </td>

                      <td className="py-4 text-right font-semibold">
                        ₹
                        {Number(order.amount || 0).toLocaleString(
                          "en-IN"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your ShopX store.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <Link
              to="/admin/products"
              className="rounded-xl border p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-lg font-semibold">
                📦 Manage Products
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Add, edit and delete products.
              </p>
            </Link>

            <Link
              to="/admin/orders"
              className="rounded-xl border p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-lg font-semibold">
                🛒 Manage Orders
              </p>

              <p className="mt-2 text-sm text-gray-500">
                View orders and update delivery status.
              </p>
            </Link>

            <Link
              to="/admin/users"
              className="rounded-xl border p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-lg font-semibold">
                👥 Manage Users
              </p>

              <p className="mt-2 text-sm text-gray-500">
                View registered customers.
              </p>
            </Link>

          </div>
        </div>

      </div>
    </main>
  )
}

export default Admin

