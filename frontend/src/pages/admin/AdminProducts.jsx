import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  ArrowRight,
  Boxes,
  ChevronDown,
  CirclePlus,
  Edit3,
  Eye,
  Filter,
  Loader2,
  Package,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  X
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const fetchProducts = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError("")

      const response = await fetch(
        `${API_URL}/api/product`
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load products"
        )
      }

      setProducts(
        Array.isArray(data.products)
          ? data.products
          : []
      )
    } catch (error) {
      console.error("Fetch products error:", error)

      setError(
        error.message || "Unable to load products"
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const deleteProduct = async (productId) => {
    const product = products.find(
      (item) => item._id === productId
    )

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        product?.name || "this product"
      }?\n\nThis action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Please login as admin.")
      }

      const response = await fetch(
        `${API_URL}/api/product/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete product"
        )
      }

      setProducts((prev) =>
        prev.filter((item) => item._id !== productId)
      )

      alert("Product deleted successfully")
    } catch (error) {
      console.error("Delete product error:", error)

      alert(
        error.message || "Failed to delete product"
      )
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // =========================
  // MAIN PRODUCT CATEGORIES
  // Keep these consistent with
  // Products.jsx and AddProduct.jsx
  // =========================

  const categories = [
    "Fashion",
    "Electronics",
    "Shoes",
    "Accessories"
  ]

  const filteredProducts = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase()

    return products.filter((product) => {
      const name = product.name
        ? product.name.toLowerCase()
        : ""

      const description = product.description
        ? product.description.toLowerCase()
        : ""

      const productCategory = product.category
        ? product.category.toLowerCase()
        : ""

      const subCategory = product.subCategory
        ? product.subCategory.toLowerCase()
        : ""

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        description.includes(searchText) ||
        productCategory.includes(searchText) ||
        subCategory.includes(searchText)

      const matchesCategory =
        category === "All" ||
        product.category === category

      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN")
  }

  const clearFilters = () => {
    setSearch("")
    setCategory("All")
  }

  const hasFilters =
    search.trim() !== "" || category !== "All"

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <Loader2
                size={28}
                className="animate-spin text-blue-600"
              />
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#0B1F3A]">
              Loading Products
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Fetching your store products...
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center">
          <div className="w-full rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle size={30} />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold text-[#0B1F3A]">
              Unable to Load Products
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchProducts()}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* =================================
            HEADER
        ================================= */}

        <div className="mb-7 flex flex-col gap-5 sm:mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              <Boxes size={14} />
              ShopX Admin
            </div>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-3xl lg:text-4xl">
              Products
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Manage your store inventory, product
              details and catalog.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => fetchProducts(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#0B1F3A] shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

            <Link
              to="/admin/products/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20"
            >
              <CirclePlus size={17} />
              Add Product
            </Link>
          </div>
        </div>

        {/* =================================
            STATISTICS
        ================================= */}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          {/* Total */}

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Products
                </p>

                <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1F3A]">
                  {products.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Products in store
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:scale-105">
                <Package size={21} />
              </div>
            </div>
          </div>

          {/* Categories */}

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Categories
                </p>

                <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1F3A]">
                  {categories.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Main product categories
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:scale-105">
                <Boxes size={21} />
              </div>
            </div>
          </div>

          {/* Showing */}

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Showing
                </p>

                <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1F3A]">
                  {filteredProducts.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Matching products
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:scale-105">
                <Eye size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* =================================
            SEARCH & FILTER
        ================================= */}

        {products.length > 0 && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Filter size={17} />
              </div>

              <div>
                <h2 className="text-base font-extrabold text-[#0B1F3A]">
                  Find Products
                </h2>

                <p className="text-xs text-slate-400">
                  Search and filter your catalog
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_240px]">

              {/* Search */}

              <div>
                <label
                  htmlFor="product-search"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Search Products
                </label>

                <div className="relative">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="product-search"
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search by name, category or description..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm font-medium text-[#0B1F3A] outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-[#0B1F3A]"
                      aria-label="Clear search"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Category */}

              <div>
                <label
                  htmlFor="category-filter"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Category
                </label>

                <div className="relative">
                  <select
                    id="category-filter"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-semibold text-[#0B1F3A] outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="All">
                      All Categories
                    </option>

                    {categories.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>

            {hasFilters && (
              <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-bold text-[#0B1F3A]">
                    {filteredProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-[#0B1F3A]">
                    {products.length}
                  </span>{" "}
                  products
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex w-fit items-center gap-1.5 text-sm font-bold text-blue-600 transition hover:text-blue-700"
                >
                  <X size={15} />
                  Clear Filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* =================================
            EMPTY STORE
        ================================= */}

        {products.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm sm:px-10">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
              <Package size={34} />
            </div>

            <h2 className="mt-6 text-2xl font-extrabold text-[#0B1F3A]">
              No Products Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your product catalog is currently empty.
              Add your first product to start building
              your ShopX store.
            </p>

            <Link
              to="/admin/products/add"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20"
            >
              <CirclePlus size={17} />
              Add Product
            </Link>
          </div>
        )}

        {/* =================================
            NO MATCHING PRODUCTS
        ================================= */}

        {products.length > 0 &&
          filteredProducts.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm sm:px-10">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                <Search size={34} />
              </div>

              <h2 className="mt-6 text-xl font-extrabold text-[#0B1F3A]">
                No Matching Products
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                We couldn't find any products matching
                your current search or category filter.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20"
              >
                <X size={16} />
                Clear Filters
              </button>
            </div>
          )}

        {/* =================================
            PRODUCT LIST
        ================================= */}

        {filteredProducts.length > 0 && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* List Header */}

            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

              <div>
                <h2 className="text-lg font-extrabold text-[#0B1F3A]">
                  Product Catalog
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1
                    ? "product"
                    : "products"}{" "}
                  displayed
                </p>
              </div>

              {hasFilters && (
                <div className="flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                  <Filter size={13} />
                  Filtered Results
                </div>
              )}
            </div>

            {/* =================================
                DESKTOP TABLE
            ================================= */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[950px] text-left">

                <thead className="border-b border-slate-100 bg-slate-50">
                  <tr>

                    <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Product
                    </th>

                    <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Category
                    </th>

                    <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Price
                    </th>

                    <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Sizes
                    </th>

                    <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredProducts.map((product) => (

                    <tr
                      key={product._id}
                      className="group transition hover:bg-slate-50/80"
                    >

                      {/* Product */}

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">

                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">

                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />

                            {product.bestseller && (
                              <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                                <Sparkles size={11} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">

                            <div className="flex items-center gap-2">

                              <p className="font-bold text-[#0B1F3A]">
                                {product.name}
                              </p>

                              {product.bestseller && (
                                <span className="hidden rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 lg:inline-block">
                                  Bestseller
                                </span>
                              )}

                            </div>

                            <p className="mt-1 max-w-sm truncate text-xs text-slate-400">
                              {product.description}
                            </p>

                          </div>
                        </div>
                      </td>

                      {/* Category */}

                      <td className="px-5 py-5">
                        <p className="text-sm font-bold text-[#0B1F3A]">
                          {product.category || "N/A"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {product.subCategory || "N/A"}
                        </p>
                      </td>

                      {/* Price */}

                      <td className="px-5 py-5">
                        <p className="text-sm font-extrabold text-[#0B1F3A]">
                          ₹{formatPrice(product.price)}
                        </p>
                      </td>

                      {/* Sizes */}

                      <td className="px-5 py-5">
                        <div className="flex max-w-[190px] flex-wrap gap-1.5">

                          {Array.isArray(product.sizes) &&
                          product.sizes.length > 0 ? (
                            product.sizes.map(
                              (size, index) => (
                                <span
                                  key={`${product._id}-${size}-${index}`}
                                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-600"
                                >
                                  {size}
                                </span>
                              )
                            )
                          ) : (
                            <span className="text-xs text-slate-400">
                              No sizes
                            </span>
                          )}

                        </div>
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-5">
                        <div className="flex justify-end gap-2">

                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit3 size={14} />
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              deleteProduct(
                                product._id
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>
            </div>

            {/* =================================
                MOBILE PRODUCT CARDS
            ================================= */}

            <div className="divide-y divide-slate-100 md:hidden">

              {filteredProducts.map((product) => (

                <div
                  key={product._id}
                  className="p-5"
                >

                  {/* Product Top */}

                  <div className="flex gap-4">

                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">

                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />

                      {product.bestseller && (
                        <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Sparkles size={10} />
                        </div>
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-2">

                        <h2 className="font-bold leading-5 text-[#0B1F3A]">
                          {product.name}
                        </h2>

                        {product.bestseller && (
                          <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-blue-700">
                            Best
                          </span>
                        )}

                      </div>

                      <p className="mt-1 text-xs font-medium text-slate-400">
                        {product.category || "N/A"}
                        {" / "}
                        {product.subCategory || "N/A"}
                      </p>

                      <p className="mt-2 text-base font-extrabold text-[#0B1F3A]">
                        ₹{formatPrice(product.price)}
                      </p>

                    </div>
                  </div>

                  {/* Description */}

                  <p className="mt-4 line-clamp-2 text-sm leading-5 text-slate-500">
                    {product.description}
                  </p>

                  {/* Sizes */}

                  <div className="mt-4">

                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Available Sizes
                    </p>

                    <div className="flex flex-wrap gap-1.5">

                      {Array.isArray(product.sizes) &&
                      product.sizes.length > 0 ? (
                        product.sizes.map(
                          (size, index) => (
                            <span
                              key={`${product._id}-mobile-${size}-${index}`}
                              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-600"
                            >
                              {size}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-xs text-slate-400">
                          No sizes
                        </span>
                      )}

                    </div>
                  </div>

                  {/* Actions */}

                  <div className="mt-5 grid grid-cols-2 gap-2">

                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit3 size={15} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        deleteProduct(
                          product._id
                        )
                      }
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>

                  </div>
                </div>
              ))}

            </div>
          </section>
        )}

        {/* Bottom Summary */}

        {filteredProducts.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 px-1 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">

            <p>
              Showing{" "}
              <span className="font-bold text-slate-600">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-600">
                {products.length}
              </span>{" "}
              products
            </p>

            <Link
              to="/admin/products/add"
              className="inline-flex w-fit items-center gap-1 font-bold text-blue-600 transition hover:text-blue-700"
            >
              Add another product
              <ArrowRight size={13} />
            </Link>

          </div>
        )}

      </div>
    </main>
  )
}

export default AdminProducts