import express from "express";

const app = express();
const PORT = 3000;

app.get("/api", (req, res) => {
  res.send("Backend jalan 🚀");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});