import WebSocket, { RawData } from "ws";
import http, { IncomingMessage } from "http";
import { verifyAccessToken } from "../../controller/Authen/tokens";
import * as messDAO from "../../DAO/messDAO";

// userId -> WebSocket
const clients = new Map<number, WebSocket>();

type WSMessage =
  | {
      type: "SEND_MESSAGE";
      senderId: number;
      receiverId: number;
      content: string;
    }
  | { type: "JOIN_ROOM"; senderId: number; receiverId: number }
  | { type: "PING" };

function send(ws: WebSocket, payload: object) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

async function broadcastToRoom(
  roomId: number,
  payload: object,
  excludeUserId?: number,
) {
  const memberIds = await messDAO.getRoomMemberIds(roomId);
  for (const uid of memberIds) {
    if (uid === excludeUserId) continue;
    const ws = clients.get(uid);
    if (ws) send(ws, payload);
  }
}

export function createServer(server: http.Server): WebSocket.Server {
  const wss = new WebSocket.Server({ server });

  wss.on(
    "connection",
    (ws: WebSocket & { userId?: number }, req: IncomingMessage) => {
      // Authenticate via ?token= query param
      const params = new URLSearchParams(req.url?.replace(/^\/?/, "") ?? "");
      const token = String(params.get("token"));
      console.log("Token", token);
      let userId: number;
      try {
        console.log("gooo");
        const payload = verifyAccessToken(token!);
        userId = payload.id;
        ws.userId = userId;
        console.log("verify", payload, userId);
      } catch {
        ws.close(1008, "Unauthorized");
        return;
      }

      clients.set(userId, ws);
      console.log(`WS user connected: ${userId} (total: ${clients.size})`);

      send(ws, { type: "CONNECTED", userId });

      ws.on("message", async (raw: RawData) => {
        let msg: WSMessage;
        try {
          msg = JSON.parse(raw.toString());
          console.log("Message", msg);
        } catch {
          send(ws, { type: "ERROR", message: "Invalid JSON" });
          return;
        }

        switch (msg.type) {
          case "PING":
            send(ws, { type: "PONG" });
            break;

          case "JOIN_ROOM": {
            const { senderId, receiverId } = msg;
            const roomId = await messDAO.findDirectRoom(senderId, receiverId);

            const allowed = await messDAO.isUserInRoom(userId, roomId);
            if (!allowed) {
              send(ws, { type: "ERROR", message: "Not a member of this room" });
              return;
            }
            const history = await messDAO.getMessages(roomId, 50);
            send(ws, {
              type: "ROOM_HISTORY",
              roomId,
              messages: history.reverse(),
            });
            break;
          }

          case "SEND_MESSAGE": {
            console.log("SEND MEssage");
            const { content, senderId, receiverId } = msg;
            const roomId = await messDAO.findDirectRoom(senderId, receiverId);
            //chan tin nhan rong
            if (!content?.trim()) {
              console.log("tin nhan rong");
              send(ws, { type: "ERROR", message: "Empty message" });
              return;
            }
            //kiem tra user co trong room khong
            console.log("Check receive:", userId, roomId);
            const allowed = await messDAO.isUserInRoom(
              Number(senderId),
              Number(roomId),
            );
            if (!allowed) {
              console.log("User khong o trong room", allowed);
              send(ws, { type: "ERROR", message: "Not a member of this room" });
              return;
            }

            const memberIds = await messDAO.getRoomMemberIds(roomId); //lay danh sach thanh vien trong room
            const others = memberIds.filter((id) => id !== senderId); //lay nhung nguoi con lai khong phai minh
            const friendChecks = await Promise.all(
              others.map((id) => messDAO.areFriends(senderId, id)),
            ); //kiem tra con la ban khong
            if (friendChecks.some((f) => !f)) {
              console.log("User khong con la ban");
              send(ws, {
                type: "ERROR",
                message: "You are no longer friends with a member of this room",
              });
              return;
            } //chi can 1 nguoi khong la ban, chan

            const message = await messDAO.sendMessage(
              roomId,
              senderId,
              content.trim(),
            );
            console.log("Message send", message);
            const payload = { type: "NEW_MESSAGE", roomId, message };
            // Send back to sender too
            send(ws, payload);
            // Broadcast to other room members who are online
            await broadcastToRoom(roomId, payload, senderId);
            break;
          }

          default:
            send(ws, { type: "ERROR", message: "Unknown message type" });
        }
      });

      ws.on("close", () => {
        if (clients.get(userId) === ws) {
          clients.delete(userId);
        }
        console.log(`WS user disconnected: ${userId} (total: ${clients.size})`);
      });

      ws.on("error", (err: Error) => {
        console.error(`WS error for user ${userId}:`, err.message);
      });
    },
  );

  return wss;
}

// Utility: push a message to a specific user from outside (e.g., REST controller)
export function pushToUser(userId: number, payload: object) {
  const ws = clients.get(userId);
  if (ws) send(ws, payload);
}
