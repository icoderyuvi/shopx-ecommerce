import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    subCategory: {
      type: String,
      required: true
    },

    sizes: {
      type: Array,
      default: []
    },

    bestseller: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const productModel = mongoose.model(
  "Product",
  productSchema
)

export default productModel