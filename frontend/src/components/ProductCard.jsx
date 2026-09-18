import { Link } from "react-router-dom"

function ProductCard({ product }) {
  const productId = product?._id || product?.id

  return (
    <div className="group overflow-hidden rounded-2xl border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      
      {/* Product Image */}
      <Link to={`/products/${productId}`}>
        <div className="relative h-72 overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />

          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm">
            {product.category}
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5">
        <Link to={`/products/${productId}`}>
          <h2 className="text-lg font-semibold transition group-hover:text-gray-600">
            {product.name}
          </h2>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <span className="text-sm">★★★★★</span>
          <span className="text-xs text-gray-500">(4.8)</span>
        </div>

        {/* Price + Button */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>

          <Link
            to={`/products/${productId}`}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard