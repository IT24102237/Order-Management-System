import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    product: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

orderSchema.pre("save", function saveTotalAmount(next) {
  this.totalAmount = this.quantity * this.price;
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
