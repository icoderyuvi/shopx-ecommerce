import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock3,
  CreditCard,
  LayoutDashboard,
  Loader2,
  Package,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  UserRound,
  Users,
  WalletCards
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

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

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN")
  }

  const formatDate = (date) => {
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

  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered":
        return {
          wrapper: "bg-emerald-50 text-emerald-700 border-emerald-100",
          icon: CheckCircle2
        }

      case "Cancelled":
        return {
          wrapper: "bg-red-50 text-red-700 border-red-100",
          icon: AlertCircle
        }

      case "Shipped":
        return {
          wrapper: "bg-blue-50 text-blue-700 border-blue-100",
          icon: Package
        }

      case "Out for Delivery":
        return {
          wrapper: "bg-indigo-50 text-indigo-700 border-indigo-100",
          icon: ShoppingBag
        }

      case "Packing":
        return {
          wrapper: "bg-orange-50 text-orange-700 border-orange-100",
          icon: Boxes
        }

      default:
        return {
          wrapper: "bg-amber-50 text-amber-700 border-amber-100",
          icon: Clock3
        }
    }
  }

  const getOrderStatus = (status) => {
    return status || "Order Placed"
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      description: "Products in store",
      icon: Boxes,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered users",
      icon: Users,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      description: "Orders received",
      icon: ShoppingBag,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      title: "Total Order Value",
      value: `₹${formatCurrency(stats.totalRevenue)}`,
      description: "Value of all orders",
      icon: WalletCards,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600"
    }
  ]

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">

          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <Loader2
                size={28}
                className="animate-spin text-blue-600"
              />
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#0B1F3A]">
              Loading Dashboard
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we load your store data.
            </p>

          </div>

        </div>

      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

        <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center">

          <div className="w-full rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle size={30} />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold text-[#0B1F3A]">
              Unable to Load Dashboard
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchStats()}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

          </div>

        </div>

      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

      <div className="mx-auto max-w-7xl">

        {/* =================================
            HEADER
        ================================= */}

        <div className="mb-7 flex flex-col gap-5 sm:mb-8 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              <LayoutDashboard size={14} />
              ShopX Admin
            </div>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-3xl lg:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Monitor your store, orders, customers and
              overall business activity from one place.
            </p>

          </div>

          <button
            type="button"
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#0B1F3A] shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh Dashboard"}
          </button>

        </div>

        {/* =================================
            STATISTICS
        ================================= */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {statCards.map((card) => {

            const Icon = card.icon

            return (
              <div
                key={card.title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/50 sm:p-6"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      {card.title}
                    </p>

                    <p className="mt-3 break-words text-2xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-3xl">
                      {card.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor} transition group-hover:scale-105`}
                  >
                    <Icon size={22} />
                  </div>

                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <TrendingUp size={13} />
                  {card.description}
                </div>

              </div>
            )
          })}

        </div>

        {/* =================================
            RECENT ORDERS
        ================================= */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:mt-8">

          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <ShoppingBag size={18} />
                </div>

                <h2 className="text-lg font-extrabold text-[#0B1F3A] sm:text-xl">
                  Recent Orders
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Your latest customer orders.
              </p>

            </div>

            <Link
              to="/admin/orders"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#0B1F3A] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20"
            >
              View All Orders
              <ArrowRight size={15} />
            </Link>

          </div>

          {stats.recentOrders.length === 0 ? (

            <div className="px-5 py-14 text-center sm:px-8">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <ShoppingBag size={28} />
              </div>

              <h3 className="mt-5 font-bold text-[#0B1F3A]">
                No Orders Yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Customer orders will appear here once
                they are placed.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {stats.recentOrders.map((order) => {

                const status = getOrderStatus(order.status)
                const statusStyle = getStatusStyles(status)
                const StatusIcon = statusStyle.icon

                return (
                  <div
                    key={order._id}
                    className="p-5 transition hover:bg-slate-50 sm:p-6"
                  >

                    {/* Desktop / Tablet Layout */}

                    <div className="hidden items-center justify-between gap-6 lg:flex">

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-bold text-[#0B1F3A]">
                          Order #{order._id}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(order.createdAt)}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                          <Package size={14} />
                          {order.items?.length || 0}{" "}
                          {order.items?.length === 1
                            ? "product"
                            : "products"}
                        </div>

                      </div>

                      <div className="min-w-[150px]">

                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Payment
                        </p>

                        <div className="mt-2 flex items-center gap-2">

                          <CreditCard
                            size={15}
                            className="text-slate-400"
                          />

                          <p className="text-sm font-bold text-[#0B1F3A]">
                            {order.paymentMethod ===
                            "RAZORPAY"
                              ? "Online Payment"
                              : "Cash on Delivery"}
                          </p>

                        </div>

                        <p
                          className={`mt-1 text-xs font-semibold ${
                            order.payment
                              ? "text-emerald-600"
                              : "text-amber-600"
                          }`}
                        >
                          {order.payment
                            ? "Paid"
                            : "Payment Pending"}
                        </p>

                      </div>

                      <div className="min-w-[145px]">

                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Status
                        </p>

                        <span
                          className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyle.wrapper}`}
                        >
                          <StatusIcon size={13} />
                          {status}
                        </span>

                      </div>

                      <div className="min-w-[120px] text-right">

                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Amount
                        </p>

                        <p className="mt-2 text-lg font-extrabold text-[#0B1F3A]">
                          ₹{formatCurrency(order.amount)}
                        </p>

                      </div>

                    </div>

                    {/* Mobile / Small Tablet Card */}

                    <div className="lg:hidden">

                      <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">

                          <p className="break-all text-sm font-bold text-[#0B1F3A]">
                            Order #{order._id}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatDate(order.createdAt)}
                          </p>

                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1.5 text-[11px] font-bold ${statusStyle.wrapper}`}
                        >
                          <StatusIcon size={12} />
                          {status}
                        </span>

                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <div className="rounded-xl bg-slate-50 p-3">

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Products
                          </p>

                          <p className="mt-1.5 text-sm font-bold text-[#0B1F3A]">
                            {order.items?.length || 0}{" "}
                            {order.items?.length === 1
                              ? "Product"
                              : "Products"}
                          </p>

                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Amount
                          </p>

                          <p className="mt-1.5 text-sm font-extrabold text-[#0B1F3A]">
                            ₹{formatCurrency(order.amount)}
                          </p>

                        </div>

                      </div>

                      <div className="mt-3 rounded-xl border border-slate-100 p-3">

                        <div className="flex items-center justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-2">

                            <CreditCard
                              size={15}
                              className="shrink-0 text-slate-400"
                            />

                            <p className="truncate text-xs font-bold text-slate-600">
                              {order.paymentMethod ===
                              "RAZORPAY"
                                ? "Online Payment"
                                : "Cash on Delivery"}
                            </p>

                          </div>

                          <span
                            className={`shrink-0 text-xs font-bold ${
                              order.payment
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {order.payment
                              ? "Paid"
                              : "Pending"}
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>
                )
              })}

            </div>
          )}

        </section>

        {/* =================================
            QUICK ACTIONS
        ================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:mt-8 sm:p-6">

          <div>

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B1F3A] text-white">
                <LayoutDashboard size={17} />
              </div>

              <h2 className="text-lg font-extrabold text-[#0B1F3A] sm:text-xl">
                Quick Actions
              </h2>

            </div>

            <p className="mt-2 text-sm text-slate-500">
              Quickly manage your ShopX store.
            </p>

          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">

            {/* Products */}

            <Link
              to="/admin/products"
              className="group rounded-2xl border border-slate-200 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Boxes size={21} />
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                />

              </div>

              <h3 className="mt-5 font-bold text-[#0B1F3A]">
                Manage Products
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Add, edit and delete products from
                your store.
              </p>

            </Link>

            {/* Orders */}

            <Link
              to="/admin/orders"
              className="group rounded-2xl border border-slate-200 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <ShoppingBag size={21} />
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                />

              </div>

              <h3 className="mt-5 font-bold text-[#0B1F3A]">
                Manage Orders
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                View orders and update delivery
                status.
              </p>

            </Link>

            {/* Users */}

            <Link
              to="/admin/users"
              className="group rounded-2xl border border-slate-200 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <UserRound size={21} />
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                />

              </div>

              <h3 className="mt-5 font-bold text-[#0B1F3A]">
                Manage Users
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                View and manage registered users.
              </p>

            </Link>

          </div>

        </section>

      </div>

    </main>
  )
}

export default AdminDashboard