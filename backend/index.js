import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {

  let token = req.header("Authorization");

  if (token != null) {

    token = token.replace("Bearer ", "");

    
    jwt.verify(token, "secretkey", (err, decoded) => {

      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        req.user = decoded;
        
      }

    });
  }
  
  
    next();

});

let monogoURl =
  "mongodb+srv://lahiru:123@cluster0.uw5jbdf.mongodb.net/product?appName=Cluster0";

mongoose.connect(monogoURl);

let connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use("/api/users", userRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// day 5 1h 16 min  continue to watch the video
