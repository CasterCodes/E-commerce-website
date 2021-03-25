import asyncHandler from "express-async-handler";
import OrderModel from "../models/Order.js";

export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const newOrder = new OrderModel({
      shippingAddress,
      user: req.user._id,
      paymentMethod,
      itemsPrice,
      orderItems,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const order = await newOrder.save();

    res.status(201).json({
      status: "success",
      order,
    });
  }
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  } else {
    res.status(200).json({
      status: "success",
      order,
    });
  }
});

export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  } else {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      status: success,
      order: updatedOrder,
    });
  }
});

export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  } else {
    order.isDelivered = true;
    order.DeliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json({
      status: "success",
      order: updatedOrder,
    });
  }
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({ user: req.user._id });

  if (!orders) {
    res.status(404);
    throw new Error("You have not placed any order");
  } else {
    res.status(200).json({
      status: "success",
      orders,
    });
  }
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({}).populate("user", "name email");
  res.status(200).json({
    status: "success",
    orders,
  });
});
