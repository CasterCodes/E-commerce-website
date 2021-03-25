import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserModel from "../models/User.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bear")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized no token");
  }
  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRECT);

    const user = await UserModel.findById(decodedToken.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("You are not recoginized by the system ! Invalid token");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Not authorized ! Invalid Token");
  }
});
export default protect;

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as admin");
  }
};
