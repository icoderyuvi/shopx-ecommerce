import { useContext, useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL

import { Link } from "react-router-dom"
import {
  AlertCircle,
  CalendarDays,
  Check,
  ChevronRight,
  CreditCard,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShoppingBag,
  Truck,
  XCircle
} from "lucide-react"

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

  const getStatusStyle = (status) => {
    if (status === "Delivered") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    }

    if (status === "Cancelled") {
      return "border-red-200 bg-red-50 text-red-700"
    }

    return "border-blue-200 bg-blue-50 text-blue-700"
  }

  const getStatusIcon = (status) => {
    if (status === "Delivered") {
      return <Check size={14} strokeWidth={3} />
    }

    if (status === "Cancelled") {
      return <XCircle size={14} strokeWidth={2.5} />
    }

    return <Truck size={14} strokeWidth={2.5} />
  }

  /*
   * ============================
   * NOT LOGGED IN
   * ============================
   */

  if (!isLoggedIn) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-md">

          <div className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Package size={30} />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-3xl">
              Please Login
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
              Login to your ShopX account to view your orders and track your deliveries.
            </p>

            <Link
              to="/login"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20"
            >
              Login to Continue
              <ChevronRight size={17} />
            </Link>

            <Link
              to="/products"
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-[#0B1F3A] transition hover:border-blue-300 hover:bg-blue-50"
            >
              Continue Shopping
            </Link>

          </div>
        </div>
      </main>
    )
  }

  /*
   * ============================
   * LOADING
   * ============================
   */

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">

          <div className="mb-8">
            <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-slate-200" />
          </div>

          <div className="space-y-6">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="animate-pulse p-5">
                  <div className="h-5 w-32 rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-52 rounded bg-slate-100" />
                </div>

                <div className="border-t border-slate-100 p-5">
                  <div className="flex gap-4">
                    <div className="h-20 w-20 rounded-xl bg-slate-200" />
                    <div className="flex-1">
                      <div className="h-5 w-48 rounded bg-slate-200" />
                      <div className="mt-3 h-4 w-24 rounded bg-slate-100" />
                      <div className="mt-2 h-4 w-20 rounded bg-slate-100" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
      <main className="min-h-[70vh] bg-slate-50 px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-md">

          <div className="rounded-3xl border border-red-100 bg-white p-7 text-center shadow-sm sm:p-10">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle size={30} />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold text-[#0B1F3A]">
              Something Went Wrong
            </h1>

            <p className="mt-3 break-words text-sm leading-6 text-red-500">
              {error}
            </p>

            <button
              onClick={fetchOrders}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

          </div>
        </div>
      </main>
    )
  }

  /*
   * ============================
   * EMPTY ORDERS
   * ============================
   */

  if (orders.length === 0) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-md">

          <div className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
              <ShoppingBag size={36} />
            </div>

            <h1 className="mt-7 text-2xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-3xl">
              No Orders Yet
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              You haven't placed any orders yet. Explore our collection and find something you love.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20"
            >
              Start Shopping
              <ChevronRight size={17} />
            </Link>

          </div>
        </div>
      </main>
    )
  }

  /*
   * ============================
   * ORDERS
   * ============================
   */

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">

      <div className="mx-auto max-w-6xl">

        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              <Package size={13} />
              Your Orders
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              View your order history and track your deliveries.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-[#0B1F3A] shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            Continue Shopping
            <ChevronRight size={16} />
          </Link>

        </div>

        {/* Orders */}
        <div className="space-y-6 sm:space-y-8">

          {orders.map((order) => {

            const currentStep = getStepIndex(order.status)

            return (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
              >

                {/* =========================
                    ORDER HEADER
                ========================= */}

                <div className="border-b border-slate-100 bg-gradient-to-r from-[#0B1F3A] to-[#12345f] p-5 text-white sm:p-6">

                  <div className="flex flex-col gap-4">

                    <div className="flex flex-col gap-1">

                      <div className="flex items-center gap-2 text-xs font-medium text-blue-200">
                        <Package size={14} />
                        Order ID
                      </div>

                      <p className="break-all text-sm font-bold text-white sm:text-base">
                        #{order._id}
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${
                          order.payment
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        <CreditCard size={13} />

                        {order.payment
                          ? "Payment Successful"
                          : "Payment Pending"}
                      </span>

                    </div>

                  </div>

                </div>

                {/* =========================
                    ORDER TRACKING
                ========================= */}

                {order.status !== "Cancelled" && (
                  <div className="border-b border-slate-100 p-5 sm:p-6">

                    <div className="mb-7 flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Truck size={18} />
                      </div>

                      <div>
                        <h2 className="text-base font-bold text-[#0B1F3A] sm:text-lg">
                          Order Tracking
                        </h2>

                        <p className="text-xs text-slate-500">
                          Follow your order journey
                        </p>
                      </div>
                    </div>

                    {/* Mobile Tracking */}
                    <div className="relative sm:hidden">

                      {orderSteps.map((step, index) => {

                        const completed = index <= currentStep
                        const isCurrent = index === currentStep
                        const isLast = index === orderSteps.length - 1

                        return (
                          <div
                            key={step}
                            className="relative flex gap-4"
                          >

                            {!isLast && (
                              <div
                                className={`absolute left-[15px] top-8 h-full w-0.5 ${
                                  index < currentStep
                                    ? "bg-blue-600"
                                    : "bg-slate-200"
                                }`}
                              />
                            )}

                            <div
                              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                                completed
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-slate-200 bg-white text-slate-400"
                              }`}
                            >
                              {completed ? (
                                <Check size={15} strokeWidth={3} />
                              ) : (
                                index + 1
                              )}
                            </div>

                            <div className="pb-7">

                              <p
                                className={`text-sm font-bold ${
                                  isCurrent
                                    ? "text-blue-600"
                                    : completed
                                    ? "text-[#0B1F3A]"
                                    : "text-slate-400"
                                }`}
                              >
                                {step}
                              </p>

                              {isCurrent && (
                                <span className="mt-1 inline-block text-xs font-medium text-slate-500">
                                  Current Status
                                </span>
                              )}

                            </div>

                          </div>
                        )
                      })}

                    </div>

                    {/* Desktop Tracking */}
                    <div className="relative hidden sm:block">

                      <div className="absolute left-0 right-0 top-4 h-1 rounded-full bg-slate-200" />

                      <div
                        className="absolute left-0 top-4 h-1 rounded-full bg-blue-600 transition-all duration-500"
                        style={{
                          width:
                            currentStep >= 0
                              ? `${(currentStep / (orderSteps.length - 1)) * 100}%`
                              : "0%"
                        }}
                      />

                      <div className="relative grid grid-cols-5">

                        {orderSteps.map((step, index) => {

                          const completed = index <= currentStep
                          const isCurrent = index === currentStep

                          return (
                            <div
                              key={step}
                              className="flex flex-col items-center text-center"
                            >

                              <div
                                className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white text-xs font-bold shadow-sm ${
                                  completed
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-200 text-slate-500"
                                }`}
                              >
                                {completed ? (
                                  <Check size={14} strokeWidth={3} />
                                ) : (
                                  index + 1
                                )}
                              </div>

                              <p
                                className={`mt-3 text-xs font-bold lg:text-sm ${
                                  isCurrent
                                    ? "text-blue-600"
                                    : completed
                                    ? "text-[#0B1F3A]"
                                    : "text-slate-400"
                                }`}
                              >
                                {step}
                              </p>

                              {isCurrent && (
                                <p className="mt-1 text-[11px] font-medium text-slate-500">
                                  Current Status
                                </p>
                              )}

                            </div>
                          )
                        })}

                      </div>
                    </div>

                  </div>
                )}

                {/* =========================
                    CANCELLED
                ========================= */}

                {order.status === "Cancelled" && (
                  <div className="border-b border-red-100 bg-red-50 p-5 sm:p-6">

                    <div className="flex items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                        <XCircle size={20} />
                      </div>

                      <div>
                        <h2 className="font-bold text-red-700">
                          Order Cancelled
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-red-600">
                          This order has been cancelled.
                        </p>
                      </div>

                    </div>

                  </div>
                )}

                {/* =========================
                    PRODUCTS
                ========================= */}

                <div>

                  <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 sm:px-6">
                    <ShoppingBag
                      size={17}
                      className="text-blue-600"
                    />

                    <h2 className="text-sm font-bold text-[#0B1F3A]">
                      Ordered Items
                    </h2>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                      {order.items.length}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">

                    {order.items.map((item, index) => (

                      <div
                        key={`${item.productId}-${index}`}
                        className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6"
                      >

                        <div className="flex gap-4">

                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-24">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>

                          <div className="min-w-0 flex-1 sm:hidden">

                            <h2 className="line-clamp-2 text-sm font-bold text-[#0B1F3A]">
                              {item.name}
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                              Size: {item.size}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Quantity: {item.quantity}
                            </p>

                          </div>

                        </div>

                        {/* Desktop Product Details */}
                        <div className="hidden flex-1 sm:block">

                          <h2 className="font-bold text-[#0B1F3A]">
                            {item.name}
                          </h2>

                          <div className="mt-2 flex flex-wrap gap-2">

                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                              Size: {item.size}
                            </span>

                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                              Qty: {item.quantity}
                            </span>

                          </div>

                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">

                          <div>
                            <p className="text-xs font-medium text-slate-400">
                              Price
                            </p>

                            <p className="mt-1 font-bold text-[#0B1F3A]">
                              ₹
                              {Number(item.price).toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>

                          <div className="sm:mt-2">

                            <p className="text-xs font-medium text-slate-400 sm:hidden">
                              Total
                            </p>

                            <p className="text-sm font-extrabold text-blue-600 sm:text-base">
                              ₹
                              {(
                                Number(item.price) *
                                Number(item.quantity)
                              ).toLocaleString("en-IN")}
                            </p>

                          </div>

                        </div>

                      </div>
                    ))}

                  </div>

                </div>

                {/* =========================
                    ORDER SUMMARY
                ========================= */}

                <div className="border-t border-slate-100 bg-slate-50 p-5 sm:p-6">

                  <div className="grid gap-5 sm:grid-cols-3">

                    {/* Payment */}
                    <div className="flex gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                        <CreditCard size={18} />
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Payment Method
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#0B1F3A]">
                          {order.paymentMethod === "RAZORPAY"
                            ? "Online Payment"
                            : "Cash on Delivery"}
                        </p>
                      </div>

                    </div>

                    {/* Date */}
                    <div className="flex gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                        <CalendarDays size={18} />
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Order Date
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#0B1F3A]">
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      </div>

                    </div>

                    {/* Total */}
                    <div className="rounded-xl border border-blue-100 bg-white p-4 sm:p-0 sm:border-0 sm:bg-transparent">

                      <p className="text-xs font-medium text-slate-500">
                        Total Amount
                      </p>

                      <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#0B1F3A]">
                        ₹
                        {Number(order.amount).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>

                  </div>

                  {/* =========================
                      ADDRESS
                  ========================= */}

                  <div className="mt-6 border-t border-slate-200 pt-5">

                    <div className="flex items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                        <MapPin size={18} />
                      </div>

                      <div className="min-w-0">

                        <p className="text-xs font-medium text-slate-500">
                          Delivery Address
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#0B1F3A]">
                          {order.address?.firstName}{" "}
                          {order.address?.lastName}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
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

                        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                          <Phone size={14} />
                          <span>
                            {order.address?.phone}
                          </span>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )
          })}

        </div>

      </div>
    </main>
  )
}

export default Orders