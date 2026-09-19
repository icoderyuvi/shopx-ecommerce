import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  ShoppingCart
} from "lucide-react"

import { ShopContext } from "../context/ShopContext"

const API_URL = import.meta.env.VITE_API_URL

function ProductDetails() {
  const { id } = useParams()

  const { addToCart } = useContext(ShopContext)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState("")
  const [added, setAdded] = useState(false)

  // =========================
  // FETCH PRODUCT
  // =========================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)

        const response = await fetch(
          `${API_URL}/api/product/${id}`
        )

        const data = await response.json()

        if (data.success) {
          setProduct(data.product)

          if (data.product?.sizes?.length > 0) {
            setSize(data.product.sizes[0])
          }
        } else {
          setProduct(null)
        }
      } catch (error) {
        console.error("Failed to load product:", error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">

        <section className="flex min-h-[70vh] items-center justify-center px-5">

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">

              <div className="h-7 w-7 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            </div>

            <h2 className="mt-5 text-lg font-bold text-[#0B1F3A]">
              Loading product
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we load the product details.
            </p>

          </div>

        </section>

      </main>
    )
  }

  // =========================
  // PRODUCT NOT FOUND
  // =========================

  if (!product) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-5">

        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <ShoppingCart size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-[#0B1F3A] sm:text-3xl">
            Product Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            The product you are looking for doesn't exist
            or may have been removed.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>

        </div>

      </main>
    )
  }

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = () => {
    if (!size) {
      alert("Please select a size")
      return
    }

    addToCart(product, size)

    setAdded(true)

    setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          BREADCRUMB
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-6 lg:px-8">

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

      </div>


      {/* =====================================================
          PRODUCT SECTION
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">


          {/* =================================================
              PRODUCT IMAGE
          ================================================== */}

          <div className="lg:sticky lg:top-24 lg:self-start">

            <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="relative aspect-square overflow-hidden bg-slate-100 sm:aspect-[4/5]">

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Image gradient */}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/20 via-transparent to-transparent" />


                {/* Category */}

                <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/95 px-4 py-2 text-xs font-bold text-[#0B1F3A] shadow-sm backdrop-blur-sm">
                  {product.category}
                </span>


                {/* Bestseller */}

                {product.bestseller && (
                  <span className="absolute right-4 top-4 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/20">
                    Bestseller
                  </span>
                )}

              </div>

            </div>


            {/* Mobile image information */}

            <div className="mt-4 grid grid-cols-3 gap-3 lg:hidden">

              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">

                <Truck
                  size={19}
                  className="mx-auto text-blue-600"
                />

                <p className="mt-2 text-[11px] font-semibold text-slate-600">
                  Fast Delivery
                </p>

              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">

                <ShieldCheck
                  size={19}
                  className="mx-auto text-blue-600"
                />

                <p className="mt-2 text-[11px] font-semibold text-slate-600">
                  Secure
                </p>

              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">

                <RotateCcw
                  size={19}
                  className="mx-auto text-blue-600"
                />

                <p className="mt-2 text-[11px] font-semibold text-slate-600">
                  Easy Returns
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              PRODUCT INFORMATION
          ================================================== */}

          <div className="flex flex-col justify-center">


            {/* Category */}

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 sm:text-sm">
              {product.category}

              {product.subCategory && (
                <>
                  <span className="mx-2 text-slate-300">
                    /
                  </span>

                  <span className="text-slate-500">
                    {product.subCategory}
                  </span>
                </>
              )}
            </p>


            {/* Product Name */}

            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#0B1F3A] sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>


            {/* Rating */}

            <div className="mt-5 flex flex-wrap items-center gap-3">

              <div className="flex items-center gap-0.5 text-blue-500">

                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={17}
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ))}

              </div>

              <span className="text-sm font-semibold text-slate-600">
                4.8
              </span>

              <span className="text-sm text-slate-400">
                •
              </span>

              <span className="text-sm text-slate-500">
                Customer Rating
              </span>

            </div>


            {/* Price */}

            <div className="mt-6">

              <p className="text-3xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-4xl">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>

            </div>


            {/* Description */}

            <p className="mt-6 text-sm leading-7 text-slate-600 sm:text-base">
              {product.description}
            </p>


            <div className="my-7 border-t border-slate-200" />


            {/* =================================================
                SIZE
            ================================================== */}

            {product.sizes?.length > 0 && (
              <div>

                <div className="mb-3 flex items-center justify-between">

                  <h2 className="text-sm font-bold text-[#0B1F3A]">
                    Select Size
                  </h2>

                  <span className="text-xs text-slate-400">
                    Required
                  </span>

                </div>


                <div className="flex flex-wrap gap-2.5">

                  {product.sizes.map((item) => (

                    <button
                      key={item}
                      onClick={() => setSize(item)}
                      className={`
                        min-w-[64px] rounded-xl border px-4 py-3 text-sm font-bold transition-all
                        ${
                          size === item
                            ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600"
                        }
                      `}
                    >
                      {item}
                    </button>

                  ))}

                </div>

              </div>
            )}


            {/* =================================================
                ADD TO CART
            ================================================== */}

            <button
              onClick={handleAddToCart}
              className={`
                mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-bold text-white shadow-lg transition-all duration-200
                ${
                  added
                    ? "bg-emerald-600 shadow-emerald-600/20"
                    : "bg-[#0B1F3A] shadow-[#0B1F3A]/20 hover:bg-blue-600 hover:shadow-blue-600/20"
                }
              `}
            >

              {added ? (
                <>
                  <Check size={19} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={19} />
                  Add to Cart
                </>
              )}

            </button>


            {/* View Cart */}

            {added && (
              <Link
                to="/cart"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-6 py-4 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
              >
                View Cart
                <ArrowRight size={17} />
              </Link>
            )}


            {/* =================================================
                DESKTOP BENEFITS
            ================================================== */}

            <div className="mt-8 hidden border-t border-slate-200 pt-8 sm:grid sm:grid-cols-3 sm:gap-4">

              <div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Truck size={19} />
                </div>

                <p className="mt-3 text-sm font-bold text-[#0B1F3A]">
                  Free Delivery
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  On eligible orders
                </p>

              </div>


              <div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheck size={19} />
                </div>

                <p className="mt-3 text-sm font-bold text-[#0B1F3A]">
                  Secure Payment
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Safe and secure checkout
                </p>

              </div>


              <div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <RotateCcw size={19} />
                </div>

                <p className="mt-3 text-sm font-bold text-[#0B1F3A]">
                  Easy Returns
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Simple return process
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          BOTTOM PRODUCT CTA
      ====================================================== */}

      <section className="border-t border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 sm:flex-row sm:px-6 lg:px-8">

          <div>

            <p className="text-sm font-bold text-[#0B1F3A]">
              Looking for something else?
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Explore more products from the ShopX collection.
            </p>

          </div>

          <Link
            to="/products"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-[#0B1F3A] transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 sm:w-auto"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>

        </div>

      </section>

    </main>
  )
}

export default ProductDetails