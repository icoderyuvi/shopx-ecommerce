import { useContext, useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL
import { Link, useParams } from "react-router-dom"

import { ShopContext } from "../context/ShopContext"

function ProductDetails() {
  const { id } = useParams()

  const { addToCart } = useContext(ShopContext)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState("")
  const [added, setAdded] = useState(false)

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

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-gray-500">
          Loading product...
        </p>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">
          Product Not Found
        </h1>

        <p className="mt-3 text-gray-500">
          The product you are looking for does not exist.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white"
        >
          Back to Products
        </Link>
      </main>
    )
  }

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
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Product Image */}

          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-[450px] w-full object-cover transition duration-500 hover:scale-105 sm:h-[550px]"
            />
          </div>

          {/* Product Information */}

          <div className="flex flex-col justify-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              {product.category}
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}

            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm">
                ★★★★★
              </span>

              <span className="text-sm text-gray-500">
                4.8 / 5
              </span>
            </div>

            {/* Price */}

            <p className="mt-6 text-3xl font-bold">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            {/* Description */}

            <p className="mt-6 leading-7 text-gray-600">
              {product.description}
            </p>

            <div className="my-8 border-t" />

            {/* Size */}

            {product.sizes?.length > 0 && (
              <div>
                <h2 className="mb-3 font-semibold">
                  Select Size
                </h2>

                <div className="flex flex-wrap gap-3">

                  {product.sizes.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSize(item)}
                      className={`min-w-16 rounded-lg border px-5 py-3 text-sm font-semibold transition ${
                        size === item
                          ? "border-black bg-black text-white"
                          : "bg-white hover:border-black"
                      }`}
                    >
                      {item}
                    </button>
                  ))}

                </div>
              </div>
            )}

            {/* Add To Cart */}

            <button
              onClick={handleAddToCart}
              className="mt-8 w-full rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800"
            >
              {added ? "✓ Added to Cart" : "Add to Cart"}
            </button>

            {/* View Cart */}

            {added && (
              <Link
                to="/cart"
                className="mt-3 w-full rounded-xl border px-6 py-4 text-center font-semibold transition hover:bg-gray-50"
              >
                View Cart
              </Link>
            )}

            {/* Benefits */}

            <div className="mt-8 grid gap-4 border-t pt-8 sm:grid-cols-3">

              <div>
                <p className="font-semibold">
                  Free Delivery
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  On eligible orders
                </p>
              </div>

              <div>
                <p className="font-semibold">
                  Secure Payment
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  100% secure checkout
                </p>
              </div>

              <div>
                <p className="font-semibold">
                  Easy Returns
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Simple return process
                </p>
              </div>

            </div>

          </div>
        </div>

      </section>
    </main>
  )
}

export default ProductDetails