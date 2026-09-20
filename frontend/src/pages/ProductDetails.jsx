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
  ShoppingCart,
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

  // --------------------------------------------------
  // Fetch Product
  // --------------------------------------------------
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

          // --------------------------------------------
          // If product has sizes, select first size
          // --------------------------------------------
          if (
            Array.isArray(data.product?.sizes) &&
            data.product.sizes.length > 0
          ) {
            setSize(data.product.sizes[0])
          } else {
            // Product has no sizes
            setSize("")
          }
        } else {
          console.error(
            data.message || "Product not found"
          )
        }
      } catch (error) {
        console.error(
          "Error fetching product:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // --------------------------------------------------
  // Add To Cart
  // --------------------------------------------------
  const handleAddToCart = () => {
    if (!product) {
      return
    }

    // Check whether this product actually has sizes
    const hasSizes =
      Array.isArray(product.sizes) &&
      product.sizes.length > 0

    // -----------------------------------------------
    // Products WITH sizes
    // -----------------------------------------------
    if (hasSizes && !size) {
      alert("Please select a size")
      return
    }

    // -----------------------------------------------
    // Products WITHOUT sizes
    // -----------------------------------------------
    const selectedSize = hasSizes
      ? size
      : "One Size"

    // Add product
    addToCart(product, selectedSize)

    // Show added message
    setAdded(true)

    setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-gray-500">
          Loading product...
        </div>
      </div>
    )
  }

  // --------------------------------------------------
  // Product Not Found
  // --------------------------------------------------
  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Product not found
        </h2>

        <Link
          to="/products"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white hover:bg-gray-800 transition"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>
      </div>
    )
  }

  const hasSizes =
    Array.isArray(product.sizes) &&
    product.sizes.length > 0

  const productImage =
    product.image ||
    product.images?.[0] ||
    "/placeholder.png"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ------------------------------------------------ */}
        {/* Breadcrumb */}
        {/* ------------------------------------------------ */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>
        </div>

        {/* ------------------------------------------------ */}
        {/* Main Product Section */}
        {/* ------------------------------------------------ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Product Image */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
            <div className="aspect-square flex items-center justify-center p-6 sm:p-10">
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col">

            {/* Category */}
            {product.category && (
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                {product.category}
              </p>
            )}

            {/* Product Name */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <span className="text-sm text-gray-500">
                4.8
              </span>
            </div>

            {/* Price */}
            <div className="mt-5">
              <span className="text-3xl font-bold text-gray-900">
                ₹{Number(product.price || 0).toLocaleString("en-IN")}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="mt-5 text-gray-600 leading-7">
                {product.description}
              </p>
            )}

            {/* ------------------------------------------------ */}
            {/* Size Selector */}
            {/* ------------------------------------------------ */}
            {hasSizes && (
              <div className="mt-7">

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-semibold text-gray-900">
                      Select Size
                    </span>

                    <span className="ml-2 text-sm text-red-500">
                      Required
                    </span>
                  </div>

                  <span className="text-sm text-gray-500">
                    {size
                      ? `Selected: ${size}`
                      : "Choose a size"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((item) => {
                    const isSelected =
                      size === item

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSize(item)}
                        className={`
                          min-w-[55px]
                          px-4
                          py-3
                          rounded-xl
                          border
                          font-medium
                          transition
                          ${
                            isSelected
                              ? "border-black bg-black text-white"
                              : "border-gray-300 bg-white text-gray-800 hover:border-black"
                          }
                        `}
                      >
                        {item}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ------------------------------------------------ */}
            {/* No Size Message */}
            {/* ------------------------------------------------ */}
            {!hasSizes && (
              <div className="mt-7">
                <div className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700">
                  <Check size={17} />
                  No size selection required
                </div>
              </div>
            )}

            {/* ------------------------------------------------ */}
            {/* Add To Cart */}
            {/* ------------------------------------------------ */}
            <div className="mt-8">

              <button
                type="button"
                onClick={handleAddToCart}
                className={`
                  w-full
                  sm:w-auto
                  min-w-[220px]
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  px-7
                  py-4
                  font-semibold
                  transition
                  ${
                    added
                      ? "bg-green-600 text-white"
                      : "bg-black text-white hover:bg-gray-800"
                  }
                `}
              >
                {added ? (
                  <>
                    <Check size={20} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add to Cart
                  </>
                )}
              </button>

            </div>

            {/* ------------------------------------------------ */}
            {/* Product Benefits */}
            {/* ------------------------------------------------ */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="rounded-xl bg-white border border-gray-200 p-4">
                <Truck
                  size={22}
                  className="text-gray-800 mb-2"
                />

                <p className="font-semibold text-sm">
                  Fast Delivery
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Quick delivery to your doorstep
                </p>
              </div>

              <div className="rounded-xl bg-white border border-gray-200 p-4">
                <ShieldCheck
                  size={22}
                  className="text-gray-800 mb-2"
                />

                <p className="font-semibold text-sm">
                  Secure Payment
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Safe and secure checkout
                </p>
              </div>

              <div className="rounded-xl bg-white border border-gray-200 p-4">
                <RotateCcw
                  size={22}
                  className="text-gray-800 mb-2"
                />

                <p className="font-semibold text-sm">
                  Easy Returns
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Simple return process
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* Product Details */}
        {/* ------------------------------------------------ */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Product Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {product.category && (
              <div>
                <p className="text-sm text-gray-500">
                  Category
                </p>

                <p className="font-medium text-gray-900 mt-1">
                  {product.category}
                </p>
              </div>
            )}

            {product.subCategory && (
              <div>
                <p className="text-sm text-gray-500">
                  Sub Category
                </p>

                <p className="font-medium text-gray-900 mt-1">
                  {product.subCategory}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">
                Availability
              </p>

              <p className="font-medium text-green-600 mt-1">
                In Stock
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Size
              </p>

              <p className="font-medium text-gray-900 mt-1">
                {hasSizes
                  ? product.sizes.join(", ")
                  : "One Size"}
              </p>
            </div>

          </div>

          {product.description && (
            <div className="mt-7 pt-6 border-t border-gray-200">
              <p className="text-gray-600 leading-7">
                {product.description}
              </p>
            </div>
          )}

        </div>

        {/* ------------------------------------------------ */}
        {/* Continue Shopping */}
        {/* ------------------------------------------------ */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-800 hover:border-black hover:text-black transition"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  )
}

export default ProductDetails