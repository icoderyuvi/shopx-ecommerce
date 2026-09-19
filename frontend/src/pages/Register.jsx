import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ShoppingBag,
  User
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

const Register = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

    if (error) {
      setError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message)
        return
      }

      alert("Account created successfully!")

      navigate("/login")
    } catch (error) {
      setError("Unable to connect to server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50">

      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-2">

          {/* =================================
              LEFT BRAND PANEL
          ================================= */}

          <div className="relative hidden overflow-hidden bg-[#0B1F3A] p-10 text-white lg:flex lg:flex-col lg:justify-between">

            {/* Decorative elements */}

            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-600/20 blur-2xl" />

            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-2xl" />

            <div className="relative">

              {/* Logo */}

              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                  <ShoppingBag size={22} />
                </div>

                <span className="text-xl font-extrabold tracking-tight">
                  ShopX
                </span>
              </Link>

              {/* Heading */}

              <div className="mt-20 max-w-md">

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                  Join ShopX
                </p>

                <h2 className="mt-4 text-4xl font-extrabold leading-tight">
                  Everything you need, all in one place.
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-300">
                  Create your ShopX account and enjoy a simple, secure and convenient shopping experience.
                </p>

              </div>

            </div>

            {/* Benefits */}

            <div className="relative mt-10 space-y-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Easy Shopping
                  </p>

                  <p className="text-xs text-slate-400">
                    Discover products made for you
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Secure Account
                  </p>

                  <p className="text-xs text-slate-400">
                    Your account information stays protected
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <ShoppingBag size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Track Your Orders
                  </p>

                  <p className="text-xs text-slate-400">
                    Keep your purchases organized
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* =================================
              REGISTER PANEL
          ================================= */}

          <div className="p-6 sm:p-10 lg:p-12">

            {/* Mobile Logo */}

            <div className="mb-8 flex justify-center lg:hidden">

              <Link
                to="/"
                className="inline-flex items-center gap-2.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1F3A] text-white">
                  <ShoppingBag size={20} />
                </div>

                <span className="text-xl font-extrabold tracking-tight text-[#0B1F3A]">
                  ShopX
                </span>
              </Link>

            </div>

            <div className="mx-auto max-w-md">

              {/* Heading */}

              <div className="mb-8">

                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <User size={21} />
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-4xl">
                  Create Account
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Join ShopX today and start your shopping journey.
                </p>

              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Error */}

                {error && (
                  <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600">

                    <span className="mt-0.5 shrink-0">
                      ⚠️
                    </span>

                    <p className="font-medium">
                      {error}
                    </p>

                  </div>
                )}

                {/* Name */}

                <div>

                  <label
                    htmlFor="name"
                    className="mb-2 flex items-center gap-2 text-sm font-bold text-[#0B1F3A]"
                  >
                    <User
                      size={15}
                      className="text-blue-600"
                    />
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    autoComplete="name"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 flex items-center gap-2 text-sm font-bold text-[#0B1F3A]"
                  >
                    <Mail
                      size={15}
                      className="text-blue-600"
                    />
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

                {/* Password */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 flex items-center gap-2 text-sm font-bold text-[#0B1F3A]"
                  >
                    <LockKeyhole
                      size={15}
                      className="text-blue-600"
                    />
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Password must contain at least 6 characters.
                  </p>

                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-blue-600 hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}

                </button>

                {/* Login */}

                <div className="pt-2 text-center">

                  <p className="text-sm text-slate-500">
                    Already have an account?{" "}

                    <Link
                      to="/login"
                      className="font-bold text-blue-600 transition hover:text-blue-700 hover:underline"
                    >
                      Login
                    </Link>
                  </p>

                </div>

              </form>

              {/* Security */}

              <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-100 pt-6">

                <ShieldCheck
                  size={15}
                  className="text-blue-600"
                />

                <p className="text-xs text-slate-400">
                  Your information is securely handled by ShopX
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  )
}

export default Register