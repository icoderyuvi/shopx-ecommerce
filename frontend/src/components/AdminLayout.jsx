
import { useState } from "react"
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"

function AdminLayout() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    navigate("/login")
  }

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "📊"
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: "📦"
    },
    {
      name: "Add Product",
      path: "/admin/products/add",
      icon: "➕"
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: "🛒"
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "👥"
    }
  ]

  const SidebarContent = () => (
    <div className="flex h-full flex-col">

      {/* Logo */}
      <div className="flex h-20 items-center border-b px-6">
        <Link
          to="/admin"
          onClick={() => setMobileMenu(false)}
          className="text-2xl font-bold tracking-tight"
        >
          Shop<span className="text-gray-500">X</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">

        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Management
        </p>

        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            onClick={() => setMobileMenu(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`
            }
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span>{item.name}</span>
          </NavLink>
        ))}

      </nav>

      {/* Bottom Links */}
      <div className="border-t p-4">

        <Link
          to="/"
          onClick={() => setMobileMenu(false)}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-black"
        >
          <span className="text-lg">🏪</span>
          <span>Back to Shop</span>
        </Link>

        <button
          onClick={logout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </button>

      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden">

        <Link
          to="/admin"
          className="text-xl font-bold"
        >
          Shop<span className="text-gray-500">X</span>
        </Link>

        <button
          onClick={() => setMobileMenu(true)}
          className="rounded-lg border px-3 py-2 text-xl"
          aria-label="Open admin menu"
        >
          ☰
        </button>

      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* Overlay */}
          <button
            onClick={() => setMobileMenu(false)}
            className="absolute inset-0 bg-black/40"
            aria-label="Close admin menu"
          />

          {/* Sidebar */}
          <aside className="relative h-full w-72 bg-white shadow-xl">

            <button
              onClick={() => setMobileMenu(false)}
              className="absolute right-4 top-5 z-10 rounded-lg px-3 py-2 text-xl hover:bg-gray-100"
              aria-label="Close admin menu"
            >
              ✕
            </button>

            <SidebarContent />

          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64">

        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default AdminLayout

