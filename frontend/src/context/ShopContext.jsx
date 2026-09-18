import { createContext, useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL

export const ShopContext = createContext()

function ShopContextProvider({ children }) {
  // =========================
  // PRODUCTS
  // =========================

  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  // =========================
  // CART
  // =========================

  const [cartItems, setCartItems] = useState([])
  const [loadingCart, setLoadingCart] = useState(false)

  // =========================
  // SEARCH
  // =========================

  const [search, setSearch] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  // =========================
  // SHOP SETTINGS
  // =========================

  const currency = "₹"
  const delivery_fee = 10

  // =========================
  // LOGIN
  // =========================

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  )

  // =========================
  // GET PRODUCT ID
  // =========================

  const getProductId = product => {
    if (!product) {
      return null
    }

    return product._id || product.id || null
  }

  // =========================
  // LOAD PRODUCTS
  // =========================

  const loadProducts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/product`
      )

      const data = await response.json()

      if (
        data.success &&
        Array.isArray(data.products)
      ) {
        setProducts(data.products)
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error(
        "Failed to load products:",
        error
      )

      setProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }

  // =========================
  // SAVE CART
  // =========================

  const saveCart = async cart => {
    const token = localStorage.getItem("token")

    if (!token) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/cart/update`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            cartData: cart
          })
        }
      )

      const data = await response.json()

      if (!data.success) {
        console.error(
          "Cart save failed:",
          data.message
        )
      }
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      )
    }
  }

  // =========================
  // LOAD CART
  // =========================

  const loadCart = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      setCartItems([])
      setLoadingCart(false)
      return
    }

    setLoadingCart(true)

    try {
      const response = await fetch(
        `${API_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (
        data.success &&
        Array.isArray(data.cartData)
      ) {
        const validCart = data.cartData.filter(
          item =>
            item &&
            item.product &&
            getProductId(item.product) &&
            item.size &&
            Number(item.quantity) > 0
        )

        setCartItems(validCart)
      } else {
        setCartItems([])
      }
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      )

      setCartItems([])
    } finally {
      setLoadingCart(false)
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    loadCart()
  }, [isLoggedIn])

  // =========================
  // LOGIN
  // =========================

  const login = () => {
    setIsLoggedIn(true)
  }

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    setCartItems([])
    setIsLoggedIn(false)
  }

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = (productOrId, size) => {
    if (!productOrId || !size) {
      console.error(
        "Product or size missing"
      )

      return
    }

    let product = productOrId

    // If only an ID was passed,
    // find the product in products
    if (typeof productOrId !== "object") {
      product = products.find(
        item =>
          String(getProductId(item)) ===
          String(productOrId)
      )
    }

    if (!product) {
      console.error(
        "Product not found:",
        productOrId
      )

      return
    }

    const productId = getProductId(product)

    if (!productId) {
      console.error(
        "Product has no ID:",
        product
      )

      return
    }

    setCartItems(prev => {
      const safeCart = Array.isArray(prev)
        ? prev.filter(
            item =>
              item &&
              item.product &&
              getProductId(item.product)
          )
        : []

      const existingItem = safeCart.find(
        item =>
          String(
            getProductId(item.product)
          ) === String(productId) &&
          item.size === size
      )

      let updatedCart

      // Product already exists
      if (existingItem) {
        updatedCart = safeCart.map(item =>
          String(
            getProductId(item.product)
          ) === String(productId) &&
          item.size === size
            ? {
                ...item,
                quantity:
                  Number(item.quantity) + 1
              }
            : item
        )
      }

      // New product
      else {
        updatedCart = [
          ...safeCart,
          {
            product,
            size,
            quantity: 1
          }
        ]
      }

      saveCart(updatedCart)

      return updatedCart
    })
  }

  // =========================
  // REMOVE FROM CART
  // =========================

  const removeFromCart = (
    productId,
    size
  ) => {
    setCartItems(prev => {
      const safeCart = Array.isArray(prev)
        ? prev
        : []

      const updatedCart = safeCart.filter(
        item => {
          if (
            !item ||
            !item.product
          ) {
            return false
          }

          return !(
            String(
              getProductId(item.product)
            ) === String(productId) &&
            item.size === size
          )
        }
      )

      saveCart(updatedCart)

      return updatedCart
    })
  }

  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = (
    productId,
    size,
    quantity
  ) => {
    const newQuantity = Number(quantity)

    if (newQuantity <= 0) {
      removeFromCart(
        productId,
        size
      )

      return
    }

    setCartItems(prev => {
      const safeCart = Array.isArray(prev)
        ? prev
        : []

      const updatedCart = safeCart.map(item => {
        if (
          item &&
          item.product &&
          String(
            getProductId(item.product)
          ) === String(productId) &&
          item.size === size
        ) {
          return {
            ...item,
            quantity: newQuantity
          }
        }

        return item
      })

      saveCart(updatedCart)

      return updatedCart
    })
  }

  // =========================
  // CART COUNT
  // =========================

  const getCartCount = () => {
    if (!Array.isArray(cartItems)) {
      return 0
    }

    return cartItems.reduce(
      (total, item) => {
        if (
          !item ||
          !item.product ||
          !item.quantity
        ) {
          return total
        }

        return (
          total +
          Number(item.quantity)
        )
      },
      0
    )
  }

  // =========================
  // CART AMOUNT
  // =========================

  const getCartAmount = () => {
    if (!Array.isArray(cartItems)) {
      return 0
    }

    return cartItems.reduce(
      (total, item) => {
        if (
          !item ||
          !item.product ||
          typeof item.product.price !==
            "number"
        ) {
          return total
        }

        return (
          total +
          item.product.price *
            Number(item.quantity)
        )
      },
      0
    )
  }

  // =========================
  // CONTEXT VALUE
  // =========================

  const value = {
    products,
    loadingProducts,
    loadProducts,

    search,
    setSearch,
    showSearch,
    setShowSearch,

    currency,
    delivery_fee,

    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    loadingCart,
    loadCart,

    isLoggedIn,
    login,
    logout
  }

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider