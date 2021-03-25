import asyncHandler from "express-async-handler";
import ProductModel from "../models/Product.js";

export const getProducts = asyncHandler(async (req, res) => {
  const perPage = 14;

  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await ProductModel.countDocuments({ ...keyword });

  const products = await ProductModel.find({ ...keyword })
    .limit(perPage)
    .skip(perPage * (page - 1));

  res.status(200).json({
    status: "success",
    products,
    page,
    pages: Math.ceil(count / perPage),
  });
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product with that id was not found");
  }
  res.status(200).json({
    status: "success",
    product,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await ProductModel.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("No product with that id");
  } else {
    res.status(200).json({
      status: "sucesss",
      product,
    });
  }
});

export const createProduct = asyncHandler(async (req, res) => {
  const newProduct = new ProductModel({
    name: "Sample Product",
    price: 2345,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample Brabd",
    category: "Category",
    countInStock: 23,
    numReviews: 0,
    description: "Description ",
  });

  const product = await newProduct.save();

  res.status(201).json({
    status: "success",
    product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    numReviews,
    description,
  } = req.body;

  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  } else {
    product.name = name;
    product.price = price;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.description = description;
    const updatedProduct = await product.save();

    res.status(201).json({
      status: "success",
      product: updatedProduct,
    });
  }
});

export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  } else {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You have already reviewed this product");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((accum, item) => item.rating + accum, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      status: "success",
    });
  }
});

export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await ProductModel.find({}).sort({ rating: -1 }).limit(4);
  res.status(200).json({
    status: "success",
    products,
  });
});
