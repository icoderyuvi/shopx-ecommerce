import productModel from "../models/productModel.js"

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      subCategory,
      sizes,
      bestseller
    } = req.body

    if (
      !name ||
      !description ||
      !price ||
      !image ||
      !category ||
      !subCategory
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are needed"
      })
    }

    const product = await productModel.create({
      name,
      description,
      price,
      image,
      category,
      subCategory,
      sizes: Array.isArray(sizes) ? sizes : [],
      bestseller: Boolean(bestseller)
    })

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    })
  } catch (error) {
    console.error("Add product error:", error)

    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}

export const getProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      products
    })
  } catch (error) {
    console.error("Get products error:", error)

    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params

    const product = await productModel.findById(id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    res.json({
      success: true,
      product
    })
  } catch (error) {
    console.error("Get product error:", error)

    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params

    const {
      name,
      description,
      price,
      image,
      category,
      subCategory,
      sizes,
      bestseller
    } = req.body

    if (
      !name ||
      !description ||
      !price ||
      !image ||
      !category ||
      !subCategory
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are needed"
      })
    }

    const product = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price: Number(price),
        image,
        category,
        subCategory,
        sizes: Array.isArray(sizes) ? sizes : [],
        bestseller: Boolean(bestseller)
      },
      {
        new: true,
        runValidators: true
      }
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product
    })
  } catch (error) {
    console.error("Update product error:", error)

    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    const product = await productModel.findByIdAndDelete(id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    res.json({
      success: true,
      message: "Product deleted successfully"
    })
  } catch (error) {
    console.error("Delete product error:", error)

    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}