import express from "express";
// import { authenticateToken } from "../controller/Authen/auth";
import * as mess from "../controller/Mess/messController";

const messRoute = express.Router();

// messRoute.use(authenticateToken);

messRoute.post("/createRoom", mess.createRoom);
messRoute.get("/rooms", mess.getRooms);
messRoute.get("/messages", mess.getMessages);
messRoute.post("/rooms/:roomId/members", mess.addMember);

export default messRoute;
