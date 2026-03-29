import express from "express";
import cors from "cors";
import helloRoutes from "./routes/hello.route";
import userRoutes from "./routes/user.route";
import { connectDB } from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 Connect DB
connectDB();

// Routes
app.use("/api", helloRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});