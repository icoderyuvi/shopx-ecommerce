
import { useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL
import { Link } from "react-router-dom"

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  })

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")

  const fetchStats = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError("")

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

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load dashboard"
        )
      }

      setStats({
        totalProducts: data.stats?.totalProducts || 0,
        totalUsers: data.stats?.totalUsers || 0,
        totalOrders: data.stats?.totalOrders || 0,
        totalRevenue: data.stats?.totalRevenue || 0,
        recentOrders: Array.isArray(
          data.stats?.recentOrders
        )
          ? data.stats.recentOrders
          : []
      })
    } catch (error) {
      console.error("Dashboard error:", error)

      setError(
        error.message || "Unable to load dashboard"
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const formatCurrency = amount => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    )
  }

  const formatDate = date => {
    if (!date) {
      return "N/A"
    }

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A"
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getStatusClass = status => {
    if (status === "Delivered") {
      return "bg-green-100 text-green-700"
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700"
    }

    if (status === "Shipped") {
      return "bg-blue-100 text-blue-700"
    }

    if (status === "Out for Delivery") {
      return "bg-indigo-100 text-indigo-700"
    }

    if (status === "Packing") {
      return "bg-orange-100 text-orange-700"
    }

    return "bg-yellow-100 text-yellow-700"
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="mt-4 text-sm text-gray-500">
              Loading dashboard...
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl py-20">
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-600">
              !
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Unable to Load Dashboard
            </h1>

            <p className="mt-3 text-sm text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchStats()}
              className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Try Again
            </button>

          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              ShopX Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your store and monitor your business.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="rounded-xl border bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Dashboard"}
          </button>

        </div>

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Products */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-gray-500">
                Total Products
              </p>

              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl">
                📦
              </span>

            </div>

            <p className="mt-5 text-3xl font-bold text-gray-900">
              {stats.totalProducts}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Products in store
            </p>

          </div>

          {/* Users */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-gray-500">
                Total Users
              </p>

              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                👥
              </span>

            </div>

            <p className="mt-5 text-3xl font-bold text-gray-900">
              {stats.totalUsers}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Registered users
            </p>

          </div>

          {/* Orders */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-gray-500">
                Total Orders
              </p>

              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl">
                🛒
              </span>

            </div>

            <p className="mt-5 text-3xl font-bold text-gray-900">
              {stats.totalOrders}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Orders received
            </p>

          </div>

          {/* Revenue */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-gray-500">
                Total Order Value
              </p>

              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl font-bold">
                ₹
              </span>

            </div>

            <p className="mt-5 text-3xl font-bold text-gray-900">
              ₹{formatCurrency(stats.totalRevenue)}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Value of all orders
            </p>

          </div>

        </div>

        {/* Recent Orders */}
        <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest customer orders.
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="w-fit rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              View All Orders
            </Link>

          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="p-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-xl">
                📦
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                No Orders Yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Customer orders will appear here.
              </p>

            </div>
          ) : (
            <div className="divide-y">

              {stats.recentOrders.map(order => (
                <div
                  key={order._id}
                  className="flex flex-col gap-5 p-5 transition hover:bg-gray-50 lg:flex-row lg:items-center lg:justify-between"
                >

                  {/* Order */}
                  <div className="min-w-0 lg:w-[30%]">

                    <p className="break-all text-sm font-semibold text-gray-900">
                      Order #{order._id}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      {order.items?.length || 0}{" "}
                      {order.items?.length === 1
                        ? "product"
                        : "products"}
                    </p>

                  </div>

                  {/* Payment */}
                  <div>

                    <p className="text-xs font-medium text-gray-500">
                      Payment
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {order.paymentMethod ===
                      "RAZORPAY"
                        ? "Online Payment"
                        : "Cash on Delivery"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {order.payment
                        ? "Paid"
                        : "Payment Pending"}
                    </p>

                  </div>

                  {/* Status */}
                  <div>

                    <p className="text-xs font-medium text-gray-500">
                      Status
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status ||
                        "Order Placed"}
                    </span>

                  </div>

                  {/* Amount */}
                  <div className="lg:text-right">

                    <p className="text-xs font-medium text-gray-500">
                      Amount
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      ₹{formatCurrency(order.amount)}
                    </p>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* Quick Actions */}
        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Quickly manage your ShopX store.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <Link
              to="/admin/products"
              className="group rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl">
                📦
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Manage Products
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add, edit and delete products.
              </p>

              <p className="mt-4 text-sm font-semibold text-gray-900">
                Open Products →
              </p>
            </Link>

            <Link
              to="/admin/orders"
              className="group rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl">
                🛒
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Manage Orders
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                View orders and update delivery status.
              </p>

              <p className="mt-4 text-sm font-semibold text-gray-900">
                Open Orders →
              </p>
            </Link>

            <Link
              to="/admin/users"
              className="group rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                👥
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Manage Users
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                View and manage registered users.
              </p>

              <p className="mt-4 text-sm font-semibold text-gray-900">
                Open Users →
              </p>
            </Link>

          </div>

        </div>

      </div>
    </main>
  )
}

export default AdminDashboard

