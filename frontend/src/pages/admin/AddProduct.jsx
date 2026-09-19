import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Check,
  CircleAlert,
  Image as ImageIcon,
  Link2,
  Loader2,
  PackagePlus,
  Plus,
  Sparkles,
  Tag,
  Trash2
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

// =====================================================
// PRODUCT CATEGORIES
// =====================================================

const categoryOptions = {
  Fashion: ["Men", "Women", "Kids"],

  Electronics: [
    "Mobiles",
    "Laptops",
    "Headphones",
    "Smart Watches"
  ],

  Shoes: ["Men", "Women", "Kids"],

  Accessories: [
    "Bags",
    "Wallets",
    "Sunglasses",
    "Belts"
  ]
}

const categories = Object.keys(categoryOptions)

function AddProduct() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Fashion",
    subCategory: "Men",
    sizes: [],
    bestseller: false
  })

  const [sizeInput, setSizeInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  // =====================================================
  // HANDLE CATEGORY CHANGE
  // =====================================================

  const handleCategoryChange = (event) => {
    const category = event.target.value

    const firstSubCategory =
      categoryOptions[category]?.[0] || ""

    setFormData((prev) => ({
      ...prev,
      category,
      subCategory: firstSubCategory
    }))
  }

  // =====================================================
  // SAFETY SYNC SUB CATEGORY
  // =====================================================

  useEffect(() => {
    const availableSubCategories =
      categoryOptions[formData.category] || []

    if (
      !availableSubCategories.includes(
        formData.subCategory
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        subCategory:
          availableSubCategories[0] || ""
      }))
    }
  }, [
    formData.category,
    formData.subCategory
  ])

  // =====================================================
  // ADD SIZE
  // =====================================================

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

  // =====================================================
  // REMOVE SIZE
  // =====================================================

  const removeSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter(
        (size) => size !== sizeToRemove
      )
    }))
  }

  // =====================================================
  // SUBMIT
  // =====================================================

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
      setLoading(true)

      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Please login as admin.")
      }

      const response = await fetch(
        `${API_URL}/api/product/add`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            description:
              formData.description.trim(),
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
          data.message ||
            "Failed to add product"
        )
      }

      alert("Product added successfully!")

      navigate("/admin/products")
    } catch (error) {
      console.error(
        "Add product error:",
        error
      )

      setError(
        error.message ||
          "Failed to add product"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

      <div className="mx-auto max-w-5xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-7">

          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>

          <div className="mt-6 flex items-start gap-4">

            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0B1F3A] text-white shadow-sm sm:flex">
              <PackagePlus size={23} />
            </div>

            <div>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                <Tag size={13} />
                ShopX Admin
              </div>

              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-3xl lg:text-4xl">
                Add Product
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Add a new product to your ShopX
                catalog with pricing, categories,
                sizes and product imagery.
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit}>

          {/* ERROR */}

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">

              <CircleAlert
                size={19}
                className="mt-0.5 shrink-0"
              />

              <div>

                <p className="font-bold">
                  Unable to add product
                </p>

                <p className="mt-1 leading-5">
                  {error}
                </p>

              </div>

            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

            {/* =================================================
                MAIN FORM
            ================================================== */}

            <div className="space-y-6">

              {/* BASIC INFORMATION */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <PackagePlus size={19} />
                  </div>

                  <div>

                    <h2 className="font-extrabold text-[#0B1F3A]">
                      Basic Information
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Enter the main product details
                    </p>

                  </div>

                </div>

                {/* PRODUCT NAME */}

                <div>

                  <label
                    htmlFor="product-name"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Product Name *
                  </label>

                  <input
                    id="product-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Premium Cotton T-Shirt"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#0B1F3A] outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="mt-5">

                  <label
                    htmlFor="product-description"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Description *
                  </label>

                  <textarea
                    id="product-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Describe the product, its features, material, benefits and other important details..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-[#0B1F3A] outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </section>

              {/* =================================================
                  PRICING & CLASSIFICATION
              ================================================== */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Tag size={19} />
                  </div>

                  <div>

                    <h2 className="font-extrabold text-[#0B1F3A]">
                      Pricing & Classification
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Set pricing and organize the
                      product
                    </p>

                  </div>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* PRICE */}

                  <div>

                    <label
                      htmlFor="product-price"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      Price (₹) *
                    </label>

                    <div className="relative">

                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                        ₹
                      </span>

                      <input
                        id="product-price"
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="1"
                        placeholder="999"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm font-bold text-[#0B1F3A] outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />

                    </div>

                  </div>

                  {/* MAIN CATEGORY */}

                  <div>

                    <label
                      htmlFor="product-category"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      Category *
                    </label>

                    <select
                      id="product-category"
                      name="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0B1F3A] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >

                      {categories.map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

                {/* SUB CATEGORY */}

                <div className="mt-5">

                  <label
                    htmlFor="product-subcategory"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Sub Category *
                  </label>

                  <select
                    id="product-subcategory"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0B1F3A] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >

                    {(
                      categoryOptions[
                        formData.category
                      ] || []
                    ).map(
                      (subCategory) => (
                        <option
                          key={subCategory}
                          value={subCategory}
                        >
                          {subCategory}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* CATEGORY INFORMATION */}

                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">

                  <div className="flex items-start gap-3">

                    <Tag
                      size={17}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                        Product Classification
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-600">

                        <span className="font-bold text-[#0B1F3A]">
                          {formData.category}
                        </span>

                        {" → "}

                        <span className="font-bold text-blue-600">
                          {formData.subCategory}
                        </span>

                      </p>

                    </div>

                  </div>

                </div>

              </section>

              {/* =================================================
                  PRODUCT IMAGE
              ================================================== */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <ImageIcon size={19} />
                  </div>

                  <div>

                    <h2 className="font-extrabold text-[#0B1F3A]">
                      Product Image
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Add a direct image URL
                    </p>

                  </div>

                </div>

                <label
                  htmlFor="product-image"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Image URL *
                </label>

                <div className="relative">

                  <Link2
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="product-image"
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/product-image.jpg"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-[#0B1F3A] outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Use a direct image URL that can be
                  publicly accessed by your website.
                </p>

                {/* IMAGE PREVIEW */}

                {formData.image.trim() && (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

                    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Image Preview
                      </p>

                      <ImageIcon
                        size={15}
                        className="text-slate-400"
                      />

                    </div>

                    <div className="flex min-h-52 items-center justify-center p-4">

                      <img
                        src={formData.image}
                        alt="Product preview"
                        className="max-h-64 max-w-full rounded-xl object-contain"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none"
                        }}
                      />

                    </div>

                  </div>
                )}

              </section>

              {/* =================================================
                  SIZES
              ================================================== */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

                    <span className="text-sm font-extrabold">
                      S
                    </span>

                  </div>

                  <div>

                    <h2 className="font-extrabold text-[#0B1F3A]">
                      Available Sizes
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Add all available product
                      sizes
                    </p>

                  </div>

                </div>

                <div className="flex flex-col gap-2 sm:flex-row">

                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(event) =>
                      setSizeInput(
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter"
                      ) {
                        event.preventDefault()
                        addSize()
                      }
                    }}
                    placeholder="e.g. M, L, XL or 9"
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold uppercase text-[#0B1F3A] outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={addSize}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
                  >
                    <Plus size={16} />
                    Add Size
                  </button>

                </div>

                {formData.sizes.length > 0 ? (
                  <div className="mt-5">

                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Selected Sizes
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {formData.sizes.map(
                        (size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() =>
                              removeSize(size)
                            }
                            className="group inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                          >

                            <Check
                              size={14}
                              className="group-hover:hidden"
                            />

                            <Trash2
                              size={14}
                              className="hidden group-hover:block"
                            />

                            {size}

                          </button>
                        )
                      )}

                    </div>

                  </div>
                ) : (
                  <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">

                    <p className="text-xs font-medium text-slate-400">
                      No sizes added yet
                    </p>

                  </div>
                )}

              </section>

            </div>

            {/* =================================================
                SIDEBAR
            ================================================== */}

            <div className="space-y-6">

              {/* BESTSELLER */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Sparkles size={19} />
                  </div>

                  <div>

                    <h2 className="font-extrabold text-[#0B1F3A]">
                      Product Visibility
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Highlight this product in
                      your store.
                    </p>

                  </div>

                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/50">

                  <input
                    type="checkbox"
                    name="bestseller"
                    checked={
                      formData.bestseller
                    }
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                  />

                  <div>

                    <p className="text-sm font-bold text-[#0B1F3A]">
                      Mark as Bestseller
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Show this product as a
                      bestseller across your
                      store.
                    </p>

                  </div>

                </label>

              </section>

              {/* PRODUCT SUMMARY */}

              <section className="rounded-2xl bg-[#0B1F3A] p-5 text-white shadow-xl shadow-[#0B1F3A]/10 sm:p-6">

                <div className="flex items-center gap-2">

                  <PackagePlus
                    size={18}
                    className="text-blue-300"
                  />

                  <h2 className="font-extrabold">
                    Product Summary
                  </h2>

                </div>

                <div className="mt-5 space-y-4">

                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">

                    <span className="text-xs text-slate-300">
                      Name
                    </span>

                    <span className="max-w-[170px] truncate text-right text-xs font-bold">
                      {formData.name ||
                        "Not added"}
                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">

                    <span className="text-xs text-slate-300">
                      Price
                    </span>

                    <span className="text-sm font-extrabold">

                      {formData.price
                        ? `₹${Number(
                            formData.price
                          ).toLocaleString(
                            "en-IN"
                          )}`
                        : "₹0"}

                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">

                    <span className="text-xs text-slate-300">
                      Category
                    </span>

                    <span className="text-right text-xs font-bold">
                      {formData.category}
                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">

                    <span className="text-xs text-slate-300">
                      Sub Category
                    </span>

                    <span className="text-right text-xs font-bold text-blue-300">
                      {formData.subCategory}
                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">

                    <span className="text-xs text-slate-300">
                      Sizes
                    </span>

                    <span className="text-xs font-bold">
                      {formData.sizes.length}
                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-xs text-slate-300">
                      Bestseller
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold">

                      {formData.bestseller ? (
                        <>
                          <Check
                            size={14}
                            className="text-blue-300"
                          />
                          Yes
                        </>
                      ) : (
                        "No"
                      )}

                    </span>

                  </div>

                </div>

              </section>

            </div>

          </div>

          {/* =================================================
              ACTIONS
          ================================================== */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

              <Link
                to="/admin/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-[#0B1F3A]"
              >
                <ArrowLeft size={16} />
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Adding Product...
                  </>
                ) : (
                  <>
                    <PackagePlus size={17} />
                    Add Product
                  </>
                )}

              </button>

            </div>

          </div>

        </form>

      </div>

    </main>
  )
}

export default AddProduct