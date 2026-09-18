import { useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-20 text-center">
        <p className="text-gray-500">
          Loading product...
        </p>
      </main>
    )
  }

  if (error && !formData.name) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-20 text-center">

        <h1 className="text-2xl font-bold">
          Product Not Found
        </h1>

        <p className="mt-3 text-red-500">
          {error}
        </p>

        <Link
          to="/admin/products"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white"
        >
          Back to Products
        </Link>

      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">

          <Link
            to="/admin/products"
            className="text-sm font-semibold text-gray-500 hover:text-black"
          >
            ← Back to Products
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
            ShopX Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Edit Product
          </h1>

          <p className="mt-2 text-gray-500">
            Update product information.
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8"
        >

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Product Name */}
          <div>

            <label className="mb-2 block text-sm font-semibold">
              Product Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-black"
            />

          </div>

          {/* Description */}
          <div className="mt-6">

            <label className="mb-2 block text-sm font-semibold">
              Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full resize-none rounded-lg border px-4 py-3 outline-none transition focus:border-black"
            />

          </div>

          {/* Price + Category */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Price (₹) *
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="1"
                className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-black"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border bg-white px-4 py-3 outline-none transition focus:border-black"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>

            </div>

          </div>

          {/* Sub Category */}
          <div className="mt-6">

            <label className="mb-2 block text-sm font-semibold">
              Sub Category *
            </label>

            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="w-full rounded-lg border bg-white px-4 py-3 outline-none transition focus:border-black"
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

          {/* Image */}
          <div className="mt-6">

            <label className="mb-2 block text-sm font-semibold">
              Image URL *
            </label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-black"
            />

            {formData.image && (
              <img
                src={formData.image}
                alt="Product preview"
                className="mt-4 h-40 w-40 rounded-xl object-cover"
              />
            )}

          </div>

          {/* Sizes */}
          <div className="mt-6">

            <label className="mb-2 block text-sm font-semibold">
              Sizes
            </label>

            <div className="flex gap-2">

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
                placeholder="e.g. M"
                className="flex-1 rounded-lg border px-4 py-3 uppercase outline-none transition focus:border-black"
              />

              <button
                type="button"
                onClick={addSize}
                className="rounded-lg bg-gray-100 px-5 py-3 font-semibold transition hover:bg-gray-200"
              >
                Add
              </button>

            </div>

            {formData.sizes.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">

                {formData.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => removeSize(size)}
                    className="rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white"
                  >
                    {size} ×
                  </button>
                ))}

              </div>
            )}

          </div>

          {/* Bestseller */}
          <div className="mt-6 rounded-lg border p-4">

            <label className="flex cursor-pointer items-center gap-3">

              <input
                type="checkbox"
                name="bestseller"
                checked={formData.bestseller}
                onChange={handleChange}
                className="h-4 w-4"
              />

              <div>
                <p className="font-semibold">
                  Mark as Bestseller
                </p>

                <p className="text-sm text-gray-500">
                  Show this product as a bestseller.
                </p>
              </div>

            </label>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              to="/admin/products"
              className="rounded-lg border px-6 py-3 text-center font-semibold transition hover:bg-gray-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </main>
  )
}

export default EditProduct