import { useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL

import { Link } from "react-router-dom"
import {
  AlertCircle,
  ArrowUpRight,
  Boxes,
  CalendarDays,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  Package,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet
} from "lucide-react"

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
      setLoading(true)
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

      const text = await response.text()

      let data

      try {
        data = JSON.parse(text)
      } catch {
        console.error(
          "Server returned non-JSON response:",
          text
        )

        throw new Error(
          "Server returned an invalid response. Please check the backend."
        )
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load dashboard statistics"
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

  const getStatusStyle = (status) => {
    if (status === "Delivered") {
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    }

    if (status === "Cancelled") {
      return "bg-red-50 text-red-700 border-red-100"
    }

    if (status === "Out for Delivery") {
      return "bg-purple-50 text-purple-700 border-purple-100"
    }

    if (status === "Shipped") {
      return "bg-blue-50 text-blue-700 border-blue-100"
    }

    return "bg-amber-50 text-amber-700 border-amber-100"
  }

  /*
   * ============================
   * LOADING
   * ============================
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="mb-8">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

            <div className="mt-3 h-10 w-52 animate-pulse rounded-lg bg-slate-200" />

            <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-slate-200" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}

          </div>

          <div className="mt-8 h-80 animate-pulse rounded-2xl bg-white shadow-sm" />

          <div className="mt-8 h-52 animate-pulse rounded-2xl bg-white shadow-sm" />

        </div>

      </main>
    )
  }

  /*
   * ============================
   * ERROR
   * ============================
   */

  if (error) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-12">

        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={30} />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-[#0B1F3A]">
            Dashboard Error
          </h1>

          <p className="mt-3 break-words text-sm leading-6 text-red-500">
            {error}
          </p>

          <button
            onClick={fetchStats}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

        </div>

      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              <LayoutDashboard size={13} />
              ShopX Admin
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage your store and monitor your business from one place.
            </p>

          </div>

          <button
            onClick={fetchStats}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-[#0B1F3A] shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

        </div>

        {/* =========================
            STATISTICS
        ========================= */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Products */}

          <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Total Products
                </p>

                <p className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B1F3A]">
                  {stats.totalProducts}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <Boxes size={21} />
              </div>

            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Package size={13} />
              Products in store
            </div>

          </div>

          {/* Users */}

          <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Total Users
                </p>

                <p className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B1F3A]">
                  {stats.totalUsers}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <Users size={21} />
              </div>

            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <TrendingUp size={13} />
              Registered customers
            </div>

          </div>

          {/* Orders */}

          <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Total Orders
                </p>

                <p className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B1F3A]">
                  {stats.totalOrders}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <ShoppingCart size={21} />
              </div>

            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <ShoppingCart size={13} />
              Orders received
            </div>

          </div>

          {/* Revenue */}

          <div className="group overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-[#0B1F3A] to-[#123c70] p-5 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-200">
                  Total Revenue
                </p>

                <p className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  ₹
                  {Number(
                    stats.totalRevenue
                  ).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-blue-200 backdrop-blur-sm">
                <Wallet size={21} />
              </div>

            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-blue-200">
              <TrendingUp size={13} />
              Total order value
            </div>

          </div>

        </div>

        {/* =========================
            RECENT ORDERS
        ========================= */}

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:mt-10">

          {/* Section Header */}

          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShoppingCart size={17} />
                </div>

                <h2 className="text-lg font-extrabold text-[#0B1F3A] sm:text-xl">
                  Recent Orders
                </h2>

              </div>

              <p className="mt-2 text-sm text-slate-500">
                Latest orders received by your store.
              </p>

            </div>

            <Link
              to="/admin/orders"
              className="group inline-flex w-fit items-center gap-1.5 text-sm font-bold text-blue-600 transition hover:text-[#0B1F3A]"
            >
              View All
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

          </div>

          {stats.recentOrders.length === 0 ? (

            <div className="p-10 text-center sm:p-14">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <ShoppingCart size={25} />
              </div>

              <p className="mt-4 font-semibold text-[#0B1F3A]">
                No orders yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                New customer orders will appear here.
              </p>

            </div>

          ) : (

            <>
              {/* Mobile Order Cards */}

              <div className="divide-y divide-slate-100 sm:hidden">

                {stats.recentOrders.map((order) => (

                  <div
                    key={order._id}
                    className="p-5"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <p className="text-sm font-extrabold text-[#0B1F3A]">
                          #
                          {order._id
                            ?.slice(-6)
                            .toUpperCase()}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {Array.isArray(order.items)
                            ? order.items.length
                            : 0}{" "}
                          item(s)
                        </p>

                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status ||
                          "Order Placed"}
                      </span>

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">

                      <div className="rounded-xl bg-slate-50 p-3">

                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <CalendarDays size={13} />
                          Date
                        </div>

                        <p className="mt-1 text-xs font-bold text-[#0B1F3A]">
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <CreditCard size={13} />
                          Payment
                        </div>

                        <p className="mt-1 text-xs font-bold text-[#0B1F3A]">
                          {order.paymentMethod ===
                          "RAZORPAY"
                            ? "Online"
                            : "COD"}
                        </p>

                      </div>

                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">

                      <span className="text-xs font-medium text-slate-400">
                        Amount
                      </span>

                      <span className="text-base font-extrabold text-[#0B1F3A]">
                        ₹
                        {Number(
                          order.amount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

              {/* Desktop Table */}

              <div className="hidden overflow-x-auto sm:block">

                <table className="w-full min-w-[700px] text-left">

                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-400">

                      <th className="px-6 py-4 font-bold">
                        Order
                      </th>

                      <th className="px-6 py-4 font-bold">
                        Date
                      </th>

                      <th className="px-6 py-4 font-bold">
                        Payment
                      </th>

                      <th className="px-6 py-4 font-bold">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right font-bold">
                        Amount
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {stats.recentOrders.map(
                      (order) => (

                        <tr
                          key={order._id}
                          className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/70"
                        >

                          <td className="px-6 py-5">

                            <p className="font-bold text-[#0B1F3A]">
                              #
                              {order._id
                                ?.slice(-6)
                                .toUpperCase()}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {Array.isArray(
                                order.items
                              )
                                ? order.items.length
                                : 0}{" "}
                              item(s)
                            </p>

                          </td>

                          <td className="px-6 py-5 text-sm text-slate-600">
                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "-"}
                          </td>

                          <td className="px-6 py-5">

                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                              <CreditCard
                                size={14}
                                className="text-slate-400"
                              />

                              {order.paymentMethod ===
                              "RAZORPAY"
                                ? "Online"
                                : "COD"}
                            </span>

                          </td>

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                                order.status
                              )}`}
                            >
                              {order.status ||
                                "Order Placed"}
                            </span>

                          </td>

                          <td className="px-6 py-5 text-right">

                            <p className="font-extrabold text-[#0B1F3A]">
                              ₹
                              {Number(
                                order.amount || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>
            </>
          )}

        </section>

        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:mt-10 sm:p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <LayoutDashboard size={19} />
            </div>

            <div>

              <h2 className="text-lg font-extrabold text-[#0B1F3A] sm:text-xl">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your ShopX store.
              </p>

            </div>

          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {/* Products */}

            <Link
              to="/admin/products"
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-lg"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Package size={21} />
                </div>

                <ArrowUpRight
                  size={17}
                  className="text-slate-300 transition group-hover:text-blue-600"
                />

              </div>

              <h3 className="mt-5 font-bold text-[#0B1F3A]">
                Manage Products
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Add, edit and delete products.
              </p>

            </Link>

            {/* Orders */}

            <Link
              to="/admin/orders"
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-lg"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <ShoppingCart size={21} />
                </div>

                <ArrowUpRight
                  size={17}
                  className="text-slate-300 transition group-hover:text-blue-600"
                />

              </div>

              <h3 className="mt-5 font-bold text-[#0B1F3A]">
                Manage Orders
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                View orders and update delivery status.
              </p>

            </Link>

            {/* Users */}

            <Link
              to="/admin/users"
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-lg"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Users size={21} />
                </div>

                <ArrowUpRight
                  size={17}
                  className="text-slate-300 transition group-hover:text-blue-600"
                />

              </div>

              <h3 className="mt-5 font-bold text-[#0B1F3A]">
                Manage Users
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                View registered customers.
              </p>

            </Link>

          </div>

        </section>

      </div>

    </main>
  )
}

export default Admin