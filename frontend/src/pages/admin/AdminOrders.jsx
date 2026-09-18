
import { useEffect, useMemo, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL

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

      setOrders(prev =>
        prev.map(order =>
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
      alert(error.message || "Unable to update order status")
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusClass = status => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700"

      case "Cancelled":
        return "bg-red-100 text-red-700"

      case "Out for Delivery":
        return "bg-blue-100 text-blue-700"

      case "Shipped":
        return "bg-purple-100 text-purple-700"

      case "Packing":
        return "bg-orange-100 text-orange-700"

      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const filteredOrders = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    return orders.filter(order => {
      const matchesSearch =
        !searchText ||
        order._id?.toLowerCase().includes(searchText) ||
        order.userId?.toString().toLowerCase().includes(searchText) ||
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="mt-4 text-gray-500">
              Loading orders...
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
              ⚠️
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Unable to Load Orders
            </h1>

            <p className="mt-3 text-red-500">
              {error}
            </p>

            <button
              onClick={() => fetchOrders()}
              className="mt-6 rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
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

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Orders
            </h1>

            <p className="mt-2 text-gray-500">
              Manage customer orders and delivery status.
            </p>
          </div>

          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center rounded-xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? "Refreshing..." : "↻ Refresh Orders"}
          </button>

        </div>

        {/* Statistics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-bold">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Active Orders
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                orders.filter(
                  order =>
                    order.status !== "Delivered" &&
                    order.status !== "Cancelled"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Order Value
            </p>

            <p className="mt-2 text-3xl font-bold">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>

        </div>

        {/* Search and Filters */}
        <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">

          <div className="grid gap-4 md:grid-cols-[1fr_220px]">

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Search Orders
              </label>

              <div className="relative">

                <input
                  type="text"
                  value={search}
                  onChange={e =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search order ID, customer or phone..."
                  className="w-full rounded-xl border px-4 py-3 pr-10 outline-none transition focus:border-black"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  >
                    ✕
                  </button>
                )}

              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Order Status
              </label>

              <select
                value={statusFilter}
                onChange={e =>
                  setStatusFilter(e.target.value)
                }
                className="w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-black"
              >
                <option value="All">
                  All Statuses
                </option>

                {statuses.map(status => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {(search || statusFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("")
                setStatusFilter("All")
              }}
              className="mt-4 text-sm font-semibold underline"
            >
              Clear Filters
            </button>
          )}

        </div>

        {/* Empty Filter Result */}
        {orders.length > 0 &&
          filteredOrders.length === 0 && (
            <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                🔎
              </div>

              <h2 className="mt-5 text-xl font-bold">
                No Matching Orders
              </h2>

              <p className="mt-2 text-gray-500">
                Try changing your search or status filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("")
                  setStatusFilter("All")
                }}
                className="mt-6 rounded-lg bg-black px-6 py-3 font-semibold text-white"
              >
                Clear Filters
              </button>

            </div>
          )}

        {/* No Orders */}
        {orders.length === 0 && (
          <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
              🛒
            </div>

            <h2 className="mt-5 text-xl font-bold">
              No Orders Yet
            </h2>

            <p className="mt-2 text-gray-500">
              Customer orders will appear here.
            </p>

          </div>
        )}

        {/* Orders */}
        {filteredOrders.length > 0 && (
          <div className="space-y-6">

            {filteredOrders.map(order => (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              >

                {/* Order Header */}
                <div className="border-b bg-gray-50 p-5">

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div className="min-w-0">

                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Order ID
                      </p>

                      <p className="mt-1 break-all font-semibold text-gray-900">
                        #{order._id}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleString("en-IN")
                          : "Date unavailable"}
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          order.paymentMethod === "RAZORPAY"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.paymentMethod === "RAZORPAY"
                          ? "Online Payment"
                          : "Cash on Delivery"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          order.payment
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.payment
                          ? "Payment Successful"
                          : "Payment Pending"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status || "Order Placed"}
                      </span>

                    </div>

                  </div>

                </div>

                {/* Order Content */}
                <div className="grid gap-6 p-5 lg:grid-cols-3">

                  {/* Customer */}
                  <div>

                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Customer
                    </h2>

                    <div className="rounded-xl bg-gray-50 p-4">

                      <p className="text-sm font-medium text-gray-900">
                        {order.address?.name ||
                          "Customer"}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        User ID
                      </p>

                      <p className="mt-1 break-all text-xs text-gray-600">
                        {order.userId}
                      </p>

                      <div className="mt-4 border-t pt-4">

                        <p className="text-sm font-medium text-gray-900">
                          Delivery Address
                        </p>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {order.address?.address ||
                            "-"}
                          <br />

                          {order.address?.city || "-"},{" "}
                          {order.address?.state || "-"}
                          <br />

                          {order.address?.pincode || "-"}
                          <br />

                          Phone:{" "}
                          {order.address?.phone || "-"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Products */}
                  <div>

                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Products
                    </h2>

                    <div className="space-y-3">

                      {order.items?.map(
                        (item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            className="flex gap-3 rounded-xl bg-gray-50 p-3"
                          >

                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-16 w-16 shrink-0 rounded-lg object-cover"
                            />

                            <div className="min-w-0 flex-1">

                              <p className="truncate text-sm font-semibold text-gray-900">
                                {item.name}
                              </p>

                              <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-gray-500">
                                <span>
                                  Size:{" "}
                                  {item.size || "-"}
                                </span>

                                <span>
                                  Qty:{" "}
                                  {item.quantity}
                                </span>
                              </div>

                              <p className="mt-2 text-sm font-semibold">
                                ₹
                                {Number(
                                  item.price || 0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>

                            </div>

                          </div>
                        )
                      )}

                    </div>

                  </div>

                  {/* Order Management */}
                  <div>

                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Order Management
                    </h2>

                    <div className="rounded-xl bg-gray-50 p-4">

                      <p className="text-sm text-gray-500">
                        Total Amount
                      </p>

                      <p className="mt-1 text-2xl font-bold text-gray-900">
                        ₹
                        {Number(
                          order.amount || 0
                        ).toLocaleString("en-IN")}
                      </p>

                      <div className="mt-5">

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Update Order Status
                        </label>

                        <select
                          value={
                            order.status ||
                            "Order Placed"
                          }
                          disabled={
                            updatingId === order._id
                          }
                          onChange={e =>
                            updateStatus(
                              order._id,
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {statuses.map(status => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}
                        </select>

                        {updatingId ===
                          order._id && (
                          <p className="mt-2 text-xs text-gray-500">
                            Updating status...
                          </p>
                        )}

                      </div>

                      {order.paymentMethod ===
                        "RAZORPAY" &&
                        order.razorpayPaymentId && (
                          <div className="mt-5 border-t pt-4">

                            <p className="text-xs font-medium text-gray-500">
                              Razorpay Payment ID
                            </p>

                            <p className="mt-1 break-all text-xs text-gray-700">
                              {order.razorpayPaymentId}
                            </p>

                          </div>
                        )}

                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  )
}

export default AdminOrders

