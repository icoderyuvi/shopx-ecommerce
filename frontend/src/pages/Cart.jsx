import { useContext } from "react"
import { Link } from "react-router-dom"
import { ShopContext } from "../context/ShopContext"

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartAmount,
    delivery_fee,
    loadingCart
  } = useContext(ShopContext)

  if (loadingCart) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-20 text-center">
        <p className="text-gray-500">
          Loading cart...
        </p>
      </main>
    )
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <main className="px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">
          Your Cart is Empty
        </h1>

        <p className="mt-3 text-gray-500">
          Add some products to your cart.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
        >
          Continue Shopping
        </Link>
      </main>
    )
  }

  const subtotal = getCartAmount()
  const delivery = delivery_fee
  const total = subtotal + delivery

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">

      <h1 className="mb-8 text-3xl font-bold">
        Shopping Cart
      </h1>

      {/* Cart Items */}

      <div className="space-y-5">

        {cartItems.map((item) => {
          const productId = item.product?._id || item.product?.id

          return (
            <div
              key={`${productId}-${item.size}`}
              className="flex flex-col gap-5 rounded-xl border p-5 sm:flex-row sm:items-center"
            >

              {/* Product Image */}

              <Link to={`/products/${productId}`}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-24 w-24 rounded-lg object-cover"
                />
              </Link>

              {/* Product Info */}

              <div className="flex-1">

                <Link to={`/products/${productId}`}>
                  <h2 className="font-semibold hover:underline">
                    {item.product.name}
                  </h2>
                </Link>

                <p className="text-gray-500">
                  Size: {item.size}
                </p>

                <p className="mt-2 font-semibold">
                  ₹{Number(item.product.price).toLocaleString("en-IN")}
                </p>

              </div>

              {/* Quantity */}

              <div className="flex items-center gap-3">

                <button
                  onClick={() =>
                    updateQuantity(
                      productId,
                      item.size,
                      Number(item.quantity) - 1
                    )
                  }
                  className="h-9 w-9 rounded border transition hover:bg-gray-100"
                >
                  -
                </button>

                <span className="min-w-6 text-center font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(
                      productId,
                      item.size,
                      Number(item.quantity) + 1
                    )
                  }
                  className="h-9 w-9 rounded border transition hover:bg-gray-100"
                >
                  +
                </button>

              </div>

              {/* Remove */}

              <button
                onClick={() =>
                  removeFromCart(productId, item.size)
                }
                className="text-sm text-red-500 transition hover:text-red-700"
              >
                Remove
              </button>

            </div>
          )
        })}

      </div>

      {/* Order Summary */}

      <div className="mt-10 ml-auto max-w-md rounded-xl border p-6">

        <h2 className="mb-5 text-xl font-bold">
          Order Summary
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between">
            <span className="text-gray-500">
              Subtotal
            </span>

            <span className="font-semibold">
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Delivery Fee
            </span>

            <span className="font-semibold">
              ₹{delivery.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="border-t pt-3">

            <div className="flex justify-between">

              <span className="text-lg font-semibold">
                Total
              </span>

              <span className="text-2xl font-bold">
                ₹{total.toLocaleString("en-IN")}
              </span>

            </div>

          </div>

        </div>

        <Link
          to="/checkout"
          className="mt-6 block w-full rounded-lg bg-black px-8 py-3 text-center font-semibold text-white transition hover:bg-gray-800"
        >
          Proceed to Checkout
        </Link>

      </div>

    </main>
  )
}

export default Cart