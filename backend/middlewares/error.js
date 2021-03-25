export const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  res.status(404);
  next(error);
};

export const globalErrorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    status: "fail",
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
};
