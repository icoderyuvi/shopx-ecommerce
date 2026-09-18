import "dotenv/config"
import Razorpay from "razorpay"
import crypto from "crypto"
import productModel from "../models/productModel.js"
import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

const DELIVERY_FEE = 10


// ======================================
// CREATE RAZORPAY ORDER
// ======================================
export const createRazorpayOrder = async (req, res) => {
  try {
    const {
      items,
      address
    } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      })
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required"
      })
    }


    // Get product IDs
    const productIds = items.map(
      item => item.productId
    )


    // Get real products from MongoDB
    const products = await productModel.find({
      _id: {
        $in: productIds
      }
    })


    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products no longer exist"
      })
    }


    let subtotal = 0

    const verifiedItems = items.map(item => {
      const product = products.find(
        product =>
          product._id.toString() ===
          item.productId.toString()
      )

      if (!product) {
        throw new Error("Product not found")
      }


      const quantity = Number(item.quantity)

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        throw new Error(
          "Invalid product quantity"
        )
      }


      if (
        product.sizes?.length > 0 &&
        !product.sizes.includes(item.size)
      ) {
        throw new Error(
          `Invalid size for ${product.name}`
        )
      }


      subtotal +=
        product.price * quantity


      return {
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        size: item.size,
        quantity
      }
    })


    const amount =
      subtotal + DELIVERY_FEE


    // Razorpay expects amount
    // in smallest currency unit.
    // For INR: ₹100 = 10000 paise.
    const razorpayOrder =
      await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: `shopx_${Date.now()}`,
        notes: {
          userId: req.userId.toString()
        }
      })


    res.json({
      success: true,
      razorpayOrder,
      amount,
      currency: "INR",
      items: verifiedItems
    })

  } catch (error) {
    console.error(
      "Create Razorpay order error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create payment order"
    })
  }
}


// ======================================
// VERIFY RAZORPAY PAYMENT
// ======================================
export const verifyRazorpayPayment = async (
  req,
  res
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      address
    } = req.body


    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are missing"
      })
    }


    // Create expected signature
    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex")


    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      })
    }


    // Prevent duplicate processing
    const existingOrder =
      await orderModel.findOne({
        razorpayOrderId:
          razorpay_order_id
      })


    if (existingOrder) {
      return res.json({
        success: true,
        message: "Payment already verified",
        order: existingOrder
      })
    }


    // Recalculate products again
    const productIds = items.map(
      item => item.productId
    )

    const products =
      await productModel.find({
        _id: {
          $in: productIds
        }
      })


    if (
      products.length !==
      productIds.length
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more products no longer exist"
      })
    }


    let subtotal = 0

    const verifiedItems =
      items.map(item => {
        const product =
          products.find(
            product =>
              product._id.toString() ===
              item.productId.toString()
          )

        if (!product) {
          throw new Error(
            "Product not found"
          )
        }


        const quantity =
          Number(item.quantity)


        if (
          !Number.isInteger(quantity) ||
          quantity < 1
        ) {
          throw new Error(
            "Invalid quantity"
          )
        }


        subtotal +=
          product.price * quantity


        return {
          productId: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          size: item.size,
          quantity
        }
      })


    const amount =
      subtotal + DELIVERY_FEE


    // Create ShopX order
    const order =
      await orderModel.create({
        userId: req.userId,
        items: verifiedItems,
        amount,
        address,
        paymentMethod: "RAZORPAY",
        payment: true,
        razorpayOrderId:
          razorpay_order_id,
        razorpayPaymentId:
          razorpay_payment_id,
        razorpaySignature:
          razorpay_signature
      })


    // Clear cart only AFTER
    // successful payment verification
    await userModel.findByIdAndUpdate(
      req.userId,
      {
        cartData: []
      }
    )


    res.status(201).json({
      success: true,
      message:
        "Payment verified and order placed",
      order
    })

  } catch (error) {
    console.error(
      "Verify Razorpay payment error:",
      error
    )

    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    })
  }
}