import express from "express";
import { registerUser } from "../controller/userConroller.js";
import { loginUser } from "../controller/userConroller.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;