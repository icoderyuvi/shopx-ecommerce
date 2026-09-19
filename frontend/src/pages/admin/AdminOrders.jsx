import { useEffect, useMemo, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  User,
  X,
  XCircle
} from "lucide-react"

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const statuses = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
  ]

  const fetchOrders = async (showRefresh = false) => {
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
        `${API_URL}/api/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load orders"
        )
      }

      setOrders(
        Array.isArray(data.orders)
          ? data.orders
          : []
      )
    } catch (error) {
      console.error("Fetch orders error:", error)
      setError(error.message || "Unable to load orders")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId)

      const token = localStorage.getItem("token")

      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update status"
        )
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: data.order.status
              }
            : order
        )
      )
    } catch (error) {
      console.error("Update status error:", error)
      alert(
        error.message ||
          "Unable to update order status"
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "Delivered":
        return {
          className:
            "bg-emerald-50 text-emerald-700 border-emerald-100",
          icon: CheckCircle2
        }

      case "Cancelled":
        return {
          className:
            "bg-red-50 text-red-700 border-red-100",
          icon: XCircle
        }

      case "Out for Delivery":
        return {
          className:
            "bg-blue-50 text-blue-700 border-blue-100",
          icon: Truck
        }

      case "Shipped":
        return {
          className:
            "bg-violet-50 text-violet-700 border-violet-100",
          icon: Truck
        }

      case "Packing":
        return {
          className:
            "bg-amber-50 text-amber-700 border-amber-100",
          icon: Package
        }

      default:
        return {
          className:
            "bg-slate-100 text-slate-700 border-slate-200",
          icon: Clock3
        }
    }
  }

  const filteredOrders = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    return orders.filter((order) => {
      const matchesSearch =
        !searchText ||
        order._id
          ?.toLowerCase()
          .includes(searchText) ||
        order.userId
          ?.toString()
          .toLowerCase()
          .includes(searchText) ||
        order.address?.name
          ?.toLowerCase()
          .includes(searchText) ||
        order.address?.phone
          ?.toString()
          .includes(searchText)

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, search, statusFilter])

  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.amount || 0),
    0
  )

  const activeOrders = orders.filter(
    (order) =>
      order.status !== "Delivered" &&
      order.status !== "Cancelled"
  ).length

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  ).length

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`

  const clearFilters = () => {
    setSearch("")
    setStatusFilter("All")
  }

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[65vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B1F3A] text-white shadow-lg shadow-[#0B1F3A]/10">
                <RefreshCw
                  size={24}
                  className="animate-spin"
                />
              </div>

              <h2 className="mt-5 text-lg font-extrabold text-[#0B1F3A]">
                Loading orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Fetching the latest customer orders...
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Error
  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[65vh] max-w-4xl items-center justify-center">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle size={30} />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold text-[#0B1F3A]">
              Unable to Load Orders
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-red-500">
              {error}
            </p>

            <button
              onClick={() => fetchOrders()}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
              <ShoppingBag size={13} />
              Order Management
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-4xl">
              Orders
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage customer orders, payments and delivery
              status from one place.
            </p>
          </div>

          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#0B1F3A] shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh Orders"}
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Orders
                </p>

                <p className="mt-2 text-3xl font-extrabold text-[#0B1F3A]">
                  {orders.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ShoppingBag size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs font-semibold text-slate-400">
              All customer orders
            </p>
          </div>

          {/* Active */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active Orders
                </p>

                <p className="mt-2 text-3xl font-extrabold text-[#0B1F3A]">
                  {activeOrders}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock3 size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs font-semibold text-slate-400">
              Currently being processed
            </p>
          </div>

          {/* Delivered */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Delivered
                </p>

                <p className="mt-2 text-3xl font-extrabold text-[#0B1F3A]">
                  {deliveredOrders}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs font-semibold text-slate-400">
              Successfully completed
            </p>
          </div>

          {/* Revenue */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Order Value
                </p>

                <p className="mt-2 text-2xl font-extrabold text-[#0B1F3A] sm:text-3xl">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <CircleDollarSign size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs font-semibold text-slate-400">
              Total order value
            </p>
          </div>
        </div>

        {/* Cancelled info */}
        {cancelledOrders > 0 && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <XCircle size={17} />
            </div>

            <div>
              <p className="text-sm font-bold text-red-700">
                {cancelledOrders} cancelled{" "}
                {cancelledOrders === 1
                  ? "order"
                  : "orders"}
              </p>

              <p className="text-xs text-red-600/80">
                These orders are marked as cancelled.
              </p>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Search size={17} />
            </div>

            <div>
              <h2 className="text-sm font-extrabold text-[#0B1F3A]">
                Find Orders
              </h2>

              <p className="text-xs text-slate-400">
                Search by order, customer or phone number
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_230px]">

            {/* Search */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Search Orders
              </label>

              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Order ID, customer or phone..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-11 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-[#0B1F3A]"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Order Status
              </label>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="All">
                    All Statuses
                  </option>

                  {statuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          {(search || statusFilter !== "All") && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-500">
                Showing{" "}
                <span className="font-extrabold text-[#0B1F3A]">
                  {filteredOrders.length}
                </span>{" "}
                of{" "}
                <span className="font-extrabold text-[#0B1F3A]">
                  {orders.length}
                </span>{" "}
                orders
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-blue-600 transition hover:text-blue-700 hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* No Matching Orders */}
        {orders.length > 0 &&
          filteredOrders.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm sm:p-14">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Search size={27} />
              </div>

              <h2 className="mt-5 text-xl font-extrabold text-[#0B1F3A]">
                No Matching Orders
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* No Orders */}
        {orders.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm sm:p-14">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <ShoppingBag size={28} />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-[#0B1F3A]">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Customer orders will appear here once they
              place an order through the storefront.
            </p>
          </div>
        )}

        {/* Orders */}
        {filteredOrders.length > 0 && (
          <div className="space-y-5">

            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(
                order.status
              )

              const StatusIcon =
                statusConfig.icon

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >

                  {/* Order Header */}
                  <div className="border-b border-slate-100 bg-slate-50/80 p-5 sm:px-6">

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-lg bg-[#0B1F3A] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                            Order
                          </span>

                          <p className="break-all text-sm font-extrabold text-[#0B1F3A]">
                            #{order._id}
                          </p>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 size={13} />

                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toLocaleString(
                                  "en-IN"
                                )
                              : "Date unavailable"}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Package size={13} />

                            {order.items?.length ||
                              0}{" "}
                            {order.items?.length === 1
                              ? "item"
                              : "items"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">

                        {/* Payment Method */}
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${
                            order.paymentMethod ===
                            "RAZORPAY"
                              ? "border-blue-100 bg-blue-50 text-blue-700"
                              : "border-amber-100 bg-amber-50 text-amber-700"
                          }`}
                        >
                          <CreditCard size={13} />

                          {order.paymentMethod ===
                          "RAZORPAY"
                            ? "Online Payment"
                            : "Cash on Delivery"}
                        </span>

                        {/* Payment Status */}
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${
                            order.payment
                              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                              : "border-red-100 bg-red-50 text-red-700"
                          }`}
                        >
                          {order.payment ? (
                            <CheckCircle2
                              size={13}
                            />
                          ) : (
                            <AlertCircle
                              size={13}
                            />
                          )}

                          {order.payment
                            ? "Paid"
                            : "Payment Pending"}
                        </span>

                        {/* Order Status */}
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${statusConfig.className}`}
                        >
                          <StatusIcon size={13} />
                          {order.status ||
                            "Order Placed"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-3">

                    {/* Customer */}
                    <section>
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <User size={15} />
                        </div>

                        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                          Customer
                        </h2>
                      </div>

                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

                        <p className="text-sm font-extrabold text-[#0B1F3A]">
                          {order.address?.name ||
                            "Customer"}
                        </p>

                        <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          User ID
                        </p>

                        <p className="mt-1 break-all text-xs font-medium text-slate-600">
                          {order.userId || "-"}
                        </p>

                        <div className="my-4 border-t border-slate-200" />

                        <div className="flex items-start gap-2">
                          <MapPin
                            size={15}
                            className="mt-0.5 shrink-0 text-blue-600"
                          />

                          <div>
                            <p className="text-xs font-bold text-slate-700">
                              Delivery Address
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {order.address?.address ||
                                "-"}
                              <br />

                              {order.address?.city ||
                                "-"}
                              ,{" "}
                              {order.address?.state ||
                                "-"}
                              <br />

                              {order.address?.pincode ||
                                "-"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-4">
                          <Phone
                            size={14}
                            className="text-blue-600"
                          />

                          <span className="text-xs font-bold text-slate-600">
                            {order.address?.phone ||
                              "-"}
                          </span>
                        </div>
                      </div>
                    </section>

                    {/* Products */}
                    <section>
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <ShoppingBag size={15} />
                        </div>

                        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                          Products
                        </h2>
                      </div>

                      <div className="space-y-3">
                        {order.items?.map(
                          (item, index) => (
                            <div
                              key={`${order._id}-${index}`}
                              className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"
                            >
                              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-extrabold text-[#0B1F3A]">
                                  {item.name}
                                </p>

                                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-slate-500">
                                  <span>
                                    Size:{" "}
                                    <strong className="text-slate-700">
                                      {item.size ||
                                        "-"}
                                    </strong>
                                  </span>

                                  <span>
                                    Qty:{" "}
                                    <strong className="text-slate-700">
                                      {item.quantity}
                                    </strong>
                                  </span>
                                </div>

                                <p className="mt-2 text-sm font-extrabold text-blue-600">
                                  {formatCurrency(
                                    item.price
                                  )}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </section>

                    {/* Management */}
                    <section>
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Truck size={15} />
                        </div>

                        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                          Order Management
                        </h2>
                      </div>

                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Total Amount
                        </p>

                        <p className="mt-1 text-3xl font-extrabold text-[#0B1F3A]">
                          {formatCurrency(
                            order.amount
                          )}
                        </p>

                        <div className="mt-5">
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                            Update Order Status
                          </label>

                          <div className="relative">
                            <select
                              value={
                                order.status ||
                                "Order Placed"
                              }
                              disabled={
                                updatingId ===
                                order._id
                              }
                              onChange={(e) =>
                                updateStatus(
                                  order._id,
                                  e.target.value
                                )
                              }
                              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {statuses.map(
                                (status) => (
                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {status}
                                  </option>
                                )
                              )}
                            </select>

                            <ChevronDown
                              size={16}
                              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                          </div>

                          {updatingId ===
                            order._id && (
                            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-blue-600">
                              <RefreshCw
                                size={13}
                                className="animate-spin"
                              />
                              Updating status...
                            </div>
                          )}
                        </div>

                        {order.paymentMethod ===
                          "RAZORPAY" &&
                          order.razorpayPaymentId && (
                            <div className="mt-5 border-t border-slate-200 pt-4">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Razorpay Payment ID
                              </p>

                              <p className="mt-1.5 break-all rounded-lg bg-white p-2.5 text-[11px] font-medium text-slate-600">
                                {
                                  order.razorpayPaymentId
                                }
                              </p>
                            </div>
                          )}
                      </div>
                    </section>
                  </div>

                  {/* Bottom status strip */}
                  <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 sm:px-6">
                    <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-2 text-slate-500">
                        <CircleDollarSign
                          size={14}
                          className="text-blue-600"
                        />

                        <span>
                          Payment:{" "}
                          <strong className="text-slate-700">
                            {order.payment
                              ? "Successful"
                              : "Pending"}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500">
                        <span>
                          Status:{" "}
                          <strong className="text-[#0B1F3A]">
                            {order.status ||
                              "Order Placed"}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default AdminOrders