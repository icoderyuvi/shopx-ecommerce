import { createContext, useEffect, useState } from "react"

export const ShopContext = createContext()

const API_URL = import.meta.env.VITE_API_URL

function ShopContextProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  const [cartItems, setCartItems] = useState([])
  const [loadingCart, setLoadingCart] = useState(false)

  const [search, setSearch] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  const [currency] = useState("₹")
  const [delivery_fee] = useState(10)

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  )

  // --------------------------------------------------
  // Get Product ID
  // --------------------------------------------------
  const getProductId = (product) => {
    if (!product) return null

    return product._id || product.id || null
  }

  // --------------------------------------------------
  // Check whether product has sizes
  // --------------------------------------------------
  const productHasSizes = (product) => {
    return (
      Array.isArray(product?.sizes) &&
      product.sizes.length > 0
    )
  }

  // --------------------------------------------------
  // Load Products
  // --------------------------------------------------
  const loadProducts = async () => {
    try {
      setLoadingProducts(true)

      const response = await fetch(`${API_URL}/api/product`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.products || [])
      } else {
        console.error("Failed to load products")
        setProducts([])
      }
    } catch (error) {
      console.error("Error loading products:", error)
      setProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }

  // --------------------------------------------------
  // Save Cart To Backend
  // --------------------------------------------------
  const saveCart = async (cart) => {
    const token = localStorage.getItem("token")

    if (!token) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/cart/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cartData: cart,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        console.error("Failed to save cart:", data.message)
      }
    } catch (error) {
      console.error("Error saving cart:", error)
    }
  }

  // --------------------------------------------------
  // Load Cart From Backend
  // --------------------------------------------------
  const loadCart = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      setCartItems([])
      return
    }

    try {
      setLoadingCart(true)

      const response = await fetch(`${API_URL}/api/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        const backendCart = Array.isArray(data.cartData)
          ? data.cartData
          : []

        // Do not require a size here.
        // Products without sizes are stored as "One Size".
        const validCart = backendCart.filter((item) => {
          const productId = getProductId(item?.product)

          return (
            item &&
            productId &&
            Number(item.quantity) > 0
          )
        })

        setCartItems(validCart)
      } else {
        setCartItems([])
      }
    } catch (error) {
      console.error("Error loading cart:", error)
      setCartItems([])
    } finally {
      setLoadingCart(false)
    }
  }

  // --------------------------------------------------
  // Initial Product Load
  // --------------------------------------------------
  useEffect(() => {
    loadProducts()
  }, [])

  // --------------------------------------------------
  // Load Cart When Login State Changes
  // --------------------------------------------------
  useEffect(() => {
    loadCart()
  }, [isLoggedIn])

  // --------------------------------------------------
  // Login
  // --------------------------------------------------
  const login = () => {
    setIsLoggedIn(true)
  }

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------
  const logout = () => {
    localStorage.removeItem("token")

    setIsLoggedIn(false)
    setCartItems([])
  }

  // --------------------------------------------------
  // Add Product To Cart
  // --------------------------------------------------
  const addToCart = async (productOrId, size) => {
    let product = null

    // If complete product object was passed
    if (typeof productOrId === "object") {
      product = productOrId
    } else {
      // If only product ID was passed
      product = products.find(
        (item) => getProductId(item) === productOrId
      )
    }

    if (!product) {
      console.error("Product not found")
      return
    }

    const productId = getProductId(product)

    if (!productId) {
      console.error("Product ID missing")
      return
    }

    // ------------------------------------------------
    // Check if this product has sizes
    // ------------------------------------------------
    const hasSizes = productHasSizes(product)

    // Products WITH sizes must have a size
    if (hasSizes && !size) {
      console.error("Please select a size")
      return
    }

    // Products WITHOUT sizes use "One Size"
    const selectedSize = hasSizes
      ? size
      : "One Size"

    // ------------------------------------------------
    // Check existing cart item
    // ------------------------------------------------
    const existingItemIndex = cartItems.findIndex(
      (item) =>
        getProductId(item.product) === productId &&
        item.size === selectedSize
    )

    let updatedCart

    if (existingItemIndex !== -1) {
      // Product already exists -> increase quantity
      updatedCart = [...cartItems]

      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity:
          Number(updatedCart[existingItemIndex].quantity || 0) + 1,
      }
    } else {
      // New product
      const newItem = {
        product: product,
        size: selectedSize,
        quantity: 1,
      }

      updatedCart = [...cartItems, newItem]
    }

    setCartItems(updatedCart)

    // Save to backend
    await saveCart(updatedCart)
  }

  // --------------------------------------------------
  // Remove Product From Cart
  // --------------------------------------------------
  const removeFromCart = async (productId, size) => {
    const updatedCart = cartItems.filter(
      (item) =>
        !(
          getProductId(item.product) === productId &&
          item.size === size
        )
    )

    setCartItems(updatedCart)

    await saveCart(updatedCart)
  }

  // --------------------------------------------------
  // Update Quantity
  // --------------------------------------------------
  const updateQuantity = async (
    productId,
    size,
    quantity
  ) => {
    const newQuantity = Number(quantity)

    let updatedCart

    if (newQuantity <= 0) {
      updatedCart = cartItems.filter(
        (item) =>
          !(
            getProductId(item.product) === productId &&
            item.size === size
          )
      )
    } else {
      updatedCart = cartItems.map((item) => {
        if (
          getProductId(item.product) === productId &&
          item.size === size
        ) {
          return {
            ...item,
            quantity: newQuantity,
          }
        }

        return item
      })
    }

    setCartItems(updatedCart)

    await saveCart(updatedCart)
  }

  // --------------------------------------------------
  // Get Cart Count
  // --------------------------------------------------
  const getCartCount = () => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    )
  }

  // --------------------------------------------------
  // Get Cart Amount
  // --------------------------------------------------
  const getCartAmount = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.product?.price || 0)
      const quantity = Number(item.quantity || 0)

      return total + price * quantity
    }, 0)
  }

  // --------------------------------------------------
  // Context Value
  // --------------------------------------------------
  const value = {
    products,
    loadingProducts,

    cartItems,
    loadingCart,

    search,
    setSearch,

    showSearch,
    setShowSearch,

    currency,
    delivery_fee,

    isLoggedIn,

    login,
    logout,

    addToCart,
    removeFromCart,
    updateQuantity,

    getCartCount,
    getCartAmount,

    loadProducts,
    loadCart,
  }

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider