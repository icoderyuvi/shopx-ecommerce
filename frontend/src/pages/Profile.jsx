
import { useContext, useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL

import { useNavigate, Link } from "react-router-dom"
import {
  User,
  Mail,
  CalendarDays,
  LogOut,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react"

import { ShopContext } from "../context/ShopContext"

const Profile = () => {
  const navigate = useNavigate()
  const { logout } = useContext(ShopContext)

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const getProfile = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        navigate("/login")
        return
      }

      try {
        const response = await fetch(
          `${API_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const data = await response.json()

        if (!data.success) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          navigate("/login")
          return
        }

        setUser(data.user)
      } catch (error) {
        setError("Unable to load profile")
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [navigate])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  /*
   * ============================
   * LOADING
   * ============================
   */

  if (loading) {
    return (
      <main className="min-h-[75vh] bg-slate-50 px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">

          <div className="mb-8">
            <div className="h-9 w-44 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-3 h-4 w-64 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="h-32 animate-pulse bg-slate-200 sm:h-40" />

            <div className="px-5 pb-8 sm:px-8">

              <div className="relative pt-32 sm:pt-20">

                <div className="absolute left-0 top-0 h-24 w-24 animate-pulse rounded-3xl bg-slate-300 sm:h-28 sm:w-28" />

                <div className="space-y-3">
                  <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-56 animate-pulse rounded bg-slate-100" />
                </div>

              </div>

              <div className="mt-8 h-20 animate-pulse rounded-2xl bg-slate-100" />

              <div className="mt-8 space-y-5">

                <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                  <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                  <div className="h-20 animate-pulse rounded-2xl bg-slate-100 sm:col-span-2" />
                </div>

              </div>

            </div>
          </div>

        </div>
      </main>
    )
  }

  /*
   * ============================
   * ERROR
   * ============================
   */

  if (error) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-12">

        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={30} />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-[#0B1F3A]">
            Unable to Load Profile
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-500">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-[#0B1F3A] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
          >
            Try Again
          </button>

        </div>

      </main>
    )
  }

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "U"

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 px-3 py-6 sm:px-6 sm:py-12">

      <div className="mx-auto w-full max-w-4xl">

        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="mb-7 sm:mb-9">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            <User size={13} />
            Account
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Manage your account information and preferences.
          </p>

        </div>

        {/* =========================
            PROFILE CARD
        ========================= */}

        <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* =========================
              PROFILE BANNER
          ========================= */}

          <div className="relative h-32 overflow-hidden bg-[#0B1F3A] sm:h-40">

            <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-blue-600/20 blur-2xl" />

            <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl" />

            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A] to-[#123c70]" />

            <div className="relative flex h-full items-center px-5 sm:px-8">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                  Welcome back
                </p>

                <p className="mt-1 text-sm text-white/70">
                  Your ShopX account
                </p>

              </div>

            </div>

          </div>

          {/* =========================
              PROFILE CONTENT
          ========================= */}

          <div className="px-4 pb-7 sm:px-8 sm:pb-9">

            {/* =========================
                USER IDENTITY
            ========================= */}

            <div className="relative">

              {/* MOBILE IDENTITY */}
              <div className="flex flex-col pt-0 sm:hidden">

                {/* Avatar */}

                <div className="-mt-12 flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-blue-600 text-3xl font-extrabold text-white shadow-xl">
                  {firstLetter}
                </div>

                {/* Name + Email */}

                <div className="mt-4 min-w-0 w-full">

                  <h2 className="max-w-full break-words text-2xl font-extrabold leading-tight tracking-tight text-[#0B1F3A]">
                    {user?.name}
                  </h2>

                  <div className="mt-2 flex min-w-0 w-full items-start gap-1.5 text-sm text-slate-500">

                    <Mail
                      size={14}
                      className="mt-0.5 shrink-0"
                    />

                    <span className="min-w-0 break-all leading-5">
                      {user?.email}
                    </span>

                  </div>

                </div>

              </div>

              {/* DESKTOP IDENTITY */}

              <div className="relative hidden pt-20 sm:block">

                <div className="absolute left-0 top-0 flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-white bg-blue-600 text-4xl font-extrabold text-white shadow-xl">
                  {firstLetter}
                </div>

                <div className="min-w-0">

                  <h2 className="max-w-full break-words text-3xl font-extrabold leading-tight tracking-tight text-[#0B1F3A]">
                    {user?.name}
                  </h2>

                  <div className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-slate-500">

                    <Mail
                      size={14}
                      className="shrink-0"
                    />

                    <span className="min-w-0 break-all">
                      {user?.email}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* =========================
                ACCOUNT BADGE
            ========================= */}

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <ShieldCheck size={20} />
              </div>

              <div className="min-w-0">

                <p className="text-sm font-bold text-[#0B1F3A]">
                  Account Verified
                </p>

                <p className="mt-0.5 break-words text-xs leading-5 text-slate-500">
                  Your ShopX account information is securely stored.
                </p>

              </div>

            </div>

            {/* =========================
                ACCOUNT INFORMATION
            ========================= */}

            <div className="mt-8">

              <div className="mb-4">

                <h3 className="text-lg font-extrabold text-[#0B1F3A]">
                  Account Information
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your personal account details.
                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* NAME */}

                <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/40">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                      <User size={18} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Name
                      </p>

                      <p className="mt-1 break-words text-sm font-bold text-[#0B1F3A]">
                        {user?.name}
                      </p>

                    </div>

                  </div>

                </div>

                {/* EMAIL */}

                <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/40">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                      <Mail size={18} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-bold text-[#0B1F3A]">
                        {user?.email}
                      </p>

                    </div>

                  </div>

                </div>

                {/* ACCOUNT CREATED */}

                <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/40 sm:col-span-2">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                      <CalendarDays size={18} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Account Created
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#0B1F3A]">
                        {new Date(
                          user?.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric"
                        })}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* =========================
                QUICK ACTIONS
            ========================= */}

            <div className="mt-8">

              <h3 className="text-lg font-extrabold text-[#0B1F3A]">
                Quick Actions
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">

                {/* Orders */}

                <Link
                  to="/orders"
                  className="group flex min-w-0 items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <ShoppingBag size={18} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-sm font-bold text-[#0B1F3A]">
                        My Orders
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        View your order history
                      </p>

                    </div>

                  </div>

                  <ChevronRight
                    size={18}
                    className="ml-2 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  />

                </Link>

                {/* Products */}

                <Link
                  to="/products"
                  className="group flex min-w-0 items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <ShoppingBag size={18} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-sm font-bold text-[#0B1F3A]">
                        Browse Products
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        Explore our collection
                      </p>

                    </div>

                  </div>

                  <ChevronRight
                    size={18}
                    className="ml-2 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  />

                </Link>

              </div>

            </div>

            {/* =========================
                LOGOUT
            ========================= */}

            <div className="mt-8 border-t border-slate-100 pt-6">

              <button
                onClick={handleLogout}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3.5 text-sm font-bold text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 sm:w-auto"
              >

                <LogOut size={17} />

                Logout

              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  )
}

export default Profile

