import { Link } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Home,
  Search
} from "lucide-react"

function NotFound() {
  return (
    <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-slate-50 px-4 py-16 sm:px-6">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50/50 blur-3xl" />

      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl text-center">

        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0B1F3A] text-white shadow-xl shadow-blue-900/10">
          <Compass
            size={30}
            strokeWidth={1.8}
          />
        </div>

        {/* 404 */}
        <p className="mt-7 bg-gradient-to-r from-[#0B1F3A] to-blue-600 bg-clip-text text-[7rem] font-black leading-none tracking-[-0.08em] text-transparent sm:text-[9rem]">
          404
        </p>

        {/* Heading */}
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-4xl">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
          Sorry, the page you're looking for doesn't exist or may have been moved.
          Let's get you back to ShopX.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0B1F3A]/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-600/20"
          >
            <Home size={17} />
            Go Home

            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/products"
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-[#0B1F3A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <Search size={17} />
            Browse Products
          </Link>

        </div>

        {/* Back-style hint */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
          <ArrowLeft size={13} />
          <span>You can also use your browser's back button</span>
        </div>

      </div>
    </main>
  )
}

export default NotFound