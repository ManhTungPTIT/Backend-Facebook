import WebSocket from "ws";
import { verifyAccessToken } from "../../controller/Authen/tokens";

export function createServer(server) {
  const wss = new WebSocket.Server({ server });

  //WebSocket logic
  wss.on("connection", (ws, req) => {
    console.log("Client connected");

    // Listen for messages from the client
    const params = new URLSearchParams(req.url.replace("/?", ""));
    const token = params.get("token");

    try {
      const user = verifyAccessToken(token);
      ws.user = user; // gắn user vào socket

      console.log("User connected:", user.id);
    } catch (err) {
      ws.close();
      return;
    }

    ws.on("message", (message) => {
      console.log("Message:", message.toString());
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  return wss;
}
