import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import taskRouter from "./routes/taskRoutes.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  let token = req.header("Authorization");

  if (token != null) {
    token = token.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        req.user = decoded;
      }
    });
  }

  next();
});

mongoose.connect(process.env.MONGO_URL);

let connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
