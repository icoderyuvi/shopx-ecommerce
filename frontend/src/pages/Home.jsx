import { Link } from "react-router-dom"
import {
  ArrowRight,
  Headphones,
  Watch,
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw
} from "lucide-react"

import products from "../data/products"
import ProductCard from "../components/ProductCard"

function Home() {
  const bestSellers = products.filter((product) => product.bestseller)

  const categories = [
    {
      name: "Electronics",
      description: "Smart tech for everyday life",
      icon: Headphones
    },
    {
      name: "Shoes",
      description: "Comfort meets performance",
      icon: ShoppingBag
    },
    {
      name: "Fashion",
      description: "Everyday styles you’ll love",
      icon: Sparkles
    },
    {
      name: "Accessories",
      description: "Complete your everyday look",
      icon: Watch
    }
  ]

  return (
    <main className="bg-slate-50 text-slate-900">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#0B1F3A]">

        {/* Decorative background */}
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

          {/* Hero Content */}
          <div className="max-w-2xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              <Sparkles size={16} />
              Discover something new
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover Your
              <span className="block text-blue-400">
                Next Favorite
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Shop the latest products across electronics, fashion,
              shoes and accessories — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 hover:shadow-blue-500/30"
              >
                Shop Now
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore Products
              </Link>

            </div>

            {/* Small trust points */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">

              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-blue-400" />
                Secure Shopping
              </div>

              <div className="flex items-center gap-2">
                <Truck size={17} className="text-blue-400" />
                Fast Delivery
              </div>

            </div>

          </div>


          {/* Hero Visual */}
          <div className="relative hidden lg:block">

            <div className="relative mx-auto h-[450px] max-w-[520px]">

              {/* Main card */}
              <div className="absolute right-0 top-8 h-[390px] w-[340px] overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-sm">

                <img
                  src={products[0]?.image}
                  alt={products[0]?.name || "Featured product"}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/70 to-transparent p-6 pt-20">

                  <p className="text-sm text-blue-300">
                    Featured Product
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    {products[0]?.name}
                  </h2>

                  <p className="mt-1 font-semibold text-white">
                    ₹{Number(products[0]?.price || 0).toLocaleString("en-IN")}
                  </p>

                </div>

              </div>


              {/* Floating product card */}
              <div className="absolute bottom-4 left-0 w-64 rounded-2xl border border-white/10 bg-white p-4 shadow-2xl">

                <div className="flex items-center gap-3">

                  <img
                    src={products[2]?.image}
                    alt={products[2]?.name || "Product"}
                    className="h-16 w-16 rounded-xl object-cover"
                  />

                  <div className="min-w-0">

                    <p className="text-xs font-medium text-slate-500">
                      Popular Pick
                    </p>

                    <p className="truncate text-sm font-bold text-slate-900">
                      {products[2]?.name}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-blue-600">
                      ₹{Number(products[2]?.price || 0).toLocaleString("en-IN")}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          CATEGORY SECTION
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Shop by category
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1F3A] sm:text-3xl">
              Find what you’re looking for
            </h2>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            View all
            <ArrowRight size={16} />
          </Link>

        </div>


        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          {categories.map((category) => {

            const Icon = category.icon

            return (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 text-base font-bold text-[#0B1F3A] sm:text-lg">
                  {category.name}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
                  {category.description}
                </p>

                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600">
                  Explore
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>

              </Link>
            )
          })}

        </div>

      </section>


      {/* =====================================================
          BESTSELLERS
      ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-blue-600" />

                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  Trending now
                </p>

              </div>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1F3A] sm:text-3xl">
                Bestselling Products
              </h2>

              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Explore products customers are loving right now.
              </p>

            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Shop all products
              <ArrowRight size={16} />
            </Link>

          </div>


          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id || product._id}
                product={product}
              />
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          SHOPPING BENEFITS
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">

        <div className="grid overflow-hidden rounded-3xl bg-[#0B1F3A] sm:grid-cols-3">

          <div className="border-b border-white/10 p-7 sm:border-b-0 sm:border-r">

            <Truck
              size={25}
              className="text-blue-400"
            />

            <h3 className="mt-4 font-bold text-white">
              Fast Delivery
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Get your favorite products delivered quickly and conveniently.
            </p>

          </div>


          <div className="border-b border-white/10 p-7 sm:border-b-0 sm:border-r">

            <ShieldCheck
              size={25}
              className="text-blue-400"
            />

            <h3 className="mt-4 font-bold text-white">
              Secure Shopping
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Your shopping experience is designed with security in mind.
            </p>

          </div>


          <div className="p-7">

            <RotateCcw
              size={25}
              className="text-blue-400"
            />

            <h3 className="mt-4 font-bold text-white">
              Easy Experience
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Browse, discover and shop your favorite products with ease.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="px-5 pb-14 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-600">

          <div className="relative px-6 py-12 text-center sm:px-10 sm:py-16">

            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-white/10" />

            <div className="relative">

              <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                Ready to shop?
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                Find something you’ll love.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                Explore our collection and discover your next favorite product.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#0B1F3A] shadow-lg transition hover:bg-slate-100"
              >
                Start Shopping
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}

export default Home