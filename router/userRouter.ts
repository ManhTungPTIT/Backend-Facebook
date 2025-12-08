import express from "express";
import passport from "passport";
import * as auths from "../src/controller/Authen/auths";

const userRouter = express.Router();

// userRouter.get("/getUser", login.getUser);
userRouter.post("/register", await auths.register);
userRouter.post("/login", await auths.login);
userRouter.post("/logout", await auths.logout);

export default userRouter;
