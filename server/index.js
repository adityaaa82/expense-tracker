import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { dbConnect } from "./config/db.js";
import txnRoutes from "./routes/txnRoutes.js";

const app = express();
const port = 8500;

// Middlewares

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ quiet: true }));
dotenv.config({ quiet: true });

dbConnect();

// Routes

app.use("/txn", txnRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is listening on port : http://localhost:${port}`);
});
