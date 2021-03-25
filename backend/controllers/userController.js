import UserModel from "../models/User.js";

import asyncHandler from "express-async-handler";

import jwt from "jsonwebtoken";

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found! Not logged in");
  } else {
    res.status(200).json({
      status: "success",
      user,
    });
  }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  } else {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    const token = await jwt.sign(
      { id: updatedUser._id },
      process.env.JWT_SECRECT,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({
      status: "success",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        image: updatedUser.image,
        token: token,
      },
    });
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find({});
  res.status(200).json({
    status: "success",
    users,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("Not user with that id");
  } else {
    res.status(200).json({
      status: "success",
    });
  }
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("No user with that id");
  } else {
    res.status(200).json({
      status: "success",
      user,
    });
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  } else {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        image: updatedUser.image,
      },
    });
  }
});
