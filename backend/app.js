import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import DataRoutes from "./src/routes/DataRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 8080;

const connetDB = await mongoose.connect(process.env.MONGO_DB);

app.use(cors());
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/data", DataRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log("App is listening on ", port);
});
