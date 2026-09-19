import { Link } from "react-router-dom"
import { ArrowRight, Star } from "lucide-react"

function ProductCard({ product }) {
  const productId = product?._id || product?.id

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">

      {/* =========================
          PRODUCT IMAGE
      ========================== */}

      <Link
        to={`/products/${productId}`}
        className="block"
      >

        <div className="relative h-64 overflow-hidden bg-slate-100 sm:h-72">

          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
          />


          {/* Image Overlay */}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />


          {/* Category */}

          <span className="absolute left-3 top-3 rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-xs font-bold text-[#0B1F3A] shadow-sm backdrop-blur-sm">
            {product.category}
          </span>


          {/* Bestseller */}

          {product.bestseller && (
            <span className="absolute right-3 top-3 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-blue-600/20">
              Bestseller
            </span>
          )}


          {/* View Product Hover */}

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-3 items-center gap-2 rounded-xl bg-[#0B1F3A]/95 px-4 py-2.5 text-xs font-bold text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">

            View Product

            <ArrowRight size={14} />

          </div>

        </div>

      </Link>


      {/* =========================
          PRODUCT INFORMATION
      ========================== */}

      <div className="p-4 sm:p-5">

        {/* Product Name */}

        <Link to={`/products/${productId}`}>

          <h2 className="line-clamp-1 text-base font-bold text-[#0B1F3A] transition-colors duration-200 group-hover:text-blue-600 sm:text-lg">
            {product.name}
          </h2>

        </Link>


        {/* Rating */}

        <div className="mt-2 flex items-center gap-1.5">

          <div className="flex items-center gap-0.5 text-blue-500">

            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={13}
                fill="currentColor"
                strokeWidth={0}
              />
            ))}

          </div>

          <span className="text-xs font-medium text-slate-500">
            4.8
          </span>

        </div>


        {/* Price + Button */}

        <div className="mt-4 flex items-center justify-between gap-3">

          <div>

            <p className="text-lg font-extrabold tracking-tight text-[#0B1F3A] sm:text-xl">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

          </div>


          <Link
            to={`/products/${productId}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#0B1F3A] px-3.5 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20 sm:px-4 sm:text-sm"
          >
            View
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>

        </div>

      </div>

    </div>
  )
}

export default ProductCard