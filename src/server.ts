import express from "express";
import cors from "cors";
import helloRoutes from "./routes/hello.route";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", helloRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});