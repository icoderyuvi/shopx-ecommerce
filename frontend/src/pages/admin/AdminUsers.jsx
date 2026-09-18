
import { useEffect, useMemo, useState } from "react"
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

              <p className="mt-4 text-sm text-gray-500">
                Loading users...
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
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
              !
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Unable to Load Users
            </h1>

            <p className="mt-3 text-sm text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchUsers()}
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
              Users
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage registered ShopX customers and administrators.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            className="rounded-xl border bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Users"}
          </button>

        </div>

        {/* Statistics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Users
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {users.length}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Customers
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {customerCount}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Administrators
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {adminCount}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Cart Items
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalCartItems}
            </p>
          </div>

        </div>

        {/* Search and Filter */}
        {users.length > 0 && (
          <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">

            <div className="grid gap-4 md:grid-cols-[1fr_220px]">

              <div>
                <label
                  htmlFor="user-search"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Search Users
                </label>

                <div className="relative">

                  <input
                    id="user-search"
                    type="text"
                    value={search}
                    onChange={e =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search name, email or user ID..."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-10 text-sm outline-none transition focus:border-black"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                    >
                      X
                    </button>
                  )}

                </div>
              </div>

              <div>
                <label
                  htmlFor="role-filter"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Role
                </label>

                <select
                  id="role-filter"
                  value={roleFilter}
                  onChange={e =>
                    setRoleFilter(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
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
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredUsers.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
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
                  className="text-sm font-semibold text-gray-700 underline hover:text-black"
                >
                  Clear Filters
                </button>

              </div>
            )}

          </div>
        )}

        {/* No Users */}
        {users.length === 0 && (
          <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
              U
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No Users Yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Registered customers will appear here.
            </p>

          </div>
        )}

        {/* No Search Results */}
        {users.length > 0 &&
          filteredUsers.length === 0 && (
            <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                ?
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900">
                No Matching Users
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or role filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("")
                  setRoleFilter("All")
                }}
                className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Clear Filters
              </button>

            </div>
          )}

        {/* Desktop Table */}
        {filteredUsers.length > 0 && (
          <div className="hidden overflow-hidden rounded-2xl border bg-white shadow-sm md:block">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] text-left">

                <thead className="border-b bg-gray-50">
                  <tr>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      User
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Email
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Cart
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Role
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Joined
                    </th>

                    <th className="px-5 py-4 text-right text-sm font-semibold text-gray-700">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.map(user => (
                    <tr
                      key={user._id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >

                      {/* User */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                              user.isAdmin
                                ? "bg-purple-600"
                                : "bg-black"
                            }`}
                          >
                            {getInitial(user.name)}
                          </div>

                          <div className="min-w-0">

                            <p className="font-semibold text-gray-900">
                              {user.name ||
                                "Unnamed User"}
                            </p>

                            <p className="mt-1 max-w-[220px] truncate text-xs text-gray-400">
                              {user._id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <p className="max-w-[250px] truncate text-sm text-gray-600">
                          {user.email ||
                            "No email"}
                        </p>
                      </td>

                      {/* Cart */}
                      <td className="px-5 py-4">

                        <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700">
                          {getCartCount(
                            user.cartData
                          )}{" "}
                          items
                        </span>

                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">

                        {user.isAdmin ? (
                          <span className="rounded-full bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-700">
                            Admin
                          </span>
                        ) : (
                          <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700">
                            Customer
                          </span>
                        )}

                      </td>

                      {/* Joined */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                        {formatDate(
                          user.createdAt
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">

                        {user.isAdmin ? (
                          <span className="text-xs font-medium text-gray-400">
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
                            className="rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
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

        {/* Mobile Cards */}
        {filteredUsers.length > 0 && (
          <div className="space-y-4 md:hidden">

            {filteredUsers.map(user => (
              <div
                key={user._id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >

                {/* User Header */}
                <div className="flex items-center gap-3">

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold text-white ${
                      user.isAdmin
                        ? "bg-purple-600"
                        : "bg-black"
                    }`}
                  >
                    {getInitial(user.name)}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="font-semibold text-gray-900">
                        {user.name ||
                          "Unnamed User"}
                      </h2>

                      {user.isAdmin && (
                        <span className="rounded-full bg-purple-100 px-2 py-1 text-[10px] font-semibold text-purple-700">
                          Admin
                        </span>
                      )}

                    </div>

                    <p className="mt-1 truncate text-sm text-gray-500">
                      {user.email ||
                        "No email"}
                    </p>

                  </div>

                </div>

                {/* User ID */}
                <div className="mt-5 rounded-xl bg-gray-50 p-3">

                  <p className="text-xs font-medium text-gray-500">
                    User ID
                  </p>

                  <p className="mt-1 break-all text-xs text-gray-600">
                    {user._id}
                  </p>

                </div>

                {/* User Details */}
                <div className="mt-3 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-gray-50 p-3">

                    <p className="text-xs text-gray-500">
                      Role
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {user.isAdmin
                        ? "Administrator"
                        : "Customer"}
                    </p>

                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">

                    <p className="text-xs text-gray-500">
                      Cart
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {getCartCount(
                        user.cartData
                      )}{" "}
                      items
                    </p>

                  </div>

                  <div className="col-span-2 rounded-xl bg-gray-50 p-3">

                    <p className="text-xs text-gray-500">
                      Joined
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatDate(
                        user.createdAt
                      )}
                    </p>

                  </div>

                </div>

                {/* Action */}
                {user.isAdmin ? (
                  <div className="mt-4 rounded-xl bg-purple-50 px-4 py-3 text-center text-sm font-medium text-purple-700">
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
                    className="mt-4 w-full rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === user._id
                      ? "Deleting User..."
                      : "Delete User"}
                  </button>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  )
}

export default AdminUsers

