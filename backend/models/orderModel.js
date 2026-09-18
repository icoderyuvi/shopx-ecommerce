import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: {
      type: Array,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    address: {
      type: Object,
      required: true
    },

    status: {
      type: String,
      enum: [
        "Order Placed",
        "Packing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled"
      ],
      default: "Order Placed"
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      default: "COD"
    },

    payment: {
      type: Boolean,
      default: false
    },

    razorpayOrderId: {
      type: String,
      default: ""
    },

    razorpayPaymentId: {
      type: String,
      default: ""
    },

    razorpaySignature: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
)

const orderModel = mongoose.model("Order", orderSchema)

export default orderModel