import { useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL

import {
  ArrowLeft,
  Check,
  CircleAlert,
  Image as ImageIcon,
  Link2,
  Loader2,
  Package,
  Plus,
  Save,
  Sparkles,
  Tag,
  Trash2
} from "lucide-react"

import { Link, useNavigate, useParams } from "react-router-dom"

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Men",
    subCategory: "Topwear",
    sizes: [],
    bestseller: false
  })

  const [sizeInput, setSizeInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Load product
  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        `${API_URL}/api/product/${id}`
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load product"
        )
      }

      const product = data.product

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        image: product.image || "",
        category: product.category || "Men",
        subCategory: product.subCategory || "Topwear",
        sizes: Array.isArray(product.sizes)
          ? product.sizes
          : [],
        bestseller: Boolean(product.bestseller)
      })
    } catch (error) {
      console.error("Fetch product error:", error)
      setError(error.message || "Failed to load product")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const addSize = () => {
    const size = sizeInput.trim().toUpperCase()

    if (!size) {
      return
    }

    if (formData.sizes.includes(size)) {
      setSizeInput("")
      return
    }

    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, size]
    }))

    setSizeInput("")
  }

  const removeSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter(
        (size) => size !== sizeToRemove
      )
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.image.trim()
    ) {
      setError("Please fill all required fields.")
      return
    }

    if (Number(formData.price) <= 0) {
      setError("Price must be greater than 0.")
      return
    }

    try {
      setSaving(true)

      const token = localStorage.getItem("token")

      const response = await fetch(
        `${API_URL}/api/product/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: Number(formData.price),
            image: formData.image.trim(),
            category: formData.category,
            subCategory: formData.subCategory,
            sizes: formData.sizes,
            bestseller: formData.bestseller
          })
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update product"
        )
      }

      alert("Product updated successfully!")

      navigate("/admin/products")
    } catch (error) {
      console.error("Update product error:", error)

      setError(
        error.message || "Failed to update product"
      )
    } finally {
      setSaving(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B1F3A] text-white shadow-lg shadow-[#0B1F3A]/10">
              <Loader2
                size={25}
                className="animate-spin"
              />
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#0B1F3A]">
              Loading product
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Please wait while we load the product details.
            </p>
          </div>
        </div>
      </main>
    )
  }

  // Product not found
  if (error && !formData.name) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-[75vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <CircleAlert size={30} />
            </div>

            <h1 className="mt-5 text-2xl font-extrabold text-[#0B1F3A]">
              Product Not Found
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <Link
              to="/admin/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin/products"
            className="group inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#0B1F3A]"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Products
          </Link>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
                <Package size={13} />
                Product Management
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-4xl">
                Edit Product
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Update product details, pricing, availability and
                storefront settings.
              </p>
            </div>

            {/* Product ID */}
            <div className="hidden rounded-xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm sm:block">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Product ID
              </p>

              <p className="mt-1 max-w-[180px] truncate text-xs font-semibold text-slate-600">
                {id}
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <CircleAlert
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-bold">
                Unable to save changes
              </p>

              <p className="mt-1 leading-5">
                {error}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">

            {/* Main Form */}
            <div className="space-y-6">

              {/* Basic Information */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Package size={19} />
                    </div>

                    <div>
                      <h2 className="font-extrabold text-[#0B1F3A]">
                        Basic Information
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Product name and description
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-5 sm:p-7">

                  {/* Product Name */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Product Name
                      <span className="ml-1 text-blue-600">*</span>
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Description
                      <span className="ml-1 text-blue-600">*</span>
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="6"
                      placeholder="Describe the product..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                </div>
              </section>

              {/* Pricing & Category */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Tag size={19} />
                    </div>

                    <div>
                      <h2 className="font-extrabold text-[#0B1F3A]">
                        Pricing & Category
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Set pricing and product classification
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-7">

                  <div className="grid gap-5 sm:grid-cols-2">

                    {/* Price */}
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Price (₹)
                        <span className="ml-1 text-blue-600">*</span>
                      </label>

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                          ₹
                        </span>

                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          min="1"
                          placeholder="0"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-9 pr-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Category
                        <span className="ml-1 text-blue-600">*</span>
                      </label>

                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                      </select>
                    </div>

                    {/* Sub Category */}
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Sub Category
                        <span className="ml-1 text-blue-600">*</span>
                      </label>

                      <select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="Topwear">
                          Topwear
                        </option>

                        <option value="Bottomwear">
                          Bottomwear
                        </option>

                        <option value="Winterwear">
                          Winterwear
                        </option>

                        <option value="Footwear">
                          Footwear
                        </option>

                        <option value="Accessories">
                          Accessories
                        </option>
                      </select>
                    </div>

                  </div>
                </div>
              </section>

              {/* Image */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <ImageIcon size={19} />
                    </div>

                    <div>
                      <h2 className="font-extrabold text-[#0B1F3A]">
                        Product Image
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Update the product image URL
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-7">

                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Image URL
                    <span className="ml-1 text-blue-600">*</span>
                  </label>

                  <div className="relative">
                    <Link2
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/product-image.jpg"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {formData.image && (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <div className="relative aspect-[16/8] sm:aspect-[16/7]">
                        <img
                          src={formData.image}
                          alt="Product preview"
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none"
                          }}
                        />

                        <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
                          <ImageIcon size={13} />
                          Preview
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Sizes */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Sparkles size={19} />
                    </div>

                    <div>
                      <h2 className="font-extrabold text-[#0B1F3A]">
                        Available Sizes
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Add or remove available product sizes
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-7">

                  <div className="flex flex-col gap-3 sm:flex-row">

                    <input
                      type="text"
                      value={sizeInput}
                      onChange={(event) =>
                        setSizeInput(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault()
                          addSize()
                        }
                      }}
                      placeholder="Enter size, e.g. M"
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold uppercase text-slate-800 outline-none transition placeholder:normal-case placeholder:font-medium placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={addSize}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      <Plus size={17} />
                      Add Size
                    </button>

                  </div>

                  {formData.sizes.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {formData.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => removeSize(size)}
                          className="group inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-2.5 text-sm font-extrabold text-blue-700 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                        >
                          {size}

                          <Trash2
                            size={14}
                            className="opacity-60 transition group-hover:opacity-100"
                          />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center">
                      <p className="text-sm font-semibold text-slate-500">
                        No sizes added yet
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Add sizes using the field above.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Bestseller */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-5 sm:p-7">

                  <label className="flex cursor-pointer items-start gap-4">
                    <input
                      type="checkbox"
                      name="bestseller"
                      checked={formData.bestseller}
                      onChange={handleChange}
                      className="mt-1 h-5 w-5 cursor-pointer accent-blue-600"
                    />

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-extrabold text-[#0B1F3A]">
                          Mark as Bestseller
                        </p>

                        {formData.bestseller && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600">
                            <Check size={11} />
                            Active
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        Highlight this product in the store's
                        bestseller section.
                      </p>
                    </div>
                  </label>

                </div>
              </section>

              {/* Mobile buttons */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end lg:hidden">
                <Link
                  to="/admin/products"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0B1F3A]/10 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Preview / Summary */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Preview image */}
                <div className="relative aspect-square bg-slate-100">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt={formData.name || "Product"}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none"
                      }}
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-slate-400">
                      <ImageIcon size={40} />
                      <p className="mt-3 text-sm font-semibold">
                        Image preview
                      </p>
                    </div>
                  )}

                  {formData.bestseller && (
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                      <Sparkles size={12} />
                      Bestseller
                    </div>
                  )}
                </div>

                {/* Product summary */}
                <div className="p-5">

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Product Preview
                  </p>

                  <h3 className="mt-2 line-clamp-2 text-xl font-extrabold text-[#0B1F3A]">
                    {formData.name || "Product Name"}
                  </h3>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-xl font-extrabold text-blue-600">
                      ₹
                      {formData.price
                        ? Number(formData.price).toLocaleString("en-IN")
                        : "0"}
                    </p>

                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600">
                      {formData.category}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-5">

                    <div className="flex items-center justify-between py-2">
                      <span className="text-xs font-semibold text-slate-400">
                        Sub Category
                      </span>

                      <span className="text-xs font-bold text-slate-700">
                        {formData.subCategory}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-xs font-semibold text-slate-400">
                        Available Sizes
                      </span>

                      <span className="text-xs font-bold text-slate-700">
                        {formData.sizes.length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-xs font-semibold text-slate-400">
                        Bestseller
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          formData.bestseller
                            ? "text-blue-600"
                            : "text-slate-500"
                        }`}
                      >
                        {formData.bestseller
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>

                  </div>

                </div>
              </div>

              {/* Desktop actions */}
              <div className="mt-4 hidden space-y-3 lg:block">

                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0B1F3A]/10 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  )}
                </button>

                <Link
                  to="/admin/products"
                  className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>

              </div>

              {/* Tip */}
              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Check size={15} />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold text-[#0B1F3A]">
                      Before saving
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Check the image, price, category and
                      available sizes before publishing changes.
                    </p>
                  </div>
                </div>
              </div>

            </aside>
          </div>
        </form>
      </div>
    </main>
  )
}

export default EditProduct