import { useMemo, useState, useContext, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { ShopContext } from "../context/ShopContext"
import ProductCard from "../components/ProductCard"

function Products() {
  const { products, loadingProducts } = useContext(ShopContext)

  const [searchParams, setSearchParams] = useSearchParams()

  const initialSearch = searchParams.get("search") || ""

  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState("All")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sort, setSort] = useState("default")
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Shoes",
    "Accessories",
  ]

  // Keep search box synced with URL
  useEffect(() => {
    setSearch(searchParams.get("search") || "")
  }, [searchParams])

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts = useMemo(() => {
    let result = Array.isArray(products)
      ? [...products]
      : []

    // Search
    if (search.trim() !== "") {
      result = result.filter((product) =>
        product.name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )
    }

    // Category
    if (category !== "All") {
      result = result.filter(
        (product) => product.category === category
      )
    }

    // Minimum price
    if (minPrice !== "") {
      result = result.filter(
        (product) => product.price >= Number(minPrice)
      )
    }

    // Maximum price
    if (maxPrice !== "") {
      result = result.filter(
        (product) => product.price <= Number(maxPrice)
      )
    }

    // Sorting
    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price)
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price)
    }

    if (sort === "name-az") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    }

    if (sort === "name-za") {
      result.sort((a, b) =>
        b.name.localeCompare(a.name)
      )
    }

    return result
  }, [
    products,
    search,
    category,
    minPrice,
    maxPrice,
    sort,
  ])

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (value) => {
    setSearch(value)

    if (value.trim() === "") {
      setSearchParams({})
    } else {
      setSearchParams({
        search: value,
      })
    }
  }

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setSearch("")
    setCategory("All")
    setMinPrice("")
    setMaxPrice("")
    setSort("default")
    setSearchParams({})
  }

  // =========================
  // LOADING
  // =========================

  if (loadingProducts) {
    return (
      <main className="min-h-screen bg-white">
        <section className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="mt-4 text-gray-500">
              Loading products...
            </p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <section className="border-b bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

          <p className="text-sm font-medium text-gray-500">
            Shop
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            All Products
          </h1>

          <p className="mt-3 max-w-xl text-gray-500">
            Discover our collection of quality products
            designed for everyday life.
          </p>

        </div>
      </section>

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* Search */}

        <div className="mb-8">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              handleSearch(e.target.value)
            }
            className="w-full rounded-xl border px-4 py-3.5 outline-none transition focus:border-black"
          />

        </div>

        {/* Mobile Filter Button */}

        <div className="mb-6 flex items-center justify-between lg:hidden">

          <button
            onClick={() =>
              setShowFilters(!showFilters)
            }
            className="rounded-lg border px-5 py-2.5 text-sm font-semibold"
          >
            {showFilters
              ? "Hide Filters"
              : "Show Filters"}
          </button>

          <p className="text-sm text-gray-500">
            {filteredProducts.length} products
          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">

          {/* =========================
              FILTER SIDEBAR
          ========================== */}

          <aside
            className={`
              ${showFilters ? "block" : "hidden"}
              rounded-xl border bg-gray-50 p-5
              lg:block
            `}
          >

            <div className="flex items-center justify-between">

              <h2 className="text-lg font-bold">
                Filters
              </h2>

              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 underline"
              >
                Clear
              </button>

            </div>

            {/* Category */}

            <div className="mt-7">

              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide">
                Category
              </h3>

              <div className="space-y-3">

                {categories.map((item) => (

                  <button
                    key={item}
                    onClick={() =>
                      setCategory(item)
                    }
                    className={`
                      block w-full rounded-lg px-3 py-2 text-left text-sm transition
                      ${
                        category === item
                          ? "bg-black font-semibold text-white"
                          : "text-gray-600 hover:bg-white hover:text-black"
                      }
                    `}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

            {/* Price */}

            <div className="mt-8">

              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide">
                Price Range
              </h3>

              <div className="space-y-3">

                <input
                  type="number"
                  min="0"
                  placeholder="Minimum ₹"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(e.target.value)
                  }
                  className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
                />

                <input
                  type="number"
                  min="0"
                  placeholder="Maximum ₹"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(e.target.value)
                  }
                  className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
                />

              </div>

            </div>

            {/* Clear Filters */}

            <button
              onClick={clearFilters}
              className="mt-8 w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Clear All Filters
            </button>

          </aside>

          {/* =========================
              PRODUCTS AREA
          ========================== */}

          <div>

            {/* Top bar */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-black">
                    {filteredProducts.length}
                  </span>{" "}
                  products
                </p>

              </div>

              {/* Sort */}

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
                className="rounded-lg border bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
              >

                <option value="default">
                  Sort: Default
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="name-az">
                  Name: A → Z
                </option>

                <option value="name-za">
                  Name: Z → A
                </option>

              </select>

            </div>

            {/* Product Grid */}

            {filteredProducts.length > 0 ? (

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

                {filteredProducts.map((product) => (

                  <ProductCard
                    key={product._id}
                    product={product}
                  />

                ))}

              </div>

            ) : (

              <div className="rounded-xl border py-20 text-center">

                <h2 className="text-2xl font-bold">
                  No Products Found
                </h2>

                <p className="mt-2 text-gray-500">
                  Try changing your search or filters.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-5 rounded-lg bg-black px-6 py-3 text-white"
                >
                  Clear Filters
                </button>

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  )
}

export default Products