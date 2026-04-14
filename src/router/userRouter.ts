import express from "express";
import * as auths from "../controller/Authen/auths";
import * as userController from "../controller/User/userController";

const userRouter = express.Router();

userRouter.post("/register", auths.register);
userRouter.post("/login", auths.login);
userRouter.post("/logout", auths.logout);
userRouter.post("/refreshToken", auths.refresh);
userRouter.get("/searchUser", userController.searchUser);
userRouter.post("/requestAddFriend", userController.requestAddFriend);
userRouter.get("/findAllFriendRequest", userController.findAllFriendRequest);
userRouter.post("/cancelFriendRequest", userController.cancelFriendRequest);
userRouter.post("/acceptFriendRequest", userController.acceptFriendRequest);
userRouter.get("/findAllFriendShip", userController.findAllFriendShip);

export default userRouter;
