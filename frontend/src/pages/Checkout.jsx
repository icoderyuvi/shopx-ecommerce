import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  WalletCards
} from "lucide-react"

import { ShopContext } from "../context/ShopContext"

const API_URL = import.meta.env.VITE_API_URL

const Checkout = () => {
  const navigate = useNavigate()

  const {
    cartItems,
    getCartAmount,
    loadCart,
    delivery_fee
  } = useContext(ShopContext)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  })

  const [paymentMethod, setPaymentMethod] = useState("COD")

  const deliveryFee = Number(delivery_fee || 10)
  const subtotal = Number(getCartAmount() || 0)
  const total = subtotal + deliveryFee

  // ======================================
  // LOGIN CHECK
  // ======================================

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login", {
        replace: true
      })
    }
  }, [navigate])

  // ======================================
  // HANDLE INPUT
  // ======================================

  const handleChange = (e) => {
    setAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))

    if (error) {
      setError("")
    }
  }

  // ======================================
  // VALIDATE FORM
  // ======================================

  const validateForm = () => {
    const phoneRegex = /^[0-9]{10}$/
    const pincodeRegex = /^[0-9]{6}$/

    if (!address.firstName.trim()) {
      setError("Please enter your first name")
      return false
    }

    if (!address.lastName.trim()) {
      setError("Please enter your last name")
      return false
    }

    if (!address.email.trim()) {
      setError("Please enter your email")
      return false
    }

    if (!phoneRegex.test(address.phone.trim())) {
      setError("Please enter a valid 10-digit phone number")
      return false
    }

    if (!address.street.trim()) {
      setError("Please enter your street address")
      return false
    }

    if (!address.city.trim()) {
      setError("Please enter your city")
      return false
    }

    if (!address.state.trim()) {
      setError("Please enter your state")
      return false
    }

    if (!pincodeRegex.test(address.pincode.trim())) {
      setError("Please enter a valid 6-digit pincode")
      return false
    }

    return true
  }

  // ======================================
  // LOAD RAZORPAY SCRIPT
  // ======================================

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true)
        return
      }

      const script = document.createElement("script")

      script.id = "razorpay-script"
      script.src =
        "https://checkout.razorpay.com/v1/checkout.js"

      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)

      document.body.appendChild(script)
    })
  }

  // ======================================
  // CREATE RAZORPAY PAYMENT
  // ======================================

  const handleOnlinePayment = async (orderItems, token) => {
    const scriptLoaded = await loadRazorpayScript()

    if (!scriptLoaded) {
      setError("Unable to load Razorpay. Please try again.")
      setLoading(false)
      return
    }

    const response = await fetch(
      `${API_URL}/api/payment/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: orderItems,
          address
        })
      }
    )

    const data = await response.json()

    if (response.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      navigate("/login", {
        replace: true
      })

      return
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to create payment"
      )
    }

    // ==================================
    // RAZORPAY CHECKOUT
    // ==================================

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: data.razorpayOrder.amount,

      currency: data.razorpayOrder.currency,

      name: "ShopX",

      description: "ShopX Order Payment",

      order_id: data.razorpayOrder.id,

      prefill: {
        name: `${address.firstName} ${address.lastName}`,
        email: address.email,
        contact: address.phone
      },

      theme: {
        color: "#2563EB"
      },

      // =================================
      // PAYMENT SUCCESS
      // =================================

      handler: async function (paymentResponse) {
        try {
          setLoading(true)
          setError("")

          const verifyResponse = await fetch(
            `${API_URL}/api/payment/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature,

                items: orderItems,

                address
              })
            }
          )

          const verifyData = await verifyResponse.json()

          if (verifyResponse.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")

            navigate("/login", {
              replace: true
            })

            return
          }

          if (!verifyResponse.ok || !verifyData.success) {
            throw new Error(
              verifyData.message ||
                "Payment verification failed"
            )
          }

          await loadCart()

          alert("Payment successful! Order placed.")

          navigate("/orders", {
            replace: true
          })
        } catch (error) {
          console.error(
            "Payment verification error:",
            error
          )

          setError(
            error.message ||
              "Payment verification failed"
          )
        } finally {
          setLoading(false)
        }
      },

      // =================================
      // PAYMENT MODAL CLOSED
      // =================================

      modal: {
        ondismiss: function () {
          setLoading(false)
        }
      }
    }

    if (!window.Razorpay) {
      setError("Razorpay failed to initialize.")
      setLoading(false)
      return
    }

    const razorpay = new window.Razorpay(options)

    razorpay.on(
      "payment.failed",
      function (response) {
        console.error(
          "Payment failed:",
          response.error
        )

        setError(
          response.error?.description ||
            "Payment failed. Please try again."
        )

        setLoading(false)
      }
    )

    razorpay.open()
  }

  // ======================================
  // SUBMIT ORDER
  // ======================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) {
      return
    }

    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
      return
    }

    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty")
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      // ==================================
      // PREPARE ORDER ITEMS
      // ==================================

      const orderItems = cartItems.map((item) => {
        const productId =
          item.product?._id || item.product?.id

        if (!productId) {
          throw new Error(
            `Product ID missing for ${
              item.product?.name || "product"
            }`
          )
        }

        return {
          productId,
          size: item.size,
          quantity: Number(item.quantity)
        }
      })

      // ==================================
      // COD
      // ==================================

      if (paymentMethod === "COD") {
        const response = await fetch(
          `${API_URL}/api/order/create`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
              items: orderItems,
              address,
              paymentMethod: "COD"
            })
          }
        )

        const data = await response.json()

        if (response.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")

          navigate("/login", {
            replace: true
          })

          return
        }

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to place your order"
          )
        }

        await loadCart()

        alert("Order placed successfully!")

        navigate("/orders", {
          replace: true
        })

        return
      }

      // ==================================
      // RAZORPAY
      // ==================================

      await handleOnlinePayment(
        orderItems,
        token
      )
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      )

      setError(
        error.message ||
          "Unable to place your order"
      )

      setLoading(false)
    }
  }

  // ======================================
  // UI
  // ======================================

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ==================================
          TOP HEADER
      ================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="group mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0B1F3A]"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Cart
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B1F3A] text-white shadow-lg shadow-slate-900/10">
              <ShoppingBag size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-3xl">
                Checkout
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Complete your order securely
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================
          EMPTY CART
      ================================== */}

      {!cartItems || cartItems.length === 0 ? (

        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">

          <div className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-12">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <ShoppingBag size={36} />
            </div>

            <h2 className="mt-6 text-2xl font-extrabold text-[#0B1F3A]">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add some products to your cart before proceeding to checkout.
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#0B1F3A] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-blue-600 hover:shadow-blue-600/20"
            >
              Continue Shopping
            </button>

          </div>

        </section>

      ) : (

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
        >

          {/* ==================================
              CHECKOUT PROGRESS
          ================================== */}

          <div className="mb-6 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:block">

            <div className="flex items-center">

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  <CheckCircle2 size={17} />
                </div>

                <span className="text-sm font-bold text-[#0B1F3A]">
                  Cart
                </span>
              </div>

              <div className="mx-4 h-px flex-1 bg-blue-200" />

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1F3A] text-sm font-bold text-white">
                  2
                </div>

                <span className="text-sm font-bold text-[#0B1F3A]">
                  Checkout
                </span>
              </div>

              <div className="mx-4 h-px flex-1 bg-slate-200" />

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-sm font-bold text-slate-400">
                  3
                </div>

                <span className="text-sm font-medium text-slate-400">
                  Complete
                </span>
              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:gap-8">

            {/* ==================================
                LEFT - DELIVERY
            ================================== */}

            <div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Section Header */}

                <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <MapPin size={19} />
                    </div>

                    <div>
                      <h2 className="font-extrabold text-[#0B1F3A]">
                        Delivery Information
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Where should we deliver your order?
                      </p>
                    </div>

                  </div>

                </div>

                <div className="p-5 sm:p-6">

                  {/* Error */}

                  {error && (
                    <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600">

                      <div className="mt-0.5 shrink-0">
                        ⚠️
                      </div>

                      <p className="font-medium">
                        {error}
                      </p>

                    </div>
                  )}

                  {/* Names */}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-bold text-[#0B1F3A]">
                        First Name
                      </label>

                      <input
                        name="firstName"
                        placeholder="Enter first name"
                        value={address.firstName}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        autoComplete="given-name"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-[#0B1F3A]">
                        Last Name
                      </label>

                      <input
                        name="lastName"
                        placeholder="Enter last name"
                        value={address.lastName}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        autoComplete="family-name"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>

                  </div>

                  {/* Email */}

                  <div className="mt-5">

                    <label className="mb-2 block text-sm font-bold text-[#0B1F3A]">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={address.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                  {/* Phone */}

                  <div className="mt-5">

                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#0B1F3A]">
                      <Phone size={14} className="text-blue-600" />
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      placeholder="10-digit phone number"
                      value={address.phone}
                      onChange={handleChange}
                      maxLength="10"
                      inputMode="numeric"
                      required
                      disabled={loading}
                      autoComplete="tel"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                  {/* Street */}

                  <div className="mt-5">

                    <label className="mb-2 block text-sm font-bold text-[#0B1F3A]">
                      Street Address
                    </label>

                    <input
                      name="street"
                      placeholder="House number, street, area"
                      value={address.street}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      autoComplete="street-address"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                  {/* City / State */}

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-sm font-bold text-[#0B1F3A]">
                        City
                      </label>

                      <input
                        name="city"
                        placeholder="Enter city"
                        value={address.city}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        autoComplete="address-level2"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-bold text-[#0B1F3A]">
                        State
                      </label>

                      <input
                        name="state"
                        placeholder="Enter state"
                        value={address.state}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        autoComplete="address-level1"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                    </div>

                  </div>

                  {/* Pincode */}

                  <div className="mt-5">

                    <label className="mb-2 block text-sm font-bold text-[#0B1F3A]">
                      Pincode
                    </label>

                    <input
                      name="pincode"
                      placeholder="6-digit pincode"
                      value={address.pincode}
                      onChange={handleChange}
                      maxLength="6"
                      inputMode="numeric"
                      required
                      disabled={loading}
                      autoComplete="postal-code"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                  {/* Security Notice */}

                  <div className="mt-6 flex gap-3 rounded-xl bg-slate-50 p-4">

                    <ShieldCheck
                      size={20}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                      <p className="text-sm font-bold text-[#0B1F3A]">
                        Your information is secure
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Your delivery details are used only to process and deliver your order.
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* ==================================
                RIGHT - ORDER SUMMARY
            ================================== */}

            <div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">

                {/* Summary Header */}

                <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Package size={19} />
                      </div>

                      <div>
                        <h2 className="font-extrabold text-[#0B1F3A]">
                          Order Summary
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {cartItems.length}{" "}
                          {cartItems.length === 1
                            ? "item"
                            : "items"}{" "}
                          in your order
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

                <div className="p-5 sm:p-6">

                  {/* Products */}

                  <div className="space-y-4">

                    {cartItems.map((item, index) => {

                      const productId =
                        item.product?._id ||
                        item.product?.id

                      return (
                        <div
                          key={`${productId}-${item.size}-${index}`}
                          className="flex gap-3"
                        >

                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-20 sm:w-20">

                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />

                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0B1F3A] px-1 text-[10px] font-bold text-white">
                              {item.quantity}
                            </span>

                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-bold text-[#0B1F3A]">
                              {item.product.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Size: {item.size}
                            </p>

                            <p className="mt-2 text-sm font-extrabold text-[#0B1F3A]">
                              ₹
                              {(
                                Number(item.product.price) *
                                Number(item.quantity)
                              ).toLocaleString("en-IN")}
                            </p>

                          </div>

                        </div>
                      )
                    })}

                  </div>

                  {/* Price Breakdown */}

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">

                    <div className="flex items-center justify-between text-sm">

                      <span className="text-slate-500">
                        Subtotal
                      </span>

                      <span className="font-semibold text-[#0B1F3A]">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>

                    </div>

                    <div className="flex items-center justify-between text-sm">

                      <span className="text-slate-500">
                        Delivery
                      </span>

                      <span className="font-semibold text-[#0B1F3A]">
                        ₹{deliveryFee.toLocaleString("en-IN")}
                      </span>

                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">

                      <span className="text-base font-extrabold text-[#0B1F3A]">
                        Total
                      </span>

                      <span className="text-2xl font-extrabold tracking-tight text-[#0B1F3A]">
                        ₹{total.toLocaleString("en-IN")}
                      </span>

                    </div>

                  </div>

                  {/* Payment Method */}

                  <div className="mt-7">

                    <div className="mb-3 flex items-center gap-2">

                      <CreditCard
                        size={17}
                        className="text-blue-600"
                      />

                      <p className="text-sm font-extrabold text-[#0B1F3A]">
                        Payment Method
                      </p>

                    </div>

                    <div className="space-y-3">

                      {/* COD */}

                      <label
                        className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-all ${
                          paymentMethod === "COD"
                            ? "border-blue-500 bg-blue-50/60 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >

                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={paymentMethod === "COD"}
                          onChange={(e) =>
                            setPaymentMethod(e.target.value)
                          }
                          className="mt-1 h-4 w-4 accent-blue-600"
                        />

                        <div className="min-w-0">

                          <div className="flex items-center gap-2">

                            <WalletCards
                              size={17}
                              className={
                                paymentMethod === "COD"
                                  ? "text-blue-600"
                                  : "text-slate-500"
                              }
                            />

                            <p className="text-sm font-bold text-[#0B1F3A]">
                              Cash on Delivery
                            </p>

                          </div>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Pay when your order arrives
                          </p>

                        </div>

                      </label>

                      {/* RAZORPAY */}

                      <label
                        className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-all ${
                          paymentMethod === "RAZORPAY"
                            ? "border-blue-500 bg-blue-50/60 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >

                        <input
                          type="radio"
                          name="paymentMethod"
                          value="RAZORPAY"
                          checked={paymentMethod === "RAZORPAY"}
                          onChange={(e) =>
                            setPaymentMethod(e.target.value)
                          }
                          className="mt-1 h-4 w-4 accent-blue-600"
                        />

                        <div className="min-w-0">

                          <div className="flex items-center gap-2">

                            <CreditCard
                              size={17}
                              className={
                                paymentMethod === "RAZORPAY"
                                  ? "text-blue-600"
                                  : "text-slate-500"
                              }
                            />

                            <p className="text-sm font-bold text-[#0B1F3A]">
                              Pay Online
                            </p>

                          </div>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Pay securely using Razorpay
                          </p>

                        </div>

                      </label>

                    </div>

                  </div>

                  {/* Place Order */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-blue-600 hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={16} />

                        {paymentMethod === "COD"
                          ? `Place Order • ₹${total.toLocaleString(
                              "en-IN"
                            )}`
                          : `Pay ₹${total.toLocaleString(
                              "en-IN"
                            )}`}
                      </>
                    )}

                  </button>

                  {/* Security */}

                  <div className="mt-4 flex items-center justify-center gap-2 text-center">

                    <Lock
                      size={13}
                      className="text-slate-400"
                    />

                    <p className="text-[11px] leading-4 text-slate-400">
                      Secure checkout • Your payment is protected
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </form>
      )}

    </main>
  )
}

export default Checkout