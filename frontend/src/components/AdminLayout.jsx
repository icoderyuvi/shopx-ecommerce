import { useState } from "react"
import {
  Link,
  NavLink,
  Outlet,
  useNavigate
} from "react-router-dom"

import {
  BarChart3,
  Boxes,
  ChevronRight,
  CirclePlus,
  LogOut,
  Menu,
  ShoppingBag,
  Store,
  Users,
  X
} from "lucide-react"

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
      icon: BarChart3
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Boxes
    },
    {
      name: "Add Product",
      path: "/admin/products/add",
      icon: CirclePlus
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users
    }
  ]

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white">

      {/* =========================
          LOGO
      ========================= */}

      <div className="flex h-20 shrink-0 items-center border-b border-slate-100 px-5">

        <Link
          to="/admin"
          onClick={() => setMobileMenu(false)}
          className="group flex items-center gap-3"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1F3A] text-white shadow-sm transition group-hover:bg-blue-600">
            <ShoppingBag size={20} />
          </div>

          <div>
            <p className="text-xl font-extrabold tracking-tight text-[#0B1F3A]">
              Shop<span className="text-blue-600">X</span>
            </p>

            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Admin Panel
            </p>
          </div>

        </Link>

      </div>

      {/* =========================
          NAVIGATION
      ========================= */}

      <nav className="flex-1 overflow-y-auto p-4">

        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Management
        </p>

        <div className="space-y-1.5">

          {navItems.map((item) => {

            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => setMobileMenu(false)}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#0B1F3A] text-white shadow-lg shadow-[#0B1F3A]/10"
                      : "text-slate-600 hover:bg-blue-50 hover:text-[#0B1F3A]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">

                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                          isActive
                            ? "bg-white/10 text-blue-300"
                            : "bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-blue-600"
                        }`}
                      >
                        <Icon size={18} />
                      </span>

                      <span>{item.name}</span>

                    </div>

                    <ChevronRight
                      size={15}
                      className={`transition-transform duration-200 ${
                        isActive
                          ? "text-blue-300"
                          : "text-transparent group-hover:translate-x-0.5 group-hover:text-blue-400"
                      }`}
                    />

                  </>
                )}
              </NavLink>
            )
          })}

        </div>

      </nav>

      {/* =========================
          BOTTOM ACTIONS
      ========================= */}

      <div className="shrink-0 border-t border-slate-100 p-4">

        {/* Back to Shop */}

        <Link
          to="/"
          onClick={() => setMobileMenu(false)}
          className="group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-[#0B1F3A]"
        >

          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition group-hover:bg-white group-hover:text-blue-600">
            <Store size={18} />
          </span>

          <span>Back to Shop</span>

        </Link>

        {/* Logout */}

        <button
          onClick={logout}
          className="group mt-1.5 flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
        >

          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition group-hover:bg-red-100">
            <LogOut size={18} />
          </span>

          <span>Logout</span>

        </button>

      </div>

    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =========================
          DESKTOP SIDEBAR
      ========================= */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* =========================
          MOBILE HEADER
      ========================= */}

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">

        <Link
          to="/admin"
          className="flex items-center gap-2.5"
        >

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B1F3A] text-white">
            <ShoppingBag size={18} />
          </div>

          <div>
            <p className="text-lg font-extrabold leading-none tracking-tight text-[#0B1F3A]">
              Shop<span className="text-blue-600">X</span>
            </p>

            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Admin
            </p>
          </div>

        </Link>

        <button
          onClick={() => setMobileMenu(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0B1F3A] transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          aria-label="Open admin menu"
          type="button"
        >
          <Menu size={21} />
        </button>

      </header>

      {/* =========================
          MOBILE SIDEBAR
      ========================= */}

      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* Overlay */}

          <button
            onClick={() => setMobileMenu(false)}
            className="absolute inset-0 bg-[#0B1F3A]/50 backdrop-blur-[2px]"
            aria-label="Close admin menu"
            type="button"
          />

          {/* Drawer */}

          <aside className="relative h-full w-[min(20rem,88vw)] bg-white shadow-2xl">

            {/* Close Button */}

            <button
              onClick={() => setMobileMenu(false)}
              className="absolute right-4 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              aria-label="Close admin menu"
              type="button"
            >
              <X size={18} />
            </button>

            <SidebarContent />

          </aside>

        </div>
      )}

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="lg:ml-64">

        <main className="min-h-screen">

          <Outlet />

        </main>

      </div>

    </div>
  )
}

export default AdminLayout