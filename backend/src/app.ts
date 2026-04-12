import express from "express";
import auth from "./routes/auth";

const app = express();
app.use(express.json());

app.use("/api", auth);

app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});
