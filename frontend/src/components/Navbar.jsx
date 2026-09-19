
import { Link, useNavigate } from "react-router-dom"
import { useState, useContext } from "react"

import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
} from "lucide-react"

import { ShopContext } from "../context/ShopContext"

function Navbar() {
  const { getCartCount } = useContext(ShopContext)

  const navigate = useNavigate()

  const [searchText, setSearchText] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()

    const search = searchText.trim()

    if (search === "") {
      navigate("/products")
    } else {
      navigate(`/products?search=${encodeURIComponent(search)}`)
    }

    setMobileMenuOpen(false)
  }

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">

      {/* =========================
          MAIN NAVBAR
      ========================== */}

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex h-18 items-center justify-between gap-4">

          {/* =========================
              LOGO
          ========================== */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="shrink-0 text-2xl font-extrabold tracking-tight text-[#0B1F3A] transition-colors duration-200 hover:text-[#2563EB] sm:text-3xl"
          >
            Shop<span className="text-[#2563EB]">X</span>
          </Link>


          {/* =========================
              DESKTOP SEARCH
          ========================== */}

          <form
            onSubmit={handleSearch}
            className="hidden min-w-0 flex-1 md:flex md:max-w-xl lg:max-w-2xl"
          >

            <div className="flex w-full items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200 focus-within:border-[#2563EB] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10">

              <Search
                size={20}
                strokeWidth={2}
                className="ml-4 shrink-0 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search products..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                className="mr-1.5 rounded-lg bg-[#0B1F3A] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#2563EB] active:scale-95"
              >
                Search
              </button>

            </div>

          </form>


          {/* =========================
              DESKTOP NAVIGATION
          ========================== */}

          <div className="hidden items-center gap-2 md:flex">

            {/* Products */}

            <Link
              to="/products"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-blue-50 hover:text-[#2563EB]"
            >
              Products
            </Link>


            {/* Cart */}

            <Link
              to="/cart"
              className="group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-blue-50 hover:text-[#2563EB]"
            >

              <ShoppingCart
                size={20}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:-translate-y-0.5"
              />

              <span>Cart</span>

              {getCartCount() > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#2563EB] px-1 text-[10px] font-bold text-white shadow-sm">
                  {getCartCount()}
                </span>
              )}

            </Link>


            {/* Profile */}

            <Link
              to="/profile"
              aria-label="Profile"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
            >
              <User size={20} strokeWidth={2} />
            </Link>

          </div>


          {/* =========================
              MOBILE ACTIONS
          ========================== */}

          <div className="flex items-center gap-1 md:hidden">

            {/* Mobile Cart */}

            <Link
              to="/cart"
              onClick={closeMobileMenu}
              aria-label="Cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#0B1F3A] transition-colors duration-200 hover:bg-blue-50"
            >

              <ShoppingCart size={21} strokeWidth={2} />

              {getCartCount() > 0 && (
                <span className="absolute right-0.5 top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#2563EB] px-1 text-[9px] font-bold text-white">
                  {getCartCount()}
                </span>
              )}

            </Link>


            {/* Hamburger */}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#0B1F3A] transition-colors duration-200 hover:bg-blue-50 hover:text-[#2563EB]"
            >
              {mobileMenuOpen ? (
                <X size={23} strokeWidth={2} />
              ) : (
                <Menu size={23} strokeWidth={2} />
              )}
            </button>

          </div>

        </div>


        {/* =========================
            MOBILE SEARCH
        ========================== */}

        <form
          onSubmit={handleSearch}
          className="pb-4 md:hidden"
        >

          <div className="flex w-full items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200 focus-within:border-[#2563EB] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10">

            <Search
              size={19}
              className="ml-3 shrink-0 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="mr-1 rounded-lg bg-[#0B1F3A] px-3 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#2563EB]"
            >
              Search
            </button>

          </div>

        </form>


        {/* =========================
            MOBILE MENU
        ========================== */}

        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            mobileMenuOpen
              ? "max-h-80 pb-4 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >

          <div className="border-t border-slate-100 pt-3">

            {/* Products */}

            <Link
              to="/products"
              onClick={closeMobileMenu}
              className="flex items-center rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-blue-50 hover:text-[#2563EB]"
            >
              Products
            </Link>


            {/* Cart */}

            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-blue-50 hover:text-[#2563EB]"
            >

              <span className="flex items-center gap-3">
                <ShoppingCart size={19} />
                Cart
              </span>

              {getCartCount() > 0 && (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#2563EB]">
                  {getCartCount()}
                </span>
              )}

            </Link>


            {/* Profile */}

            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-blue-50 hover:text-[#2563EB]"
            >
              <User size={19} />
              Profile
            </Link>

          </div>

        </div>

      </nav>

    </header>
  )
}

export default Navbar

