import { useContext } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  ShieldCheck
} from "lucide-react"

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

  // =========================
  // LOADING
  // =========================

  if (loadingCart) {
    return (
      <main className="min-h-screen bg-slate-50">

        <section className="flex min-h-[70vh] items-center justify-center px-5">

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">

              <div className="h-7 w-7 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            </div>

            <h2 className="mt-5 text-lg font-bold text-[#0B1F3A]">
              Loading your cart
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please wait a moment...
            </p>

          </div>

        </section>

      </main>
    )
  }

  // =========================
  // EMPTY CART
  // =========================

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-5">

        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">

            <ShoppingBag size={36} />

          </div>

          <h1 className="mt-7 text-3xl font-extrabold tracking-tight text-[#0B1F3A]">
            Your Cart is Empty
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
            Looks like you haven't added anything to your
            cart yet. Explore our products and find something
            you'll love.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-600 hover:shadow-blue-600/20"
          >
            Continue Shopping
            <ArrowRight size={17} />
          </Link>

        </div>

      </main>
    )
  }

  // =========================
  // TOTALS
  // =========================

  const subtotal = getCartAmount()
  const delivery = delivery_fee
  const total = subtotal + delivery

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>

          <div className="mt-5 flex items-end justify-between gap-4">

            <div>

              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Your Cart
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-4xl">
                Shopping Cart
              </h1>

            </div>

            <div className="hidden rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 sm:block">
              {cartItems.length}{" "}
              {cartItems.length === 1
                ? "item"
                : "items"}
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">


          {/* =================================================
              CART ITEMS
          ================================================== */}

          <div>

            <div className="mb-4 flex items-center justify-between">

              <h2 className="text-lg font-bold text-[#0B1F3A]">
                Cart Items
              </h2>

              <span className="text-sm text-slate-500">
                {cartItems.length}{" "}
                {cartItems.length === 1
                  ? "item"
                  : "items"}
              </span>

            </div>


            <div className="space-y-4">

              {cartItems.map((item) => {

                const productId =
                  item.product?._id ||
                  item.product?.id

                return (
                  <div
                    key={`${productId}-${item.size}`}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-100 hover:shadow-md sm:p-5"
                  >

                    <div className="flex gap-4">


                      {/* Product Image */}

                      <Link
                        to={`/products/${productId}`}
                        className="shrink-0"
                      >

                        <div className="h-24 w-24 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28">

                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                          />

                        </div>

                      </Link>


                      {/* Product Information */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <Link
                              to={`/products/${productId}`}
                            >

                              <h3 className="line-clamp-2 text-sm font-bold text-[#0B1F3A] transition hover:text-blue-600 sm:text-base">
                                {item.product.name}
                              </h3>

                            </Link>

                            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                              Size:{" "}
                              <span className="font-semibold text-slate-700">
                                {item.size}
                              </span>
                            </p>

                          </div>


                          {/* Remove */}

                          <button
                            onClick={() =>
                              removeFromCart(
                                productId,
                                item.size
                              )
                            }
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>


                        {/* Price */}

                        <p className="mt-3 text-base font-extrabold text-[#0B1F3A]">
                          ₹
                          {Number(
                            item.product.price
                          ).toLocaleString("en-IN")}
                        </p>


                        {/* Quantity */}

                        <div className="mt-3 flex items-center justify-between gap-3">

                          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">

                            <button
                              onClick={() =>
                                updateQuantity(
                                  productId,
                                  item.size,
                                  Number(item.quantity) - 1
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-slate-600 transition hover:bg-white hover:text-blue-600"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="flex h-9 min-w-9 items-center justify-center border-x border-slate-200 bg-white px-2 text-sm font-bold text-[#0B1F3A]">
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
                              className="flex h-9 w-9 items-center justify-center text-slate-600 transition hover:bg-white hover:text-blue-600"
                              aria-label="Increase quantity"
                            >
                              <Plus size={15} />
                            </button>

                          </div>


                          {/* Item total */}

                          <p className="text-sm font-bold text-[#0B1F3A] sm:text-base">

                            ₹
                            {(
                              Number(
                                item.product.price
                              ) *
                              Number(item.quantity)
                            ).toLocaleString("en-IN")}

                          </p>

                        </div>

                      </div>

                    </div>

                  </div>
                )
              })}

            </div>


            {/* Shopping benefits */}

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">

              <div className="rounded-xl border border-slate-200 bg-white p-4">

                <Truck
                  size={20}
                  className="text-blue-600"
                />

                <p className="mt-2 text-xs font-bold text-[#0B1F3A]">
                  Fast Delivery
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Quick doorstep delivery
                </p>

              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-4">

                <ShieldCheck
                  size={20}
                  className="text-blue-600"
                />

                <p className="mt-2 text-xs font-bold text-[#0B1F3A]">
                  Secure Payment
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Safe checkout experience
                </p>

              </div>


              <div className="hidden rounded-xl border border-slate-200 bg-white p-4 sm:block">

                <ShoppingBag
                  size={20}
                  className="text-blue-600"
                />

                <p className="mt-2 text-xs font-bold text-[#0B1F3A]">
                  Easy Shopping
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Simple and convenient
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              ORDER SUMMARY
          ================================================== */}

          <aside className="lg:sticky lg:top-24 lg:self-start">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <h2 className="text-xl font-extrabold text-[#0B1F3A]">
                Order Summary
              </h2>

              <div className="my-5 border-t border-slate-200" />


              {/* Subtotal */}

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  Subtotal
                </span>

                <span className="text-sm font-bold text-[#0B1F3A]">
                  ₹
                  {subtotal.toLocaleString("en-IN")}
                </span>

              </div>


              {/* Delivery */}

              <div className="mt-4 flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  Delivery Fee
                </span>

                <span className="text-sm font-bold text-[#0B1F3A]">
                  ₹
                  {delivery.toLocaleString("en-IN")}
                </span>

              </div>


              {/* Total */}

              <div className="mt-5 border-t border-slate-200 pt-5">

                <div className="flex items-end justify-between gap-4">

                  <div>

                    <p className="text-sm font-semibold text-slate-500">
                      Total
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Including delivery
                    </p>

                  </div>

                  <span className="text-2xl font-extrabold text-[#0B1F3A]">
                    ₹{total.toLocaleString("en-IN")}
                  </span>

                </div>

              </div>


              {/* Checkout */}

              <Link
                to="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#0B1F3A]/15 transition hover:bg-blue-600 hover:shadow-blue-600/20"
              >
                Proceed to Checkout
                <ArrowRight size={17} />
              </Link>


              {/* Secure checkout */}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">

                <ShieldCheck size={15} />

                Secure checkout

              </div>

            </div>

          </aside>

        </div>

      </section>

    </main>
  )
}

export default Cart