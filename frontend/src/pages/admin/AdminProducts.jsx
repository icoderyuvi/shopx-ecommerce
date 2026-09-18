
import { useEffect, useMemo, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL
import { Link } from "react-router-dom"

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

  const deleteProduct = async productId => {
    const product = products.find(
      item => item._id === productId
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

      setProducts(prev =>
        prev.filter(item => item._id !== productId)
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

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map(product => product.category)
          .filter(Boolean)
      )
    ]

    return uniqueCategories.sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase()

    return products.filter(product => {
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

  const formatPrice = price => {
    return Number(price || 0).toLocaleString(
      "en-IN"
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

              <p className="mt-4 text-sm text-gray-500">
                Loading products...
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl py-20">
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-600">
              !
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Something Went Wrong
            </h1>

            <p className="mt-3 text-sm text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchProducts()}
              className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Try Again
            </button>

          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              ShopX Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Products
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage products in your store.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() => fetchProducts(true)}
              disabled={refreshing}
              className="rounded-xl border bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

            <Link
              to="/admin/products/add"
              className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              + Add Product
            </Link>

          </div>

        </div>

        {/* Statistics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Products
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {products.length}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Products in store
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Categories
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {categories.length}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Product categories
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Showing
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {filteredProducts.length}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Matching products
            </p>
          </div>

        </div>

        {/* Search and Filter */}
        {products.length > 0 && (
          <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">

            <div className="grid gap-4 md:grid-cols-[1fr_240px]">

              {/* Search */}
              <div>
                <label
                  htmlFor="product-search"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Search Products
                </label>

                <div className="relative">

                  <input
                    id="product-search"
                    type="text"
                    value={search}
                    onChange={e =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search by name, category or description..."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-10 text-sm outline-none transition focus:border-black"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition hover:text-black"
                    >
                      X
                    </button>
                  )}

                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category-filter"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Category
                </label>

                <select
                  id="category-filter"
                  value={category}
                  onChange={e =>
                    setCategory(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                >
                  <option value="All">
                    All Categories
                  </option>

                  {categories.map(item => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {(search || category !== "All") && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {products.length}
                  </span>{" "}
                  products
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("")
                    setCategory("All")
                  }}
                  className="text-sm font-semibold text-gray-700 underline hover:text-black"
                >
                  Clear Filters
                </button>

              </div>
            )}

          </div>
        )}

        {/* No Products */}
        {products.length === 0 && (
          <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
              📦
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No Products Yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add your first product to your ShopX store.
            </p>

            <Link
              to="/admin/products/add"
              className="mt-6 inline-flex rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Add Product
            </Link>

          </div>
        )}

        {/* No Matching Products */}
        {products.length > 0 &&
          filteredProducts.length === 0 && (
            <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                🔎
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900">
                No Matching Products
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or category filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("")
                  setCategory("All")
                }}
                className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Clear Filters
              </button>

            </div>
          )}

        {/* Products */}
        {filteredProducts.length > 0 && (
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">

              <table className="w-full min-w-[900px] text-left">

                <thead className="border-b bg-gray-50">
                  <tr>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Product
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Category
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Price
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Sizes
                    </th>

                    <th className="px-5 py-4 text-right text-sm font-semibold text-gray-700">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y">

                  {filteredProducts.map(product => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Product */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-4">

                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-16 w-16 shrink-0 rounded-xl object-cover"
                          />

                          <div className="min-w-0">

                            <p className="font-semibold text-gray-900">
                              {product.name}
                            </p>

                            <p className="mt-1 max-w-xs truncate text-sm text-gray-500">
                              {product.description}
                            </p>

                            {product.bestseller && (
                              <span className="mt-2 inline-block rounded-full bg-black px-2.5 py-1 text-[11px] font-semibold text-white">
                                Bestseller
                              </span>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">

                        <p className="font-medium text-gray-900">
                          {product.category ||
                            "N/A"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {product.subCategory ||
                            "N/A"}
                        </p>

                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">

                        <p className="font-semibold text-gray-900">
                          ₹{formatPrice(product.price)}
                        </p>

                      </td>

                      {/* Sizes */}
                      <td className="px-5 py-4">

                        <div className="flex max-w-[180px] flex-wrap gap-1.5">

                          {Array.isArray(
                            product.sizes
                          ) &&
                          product.sizes.length > 0 ? (
                            product.sizes.map(
                              (size, index) => (
                                <span
                                  key={`${product._id}-${size}-${index}`}
                                  className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                                >
                                  {size}
                                </span>
                              )
                            )
                          ) : (
                            <span className="text-sm text-gray-400">
                              No sizes
                            </span>
                          )}

                        </div>

                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-black"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              deleteProduct(
                                product._id
                              )
                            }
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

            {/* Mobile Cards */}
            <div className="divide-y md:hidden">

              {filteredProducts.map(product => (
                <div
                  key={product._id}
                  className="p-5"
                >

                  <div className="flex gap-4">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-2">

                        <h2 className="font-semibold text-gray-900">
                          {product.name}
                        </h2>

                        {product.bestseller && (
                          <span className="shrink-0 rounded-full bg-black px-2 py-1 text-[10px] font-semibold text-white">
                            Best
                          </span>
                        )}

                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {product.category ||
                          "N/A"}{" "}
                        /{" "}
                        {product.subCategory ||
                          "N/A"}
                      </p>

                      <p className="mt-2 font-bold text-gray-900">
                        ₹{formatPrice(product.price)}
                      </p>

                    </div>

                  </div>

                  {/* Description */}
                  <p className="mt-4 line-clamp-2 text-sm text-gray-500">
                    {product.description}
                  </p>

                  {/* Sizes */}
                  <div className="mt-4 flex flex-wrap gap-2">

                    {Array.isArray(
                      product.sizes
                    ) &&
                    product.sizes.length > 0 ? (
                      product.sizes.map(
                        (size, index) => (
                          <span
                            key={`${product._id}-mobile-${size}-${index}`}
                            className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                          >
                            {size}
                          </span>
                        )
                      )
                    ) : (
                      <span className="text-xs text-gray-400">
                        No sizes
                      </span>
                    )}

                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex gap-2">

                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-black"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        deleteProduct(
                          product._id
                        )
                      }
                      className="flex-1 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>

          </div>
        )}

      </div>
    </main>
  )
}

export default AdminProducts

