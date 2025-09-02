import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

// Enable CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development" ? "http://localhost:5173" : "*",
    credentials: true,
  })
);

// Parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// ------------------- API ROUTES -------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// ------------------- FRONTEND ROUTES -------------------
if (process.env.NODE_ENV === "production") {
  // Serve static frontend files
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Handle React routing, return index.html for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
} else {
  // Development root route
  app.get("/", (req, res) => {
    res.send("Hello from backend 👋");
  });
}

// ------------------- START SERVER -------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
