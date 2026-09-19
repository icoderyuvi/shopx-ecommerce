import { useMemo, useState, useContext, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  PackageSearch
} from "lucide-react"

import { ShopContext } from "../context/ShopContext"
import ProductCard from "../components/ProductCard"

function Products() {
  const { products, loadingProducts } = useContext(ShopContext)

  const [searchParams, setSearchParams] = useSearchParams()

  // =========================
  // URL VALUES
  // =========================

  const initialSearch = searchParams.get("search") || ""
  const initialCategory = searchParams.get("category") || "All"

  // =========================
  // STATES
  // =========================

  const [search, setSearch] = useState(initialSearch)

  const [category, setCategory] = useState(
    initialCategory
  )

  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const [sort, setSort] = useState("default")

  const [showFilters, setShowFilters] = useState(false)

  // =========================
  // CATEGORIES
  // =========================

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Shoes",
    "Accessories"
  ]

  // =========================
  // SYNC SEARCH + CATEGORY
  // WITH URL
  // =========================

  useEffect(() => {
    setSearch(searchParams.get("search") || "")

    const urlCategory =
      searchParams.get("category") || "All"

    setCategory(
      categories.includes(urlCategory)
        ? urlCategory
        : "All"
    )
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
        (product) =>
          product.category === category
      )
    }

    // Minimum price
    if (minPrice !== "") {
      result = result.filter(
        (product) =>
          Number(product.price) >=
          Number(minPrice)
      )
    }

    // Maximum price
    if (maxPrice !== "") {
      result = result.filter(
        (product) =>
          Number(product.price) <=
          Number(maxPrice)
      )
    }

    // Sorting
    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      )
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      )
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
    sort
  ])

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (value) => {
    setSearch(value)

    const params = new URLSearchParams(
      searchParams
    )

    if (value.trim() === "") {
      params.delete("search")
    } else {
      params.set("search", value)
    }

    setSearchParams(params)
  }

  // =========================
  // CATEGORY
  // =========================

  const handleCategory = (value) => {
    setCategory(value)

    const params = new URLSearchParams(
      searchParams
    )

    if (value === "All") {
      params.delete("category")
    } else {
      params.set("category", value)
    }

    setSearchParams(params)
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
  // ACTIVE FILTER COUNT
  // =========================

  const activeFilterCount = [
    category !== "All",
    minPrice !== "",
    maxPrice !== "",
    sort !== "default"
  ].filter(Boolean).length

  // =========================
  // LOADING
  // =========================

  if (loadingProducts) {
    return (
      <main className="min-h-screen bg-slate-50">

        <section className="flex min-h-[70vh] items-center justify-center px-5">

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">

              <div className="h-7 w-7 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            </div>

            <h2 className="mt-5 text-lg font-bold text-[#0B1F3A]">
              Loading products
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we fetch the latest products.
            </p>

          </div>

        </section>

      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <section className="bg-[#0B1F3A]">

        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            ShopX Store
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Explore Our Products
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Discover quality products across electronics,
            fashion, shoes and accessories.
          </p>

        </div>

      </section>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">

        {/* =========================
            SEARCH BAR
        ========================== */}

        <div className="mb-7">

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />

          </div>

        </div>


        {/* =========================
            MOBILE TOOLBAR
        ========================== */}

        <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">

          <button
            onClick={() =>
              setShowFilters(!showFilters)
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1F3A] shadow-sm transition hover:border-blue-300"
          >

            <SlidersHorizontal size={17} />

            {showFilters
              ? "Hide Filters"
              : "Filters"}

            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs text-white">
                {activeFilterCount}
              </span>
            )}

          </button>


          <p className="text-sm text-slate-500">
            <span className="font-semibold text-[#0B1F3A]">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

        </div>


        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">


          {/* =================================================
              FILTER SIDEBAR
          ================================================== */}

          <aside
            className={`
              ${
                showFilters
                  ? "fixed inset-0 z-50 block lg:static"
                  : "hidden"
              }
              lg:block
            `}
          >

            {/* Mobile overlay */}
            {showFilters && (
              <div
                className="absolute inset-0 bg-[#0B1F3A]/50 backdrop-blur-sm lg:hidden"
                onClick={() =>
                  setShowFilters(false)
                }
              />
            )}


            <div
              className={`
                ${
                  showFilters
                    ? "absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl"
                    : ""
                }
                border border-slate-200 bg-white p-5 shadow-sm
                lg:sticky lg:top-24 lg:rounded-2xl
              `}
            >

              {/* Filter header */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <SlidersHorizontal
                    size={18}
                    className="text-blue-600"
                  />

                  <h2 className="font-bold text-[#0B1F3A]">
                    Filters
                  </h2>

                </div>


                <div className="flex items-center gap-3">

                  <button
                    onClick={clearFilters}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Clear
                  </button>

                  <button
                    onClick={() =>
                      setShowFilters(false)
                    }
                    className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 lg:hidden"
                  >
                    <X size={20} />
                  </button>

                </div>

              </div>


              {/* Category */}

              <div className="mt-7">

                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Category
                </h3>

                <div className="space-y-1">

                  {categories.map((item) => (

                    <button
                      key={item}
                      onClick={() =>
                        handleCategory(item)
                      }
                      className={`
                        flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition
                        ${
                          category === item
                            ? "bg-blue-600 font-semibold text-white shadow-sm"
                            : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                        }
                      `}
                    >

                      {item}

                      {category === item && (
                        <span className="text-xs">
                          ✓
                        </span>
                      )}

                    </button>

                  ))}

                </div>

              </div>


              {/* Price */}

              <div className="mt-8">

                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Price Range
                </h3>

                <div className="space-y-3">

                  <div className="relative">

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      placeholder="Minimum"
                      value={minPrice}
                      onChange={(e) =>
                        setMinPrice(e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-8 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>


                  <div className="relative">

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      placeholder="Maximum"
                      value={maxPrice}
                      onChange={(e) =>
                        setMaxPrice(e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-8 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

              </div>


              {/* Clear filters */}

              <button
                onClick={clearFilters}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-[#0B1F3A] transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <RotateCcw size={16} />
                Clear All Filters
              </button>


              {/* Mobile apply */}

              <button
                onClick={() =>
                  setShowFilters(false)
                }
                className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 lg:hidden"
              >
                Show {filteredProducts.length} Products
              </button>

            </div>

          </aside>


          {/* =================================================
              PRODUCTS AREA
          ================================================== */}

          <div>

            {/* Top toolbar */}

            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm text-slate-500">

                  Showing{" "}

                  <span className="font-bold text-[#0B1F3A]">
                    {filteredProducts.length}
                  </span>{" "}

                  {filteredProducts.length === 1
                    ? "product"
                    : "products"}

                </p>

                {category !== "All" && (
                  <p className="mt-1 text-xs text-slate-400">
                    Category:{" "}
                    <span className="font-semibold text-blue-600">
                      {category}
                    </span>
                  </p>
                )}

              </div>


              {/* Sort */}

              <div className="relative">

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:w-auto"
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

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

              </div>

            </div>


            {/* =================================================
                PRODUCT GRID
            ================================================== */}

            {filteredProducts.length > 0 ? (

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {filteredProducts.map((product) => (

                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                  />

                ))}

              </div>

            ) : (

              /* =================================================
                 EMPTY STATE
              ================================================== */

              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                  <PackageSearch size={30} />

                </div>

                <h2 className="mt-5 text-2xl font-bold text-[#0B1F3A]">
                  No Products Found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  We couldn't find any products matching
                  your current search or filters.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  <RotateCcw size={16} />
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