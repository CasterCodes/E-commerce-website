import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, require: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
  },
  { timestamps: true }
);

const productsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    name: {
      type: String,
      required: [true, "Productt name is required"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
    },
    brand: {
      type: String,
      required: [true, "Product brand is required"],
    },
    rating: {
      type: Number,
      required: [true, "Product image is required"],
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewsSchema],
    countInStock: {
      type: Number,
      required: [true, "Count  in stock is required"],
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productsSchema);

export default productModel;
