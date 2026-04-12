import express from "express";
import authRoutes from "./routes/auth";

const app = express();

app.use(express.json());

// 🔥 INI YANG NYAMBUNGIN
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});