
import { Link, useNavigate } from "react-router-dom"
import { useState, useContext } from "react"

import {
  ShoppingCart,
  User,
  Search
} from "lucide-react"

import { ShopContext } from "../context/ShopContext"

function Navbar() {

  // Get cart count from ShopContext
  const { getCartCount } = useContext(ShopContext)

  // Used to navigate to different pages
  const navigate = useNavigate()

  // Store search input
  const [searchText, setSearchText] = useState("")


  // Handle search form
  const handleSearch = (e) => {

    // Prevent page refresh
    e.preventDefault()

    // If search box is empty
    if (searchText.trim() === "") {
      navigate("/products")
      return
    }

    // Send search text to Products page through URL
    navigate(
      `/products?search=${encodeURIComponent(searchText.trim())}`
    )
  }


  return (
    <nav className="border-b bg-white">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">


        {/* =========================
            LOGO
        ========================== */}

        <Link
          to="/"
          className="text-2xl font-bold"
        >
          ShopX
        </Link>


        {/* =========================
            SEARCH
        ========================== */}

        <form
          onSubmit={handleSearch}
          className="flex w-1/3 items-center rounded-lg border px-3"
        >

          {/* Search Icon */}

          <Search size={20} />


          {/* Search Input */}

          <input
            type="text"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-3 py-2 outline-none"
          />


          {/* Search Button */}

          <button
            type="submit"
            className="rounded-md bg-black px-3 py-2 text-sm text-white"
          >
            Search
          </button>

        </form>


        {/* =========================
            NAVIGATION
        ========================== */}

        <div className="flex items-center gap-5">


          {/* Products */}

          <Link to="/products">
            Products
          </Link>


          {/* Cart */}

          <Link
            to="/cart"
            className="relative flex items-center gap-1"
          >

            <ShoppingCart size={20} />

            Cart

            {getCartCount() > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                {getCartCount()}
              </span>
            )}

          </Link>


          {/* Profile */}

          <Link to="/profile">
            <User size={20} />
          </Link>

        </div>

      </div>

    </nav>
  )
}

export default Navbar

