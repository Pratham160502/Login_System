import express from "express";
import connectDB from './config/connectdb.js';
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/users", userRoutes);
connectDB(DATABASE_URL)
app.get("/", (req, res) => {
  res.send("🚀 Hello from modern Express + Nodemon!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
