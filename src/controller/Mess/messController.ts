import { Request, Response } from "express";
import * as messDAO from "../../DAO/messDAO";

// POST /mess/rooms
export async function createRoom(req: Request, res: Response) {
  const userId = Number(req.body.userId);
  const friendId = Number(req.body.friendId);
  const title = req.body.title;

  if (!userId || !title || !friendId) {
    console.log("Khong tim thay");
    return res.status(400).json({ error: "friendId and title are required" });
  }

  const { room, created } = await messDAO.findOrCreateDirectRoom(
    title,
    userId,
    friendId,
  );

  return res.status(created ? 201 : 200).json({ room });
}

// GET /mess/rooms
export async function getRooms(req: Request, res: Response) {
  const userId = Number(req.query.id);

  const rooms = await messDAO.getRoomsByUser(userId);
  return res.status(200).json({ rooms });
}

// GET /messages
//mac dinh da la ban be
export async function getMessages(req: Request, res: Response) {
  console.log("Get history message");
  const sendId = Number(req.query.senderId);
  const receiverId = Number(req.query.receiverId);
  const roomId = await messDAO.findDirectRoom(sendId, receiverId);

  const limit = Math.min(Number(req.query.limit) || 10, 10);
  // const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;

  // const allowed = await messDAO.isUserInRoom(userId, roomId);
  // if (!allowed) return res.status(403).json({ error: "Access denied" });
  console.log("Check limit: ", limit);

  const messages = await messDAO.getMessages(roomId, limit, 1);
  return res.status(200).json({ messages: messages.reverse() });
}

// POST /mess/rooms/:roomId/members
// Body: { userId: number }
export async function addMember(req: Request, res: Response) {
  const callerId = (req as any).user.id as number;
  const roomId = Number(req.params.roomId);
  const targetId = Number(req.body.userId);

  const allowed = await messDAO.isUserInRoom(callerId, roomId);
  if (!allowed) return res.status(403).json({ error: "Access denied" });

  // Target must be a friend of the caller
  const friends = await messDAO.areFriends(callerId, targetId);
  if (!friends) {
    return res
      .status(403)
      .json({ error: "You can only add friends to a room" });
  }

  const member = await messDAO.addMemberToRoom(roomId, targetId);
  return res.status(201).json({ member });
}
