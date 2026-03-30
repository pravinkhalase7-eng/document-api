import express from "express";
import cors from "cors";
import helloRoutes from "./routes/hello.route";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.routes";
import fileRoutes from "./routes/file.route";
import documentRoutes from "./routes/document.route";
import { serverAdapter } from "./utils/bullBoard";


import dotenv from "dotenv";

import { connectDB } from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();


// 🔥 Connect DB
connectDB();

// Routes
app.use("/api", helloRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/documents", documentRoutes);
app.use("/admin/queues", serverAdapter.getRouter());
// Health check
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});