
import "dotenv/config"
import mongoose from "mongoose"
import dns from "dns"

import connectDB from "./config/mongodb.js"
import productModel from "./models/productModel.js"

dns.setServers(["8.8.8.8", "1.1.1.1"])

const products = [
  {
    name: "Wireless Headphones",
    price: 1999,
    category: "Electronics",
    subCategory: "Audio",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    description:
      "High-quality wireless headphones with clear sound, deep bass and comfortable ear cushions.",
    sizes: ["Standard"],
    bestseller: true
  },
  {
    name: "Smart Watch",
    price: 3499,
    category: "Electronics",
    subCategory: "Wearables",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    description:
      "Modern smartwatch with fitness tracking, notifications and a stylish design.",
    sizes: ["Standard"],
    bestseller: true
  },
  {
    name: "Running Shoes",
    price: 2499,
    category: "Shoes",
    subCategory: "Sports",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    description:
      "Lightweight running shoes designed for everyday comfort and performance.",
    sizes: ["7", "8", "9", "10"],
    bestseller: true
  },
  {
    name: "Casual T-Shirt",
    price: 899,
    category: "Fashion",
    subCategory: "Clothing",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    description:
      "Comfortable cotton casual T-shirt suitable for everyday wear.",
    sizes: ["S", "M", "L", "XL"],
    bestseller: false
  },
  {
    name: "Leather Backpack",
    price: 1799,
    category: "Accessories",
    subCategory: "Bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    description:
      "Durable backpack with multiple compartments for work, college and travel.",
    sizes: ["Standard"],
    bestseller: true
  },
  {
    name: "Sunglasses",
    price: 1299,
    category: "Accessories",
    subCategory: "Eyewear",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    description:
      "Stylish sunglasses with a modern frame for everyday use.",
    sizes: ["Standard"],
    bestseller: false
  }
]

const seedProducts = async () => {
  try {
    await connectDB()

    await productModel.deleteMany({})

    const insertedProducts = await productModel.insertMany(products)

    console.log(
      `${insertedProducts.length} products inserted successfully`
    )

    insertedProducts.forEach((product) => {
      console.log(`${product.name} → ${product._id}`)
    })

    await mongoose.connection.close()

    process.exit(0)
  } catch (error) {
    console.error("Seed products error:", error)

    await mongoose.connection.close()

    process.exit(1)
  }
}

seedProducts()

