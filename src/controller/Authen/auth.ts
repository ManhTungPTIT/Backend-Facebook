import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../Authen/tokens";

//xac dinh xem co login chua moi cho vao cac trang khac
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers["authorization"];
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing access token" });

  try {
    const payload = verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
}
