import express from "express";
import passport from "passport";
import * as auths from "../controller/Authen/auths";

const userRouter = express.Router();

// userRouter.get("/getUser", login.getUser);
userRouter.post("/register", auths.register);
userRouter.post("/login", auths.login);
userRouter.post("/logout", auths.logout);
userRouter.post("/refreshToken", auths.refresh);

export default userRouter;
