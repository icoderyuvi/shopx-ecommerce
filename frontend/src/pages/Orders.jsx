import { useContext, useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL
import { Link } from "react-router-dom"
import { ShopContext } from "../context/ShopContext"

function Orders() {
  const { isLoggedIn } = useContext(ShopContext)

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const orderSteps = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for Delivery",
    "Delivered"
  ]

  const fetchOrders = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        `${API_URL}/api/order/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch orders")
      }

      setOrders(Array.isArray(data.orders) ? data.orders : [])
    } catch (error) {
      console.error("Fetch orders error:", error)
      setError(error.message || "Unable to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [isLoggedIn])

  const getStepIndex = (status) => {
    return orderSteps.indexOf(status)
  }

  if (!isLoggedIn) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">
          Please Login
        </h1>

        <p className="mt-3 text-gray-500">
          Login to view your orders.
        </p>

        <Link
          to="/login"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          Login
        </Link>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-gray-500">
          Loading your orders...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">
          Something went wrong
        </h1>

        <p className="mt-3 text-red-500">
          {error}
        </p>

        <button
          onClick={fetchOrders}
          className="mt-6 rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          Try Again
        </button>
      </main>
    )
  }

  if (orders.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">
          No Orders Yet
        </h1>

        <p className="mt-3 text-gray-500">
          You haven't placed any orders yet.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white"
        >
          Start Shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">

      {/* Page Heading */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          My Orders
        </h1>

        <p className="mt-2 text-gray-500">
          View your order history and track your deliveries.
        </p>
      </div>

      <div className="space-y-8">

        {orders.map((order) => {

          const currentStep = getStepIndex(order.status)

          return (
            <div
              key={order._id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >

              {/* Order Header */}
              <div className="flex flex-col gap-4 border-b bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <p className="mt-1 break-all font-semibold">
                    #{order._id}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      order.payment
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {order.payment
                      ? "Payment Successful"
                      : "Payment Pending"}
                  </span>

                </div>
              </div>

              {/* Order Tracking */}
              {order.status !== "Cancelled" && (
                <div className="border-b p-6">

                  <h2 className="mb-8 text-lg font-bold">
                    Order Tracking
                  </h2>

                  <div className="relative">

                    {/* Progress Line */}
                    <div className="absolute left-0 right-0 top-5 hidden h-1 bg-gray-200 sm:block" />

                    <div
                      className="absolute left-0 top-5 hidden h-1 bg-black transition-all duration-500 sm:block"
                      style={{
                        width:
                          currentStep >= 0
                            ? `${(currentStep / (orderSteps.length - 1)) * 100}%`
                            : "0%"
                      }}
                    />

                    {/* Steps */}
                    <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-5 sm:gap-0">

                      {orderSteps.map((step, index) => {

                        const completed =
                          index <= currentStep

                        const isCurrent =
                          index === currentStep

                        return (
                          <div
                            key={step}
                            className="flex items-center gap-4 sm:flex-col sm:gap-3 sm:text-center"
                          >

                            {/* Circle */}
                            <div
                              className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white text-sm font-bold shadow ${
                                completed
                                  ? "bg-black text-white"
                                  : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              {completed ? "✓" : index + 1}
                            </div>

                            <div>
                              <p
                                className={`text-sm font-semibold ${
                                  isCurrent
                                    ? "text-black"
                                    : completed
                                    ? "text-gray-700"
                                    : "text-gray-400"
                                }`}
                              >
                                {step}
                              </p>

                              {isCurrent && (
                                <p className="mt-1 text-xs text-gray-500">
                                  Current Status
                                </p>
                              )}
                            </div>

                          </div>
                        )
                      })}

                    </div>
                  </div>
                </div>
              )}

              {/* Cancelled Message */}
              {order.status === "Cancelled" && (
                <div className="border-b bg-red-50 p-6">
                  <h2 className="font-bold text-red-700">
                    Order Cancelled
                  </h2>

                  <p className="mt-1 text-sm text-red-600">
                    This order has been cancelled.
                  </p>
                </div>
              )}

              {/* Products */}
              <div className="divide-y">

                {order.items.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded-xl object-cover"
                    />

                    <div className="flex-1">

                      <h2 className="font-semibold">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Size: {item.size}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                    </div>

                    <div className="text-left sm:text-right">

                      <p className="font-semibold">
                        ₹
                        {Number(item.price).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        ₹
                        {(
                          Number(item.price) *
                          Number(item.quantity)
                        ).toLocaleString("en-IN")}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

              {/* Order Footer */}
              <div className="border-t bg-gray-50 p-5">

                <div className="grid gap-5 sm:grid-cols-3">

                  <div>
                    <p className="text-sm text-gray-500">
                      Payment Method
                    </p>

                    <p className="mt-1 font-semibold">
                      {order.paymentMethod === "RAZORPAY"
                        ? "Online Payment"
                        : "Cash on Delivery"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Order Date
                    </p>

                    <p className="mt-1 font-semibold">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Total Amount
                    </p>

                    <p className="mt-1 text-xl font-bold">
                      ₹
                      {Number(order.amount).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                </div>

                {/* Address */}
                <div className="mt-6 border-t pt-5">

                  <p className="text-sm text-gray-500">
                    Delivery Address
                  </p>

                  <p className="mt-1 font-medium">
                    {order.address?.firstName}{" "}
                    {order.address?.lastName}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {order.address?.street}
                    {order.address?.city
                      ? `, ${order.address.city}`
                      : ""}
                    {order.address?.state
                      ? `, ${order.address.state}`
                      : ""}
                    {order.address?.zipcode
                      ? ` - ${order.address.zipcode}`
                      : ""}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Phone: {order.address?.phone}
                  </p>

                </div>

              </div>

            </div>
          )
        })}

      </div>
    </main>
  )
}

export default Orders