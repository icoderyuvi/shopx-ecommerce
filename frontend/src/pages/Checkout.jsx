import { useContext, useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL
import { useNavigate } from "react-router-dom"
import { ShopContext } from "../context/ShopContext"

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
        color: "#000000"
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
            `Product ID missing for ${item.product?.name || "product"}`
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
    <div className="min-h-screen bg-gray-50 px-4 py-10">

      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="mb-3 text-sm text-gray-500 transition hover:text-black"
          >
            ← Back to Cart
          </button>

          <h1 className="text-3xl font-semibold text-gray-900">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Complete your order details below
          </p>

        </div>

        {/* Empty Cart */}

        {!cartItems || cartItems.length === 0 ? (

          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">

            <div className="mb-4 text-5xl">
              🛒
            </div>

            <h2 className="text-xl font-semibold">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Add some products before proceeding to checkout.
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-6 rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800"
            >
              Continue Shopping
            </button>

          </div>

        ) : (

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10"
          >

            {/* DELIVERY INFORMATION */}

            <div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">

                <h2 className="mb-6 text-xl font-semibold">
                  Delivery Information
                </h2>

                {error && (
                  <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Names */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      First Name
                    </label>

                    <input
                      name="firstName"
                      placeholder="Enter first name"
                      value={address.firstName}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Last Name
                    </label>

                    <input
                      name="lastName"
                      placeholder="Enter last name"
                      value={address.lastName}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                    />
                  </div>

                </div>

                {/* Email */}

                <div className="mt-4">

                  <label className="mb-2 block text-sm font-medium">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={address.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                  />

                </div>

                {/* Phone */}

                <div className="mt-4">

                  <label className="mb-2 block text-sm font-medium">
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                  />

                </div>

                {/* Street */}

                <div className="mt-4">

                  <label className="mb-2 block text-sm font-medium">
                    Street Address
                  </label>

                  <input
                    name="street"
                    placeholder="House number, street, area"
                    value={address.street}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                  />

                </div>

                {/* City / State */}

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      City
                    </label>

                    <input
                      name="city"
                      placeholder="City"
                      value={address.city}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      State
                    </label>

                    <input
                      name="state"
                      placeholder="State"
                      value={address.state}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                    />

                  </div>

                </div>

                {/* Pincode */}

                <div className="mt-4">

                  <label className="mb-2 block text-sm font-medium">
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                  />

                </div>

              </div>

            </div>

            {/* ORDER SUMMARY */}

            <div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 lg:sticky lg:top-6 sm:p-6">

                <h2 className="mb-6 text-xl font-semibold">
                  Order Summary
                </h2>

                <div className="mb-6 space-y-4">

                  {cartItems.map((item, index) => {

                    const productId =
                      item.product?._id ||
                      item.product?.id

                    return (
                      <div
                        key={`${productId}-${item.size}-${index}`}
                        className="flex items-center gap-4"
                      >

                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                        />

                        <div className="min-w-0 flex-1">

                          <p className="truncate font-medium">
                            {item.product.name}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Size: {item.size} × {item.quantity}
                          </p>

                        </div>

                        <p className="whitespace-nowrap font-medium">
                          ₹
                          {(
                            Number(item.product.price) *
                            Number(item.quantity)
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>
                    )
                  })}

                </div>

                {/* Price */}

                <div className="space-y-3 border-t border-gray-200 pt-5">

                  <div className="flex justify-between text-gray-600">

                    <span>
                      Subtotal
                    </span>

                    <span>
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>

                  </div>

                  <div className="flex justify-between text-gray-600">

                    <span>
                      Delivery
                    </span>

                    <span>
                      ₹{deliveryFee.toLocaleString("en-IN")}
                    </span>

                  </div>

                  <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold">

                    <span>
                      Total
                    </span>

                    <span>
                      ₹{total.toLocaleString("en-IN")}
                    </span>

                  </div>

                </div>

                {/* PAYMENT METHOD */}

                <div className="mt-7">

                  <p className="mb-3 font-medium">
                    Payment Method
                  </p>

                  <div className="space-y-3">

                    {/* COD */}

                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                        paymentMethod === "COD"
                          ? "border-black bg-gray-50"
                          : "border-gray-300"
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
                      />

                      <div>

                        <p className="font-medium">
                          Cash on Delivery
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Pay when your order arrives
                        </p>

                      </div>

                    </label>

                    {/* RAZORPAY */}

                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                        paymentMethod === "RAZORPAY"
                          ? "border-black bg-gray-50"
                          : "border-gray-300"
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
                      />

                      <div>

                        <p className="font-medium">
                          Pay Online
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Pay securely using Razorpay
                        </p>

                      </div>

                    </label>

                  </div>

                </div>

                {/* PLACE ORDER */}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-7 w-full rounded-lg bg-black py-3.5 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : paymentMethod === "COD"
                      ? `Place Order • ₹${total.toLocaleString("en-IN")}`
                      : `Pay ₹${total.toLocaleString("en-IN")}`}
                </button>

                <p className="mt-4 text-center text-xs text-gray-400">
                  Your payment is securely processed by Razorpay.
                </p>

              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  )
}

export default Checkout