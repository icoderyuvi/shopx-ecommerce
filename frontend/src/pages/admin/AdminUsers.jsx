import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Crown,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  User,
  Users,
  X
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [error, setError] = useState("")

  const fetchUsers = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError("")

      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Please login as admin.")
      }

      const response = await fetch(
        `${API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load users"
        )
      }

      setUsers(
        Array.isArray(data.users)
          ? data.users
          : []
      )
    } catch (error) {
      console.error("Fetch users error:", error)

      setError(
        error.message || "Unable to load users"
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const deleteUser = async userId => {
    const selectedUser = users.find(
      user => user._id === userId
    )

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        selectedUser?.name || "this user"
      }?\n\nThis action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(userId)

      const token = localStorage.getItem("token")

      const response = await fetch(
        `${API_URL}/api/admin/users/${userId}`,
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
          data.message || "Failed to delete user"
        )
      }

      setUsers(prev =>
        prev.filter(user => user._id !== userId)
      )
    } catch (error) {
      console.error("Delete user error:", error)

      alert(
        error.message || "Unable to delete user"
      )
    } finally {
      setDeletingId(null)
    }
  }

  const getCartCount = cartData => {
    if (!Array.isArray(cartData)) {
      return 0
    }

    return cartData.reduce(
      (total, item) =>
        total + Number(item?.quantity || 0),
      0
    )
  }

  const formatDate = date => {
    if (!date) {
      return "N/A"
    }

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A"
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }

  const getInitial = name => {
    if (!name) {
      return "U"
    }

    return name.trim().charAt(0).toUpperCase()
  }

  const adminCount = users.filter(
    user => user.isAdmin
  ).length

  const customerCount = users.filter(
    user => !user.isAdmin
  ).length

  const totalCartItems = users.reduce(
    (total, user) =>
      total + getCartCount(user.cartData),
    0
  )

  const filteredUsers = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase()

    return users.filter(user => {
      const name = user.name
        ? user.name.toLowerCase()
        : ""

      const email = user.email
        ? user.email.toLowerCase()
        : ""

      const userId = user._id
        ? user._id.toLowerCase()
        : ""

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        email.includes(searchText) ||
        userId.includes(searchText)

      let matchesRole = true

      if (roleFilter === "Admin") {
        matchesRole = user.isAdmin === true
      }

      if (roleFilter === "Customer") {
        matchesRole = user.isAdmin !== true
      }

      return matchesSearch && matchesRole
    })
  }, [users, search, roleFilter])

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-9 w-40 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(item => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>

          <div className="mt-6 h-28 animate-pulse rounded-2xl border border-slate-200 bg-white" />

          <div className="mt-6 hidden h-80 animate-pulse rounded-2xl border border-slate-200 bg-white md:block" />

          <div className="mt-6 space-y-4 md:hidden">
            {[1, 2].map(item => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>

        </div>
      </main>
    )
  }

  // =========================
  // Error
  // =========================

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center">

          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle size={30} />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              ShopX Admin
            </p>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-3xl">
              Unable to Load Users
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchUsers()}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#0B1F3A]/10 transition hover:bg-blue-600"
            >
              <RefreshCw size={17} />
              Try Again
            </button>

          </div>

        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">

      <div className="mx-auto max-w-7xl">

        {/* =========================
            Header
        ========================= */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />

              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                ShopX Admin
              </p>
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-4xl">
              Users
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage registered customers and administrators from one place.
            </p>

          </div>

          <button
            type="button"
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#0B1F3A] shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh Users"}
          </button>

        </div>

        {/* =========================
            Statistics
        ========================= */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Users */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Total Users
                </p>

                <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1F3A]">
                  {users.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <Users size={20} />
              </div>

            </div>

            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-full rounded-full bg-blue-600" />
            </div>

          </div>

          {/* Customers */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Customers
                </p>

                <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1F3A]">
                  {customerCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <User size={20} />
              </div>

            </div>

            <p className="mt-4 text-xs font-semibold text-slate-400">
              Registered shoppers
            </p>

          </div>

          {/* Admins */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Administrators
                </p>

                <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1F3A]">
                  {adminCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <ShieldCheck size={20} />
              </div>

            </div>

            <p className="mt-4 text-xs font-semibold text-slate-400">
              Protected accounts
            </p>

          </div>

          {/* Cart Items */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Cart Items
                </p>

                <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1F3A]">
                  {totalCartItems}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ShoppingCart size={20} />
              </div>

            </div>

            <p className="mt-4 text-xs font-semibold text-slate-400">
              Items currently in carts
            </p>

          </div>

        </div>

        {/* =========================
            Search / Filters
        ========================= */}

        {users.length > 0 && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B1F3A] text-white">
                <Search size={17} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-[#0B1F3A]">
                  Find Users
                </h2>

                <p className="text-xs text-slate-400">
                  Search by name, email or user ID.
                </p>
              </div>

            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_220px]">

              {/* Search */}
              <div>

                <label
                  htmlFor="user-search"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
                >
                  Search Users
                </label>

                <div className="relative">

                  <Search
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="user-search"
                    type="text"
                    value={search}
                    onChange={e =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search name, email or user ID..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm font-medium text-[#0B1F3A] outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-[#0B1F3A]"
                      aria-label="Clear search"
                    >
                      <X size={15} />
                    </button>
                  )}

                </div>

              </div>

              {/* Role */}
              <div>

                <label
                  htmlFor="role-filter"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
                >
                  Role
                </label>

                <select
                  id="role-filter"
                  value={roleFilter}
                  onChange={e =>
                    setRoleFilter(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-[#0B1F3A] outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="All">
                    All Users
                  </option>

                  <option value="Customer">
                    Customers
                  </option>

                  <option value="Admin">
                    Administrators
                  </option>
                </select>

              </div>

            </div>

            {(search || roleFilter !== "All") && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">

                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-extrabold text-[#0B1F3A]">
                    {filteredUsers.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-extrabold text-[#0B1F3A]">
                    {users.length}
                  </span>{" "}
                  users
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("")
                    setRoleFilter("All")
                  }}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 transition hover:text-blue-700"
                >
                  <X size={15} />
                  Clear Filters
                </button>

              </div>
            )}

          </div>
        )}

        {/* =========================
            No Users
        ========================= */}

        {users.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm sm:p-14">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Users size={30} />
            </div>

            <h2 className="mt-6 text-xl font-extrabold text-[#0B1F3A]">
              No Users Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Registered customers will appear here once they create an account.
            </p>

          </div>
        )}

        {/* =========================
            No Search Results
        ========================= */}

        {users.length > 0 &&
          filteredUsers.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm sm:p-14">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Search size={28} />
              </div>

              <h2 className="mt-6 text-xl font-extrabold text-[#0B1F3A]">
                No Matching Users
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or role filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("")
                  setRoleFilter("All")
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B1F3A] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
              >
                <X size={16} />
                Clear Filters
              </button>

            </div>
          )}

        {/* =========================
            Desktop Table
        ========================= */}

        {filteredUsers.length > 0 && (
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">

            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Users size={17} />
                </div>

                <div>
                  <h2 className="text-sm font-extrabold text-[#0B1F3A]">
                    Registered Users
                  </h2>

                  <p className="text-xs text-slate-400">
                    {filteredUsers.length} user
                    {filteredUsers.length !== 1 ? "s" : ""} displayed
                  </p>
                </div>

              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] text-left">

                <thead className="border-b border-slate-100 bg-slate-50">

                  <tr>

                    <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      User
                    </th>

                    <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Email
                    </th>

                    <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Cart
                    </th>

                    <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Role
                    </th>

                    <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Joined
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredUsers.map(user => (

                    <tr
                      key={user._id}
                      className="border-b border-slate-100 transition last:border-b-0 hover:bg-blue-50/30"
                    >

                      {/* User */}
                      <td className="px-5 py-5">

                        <div className="flex items-center gap-3">

                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white shadow-sm ${
                              user.isAdmin
                                ? "bg-gradient-to-br from-violet-600 to-violet-800"
                                : "bg-gradient-to-br from-[#0B1F3A] to-blue-600"
                            }`}
                          >
                            {getInitial(user.name)}
                          </div>

                          <div className="min-w-0">

                            <div className="flex items-center gap-2">

                              <p className="font-bold text-[#0B1F3A]">
                                {user.name ||
                                  "Unnamed User"}
                              </p>

                              {user.isAdmin && (
                                <Crown
                                  size={14}
                                  className="shrink-0 text-violet-500"
                                />
                              )}

                            </div>

                            <p className="mt-1 max-w-[220px] truncate text-[11px] text-slate-400">
                              {user._id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Email */}
                      <td className="px-5 py-5">

                        <div className="flex items-center gap-2">

                          <Mail
                            size={15}
                            className="shrink-0 text-slate-400"
                          />

                          <p className="max-w-[250px] truncate text-sm font-medium text-slate-600">
                            {user.email ||
                              "No email"}
                          </p>

                        </div>

                      </td>

                      {/* Cart */}
                      <td className="px-5 py-5">

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                          <ShoppingCart size={13} />
                          {getCartCount(
                            user.cartData
                          )}{" "}
                          items
                        </span>

                      </td>

                      {/* Role */}
                      <td className="px-5 py-5">

                        {user.isAdmin ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                            <ShieldCheck size={13} />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                            <User size={13} />
                            Customer
                          </span>
                        )}

                      </td>

                      {/* Joined */}
                      <td className="whitespace-nowrap px-5 py-5 text-sm font-medium text-slate-600">
                        {formatDate(
                          user.createdAt
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-5 text-right">

                        {user.isAdmin ? (

                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-400">
                            <ShieldCheck size={14} />
                            Protected
                          </span>

                        ) : (

                          <button
                            type="button"
                            onClick={() =>
                              deleteUser(
                                user._id
                              )
                            }
                            disabled={
                              deletingId ===
                              user._id
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3.5 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={14} />

                            {deletingId ===
                            user._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* =========================
            Mobile Cards
        ========================= */}

        {filteredUsers.length > 0 && (
          <div className="space-y-4 md:hidden">

            {filteredUsers.map(user => (

              <div
                key={user._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >

                {/* User Header */}
                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-5">

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-extrabold text-white shadow-sm ${
                        user.isAdmin
                          ? "bg-gradient-to-br from-violet-600 to-violet-800"
                          : "bg-gradient-to-br from-[#0B1F3A] to-blue-600"
                      }`}
                    >
                      {getInitial(user.name)}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h2 className="font-extrabold text-[#0B1F3A]">
                          {user.name ||
                            "Unnamed User"}
                        </h2>

                        {user.isAdmin && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-[10px] font-extrabold text-violet-700">
                            <Crown size={11} />
                            Admin
                          </span>
                        )}

                      </div>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {user.email ||
                          "No email"}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="p-5">

                  {/* User ID */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">

                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                      User ID
                    </p>

                    <p className="mt-1 break-all text-xs font-medium text-slate-600">
                      {user._id}
                    </p>

                  </div>

                  {/* Details */}
                  <div className="mt-3 grid grid-cols-2 gap-3">

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">

                      <div className="flex items-center gap-1.5">
                        <ShieldCheck
                          size={13}
                          className="text-blue-500"
                        />

                        <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                          Role
                        </p>
                      </div>

                      <p className="mt-1 text-sm font-bold text-[#0B1F3A]">
                        {user.isAdmin
                          ? "Administrator"
                          : "Customer"}
                      </p>

                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">

                      <div className="flex items-center gap-1.5">
                        <ShoppingCart
                          size={13}
                          className="text-blue-500"
                        />

                        <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                          Cart
                        </p>
                      </div>

                      <p className="mt-1 text-sm font-bold text-[#0B1F3A]">
                        {getCartCount(
                          user.cartData
                        )}{" "}
                        items
                      </p>

                    </div>

                    <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50 p-3">

                      <div className="flex items-center gap-1.5">
                        <ClipboardList
                          size={13}
                          className="text-blue-500"
                        />

                        <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                          Joined
                        </p>
                      </div>

                      <p className="mt-1 text-sm font-bold text-[#0B1F3A]">
                        {formatDate(
                          user.createdAt
                        )}
                      </p>

                    </div>

                  </div>

                  {/* Action */}
                  {user.isAdmin ? (

                    <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-sm font-bold text-violet-700">
                      <CheckCircle2 size={17} />
                      Admin account is protected
                    </div>

                  ) : (

                    <button
                      type="button"
                      onClick={() =>
                        deleteUser(user._id)
                      }
                      disabled={
                        deletingId === user._id
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={17} />

                      {deletingId === user._id
                        ? "Deleting User..."
                        : "Delete User"}
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </main>
  )
}

export default AdminUsers