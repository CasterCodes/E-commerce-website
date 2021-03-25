import UserModel from "../models/User.js";

import asyncHandler from "express-async-handler";

import jwt from "jsonwebtoken";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email: email });

  if (!user || !(await user.correctPassword(password))) {
    res.status(401);
    throw new Error("Incorrect password or email");
  } else {
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRECT, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: "success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        image: user.image,
        token: token,
      },
    });
  }
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("The passwords do not match");
  }

  const userExits = await UserModel.findOne({ email });

  if (userExits) {
    res.status(400);
    throw new Error("Email already exists");
  }
  const newUser = {
    name,
    email,
    password,
  };

  const user = await UserModel.create(newUser);

  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRECT, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  if (user) {
    res.status(201).json({
      status: "success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        image: user.image,
        token: token,
      },
    });
  }
});
