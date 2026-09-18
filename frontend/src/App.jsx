
import { Routes, Route, useLocation } from "react-router-dom"

import Navbar from "./components/Navbar"
import AdminLayout from "./components/AdminLayout"
import AdminRoute from "./components/AdminRoute"

import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductDetails from "./pages/ProductDetails"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import Orders from "./pages/Orders"
import NotFound from "./pages/NotFound"

import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProducts from "./pages/admin/AdminProducts"
import AddProduct from "./pages/admin/AddProduct"
import EditProduct from "./pages/admin/EditProduct"
import AdminOrders from "./pages/admin/AdminOrders"
import AdminUsers from "./pages/admin/AdminUsers"

const App = () => {
  const location = useLocation()

  const isAdminPage = location.pathname.startsWith("/admin")

  return (
    <>
      {/* Customer Navbar */}
      {!isAdminPage && <Navbar />}

      {/* Routes */}
      <Routes>

        {/* ========================= */}
        {/* Customer Routes */}
        {/* ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* ========================= */}
        {/* Protected Admin Routes */}
        {/* ========================= */}

        <Route element={<AdminRoute />}>

          <Route element={<AdminLayout />}>

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/products"
              element={<AdminProducts />}
            />

            <Route
              path="/admin/products/add"
              element={<AddProduct />}
            />

            <Route
              path="/admin/products/edit/:id"
              element={<EditProduct />}
            />

            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />

            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />

          </Route>

        </Route>

        {/* ========================= */}
        {/* 404 */}
        {/* ========================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </>
  )
}

export default App

