import express from "express";
import dotenv from "dotenv";
import path from "path";

import connection from "./config/connection.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import reviewRoutes from "./routes/reviewsRoutes.js";
import { notFound, globalErrorHandler } from "./middlewares/error.js";
const app = express();
dotenv.config();
connection();

const __dirname = path.resolve();

// Middlewares
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
}

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

app.all("*", notFound);

app.use(globalErrorHandler);

const PORT = 5000 || process.env.PORT;

const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => console.log(`Server running on port ${PORT}`));
