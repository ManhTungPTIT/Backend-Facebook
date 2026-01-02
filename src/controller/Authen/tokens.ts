import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL || "5m";
const REFRESH_TTL = process.env.REFRESH_TOKEN_TTL || "7d";

export function signAccessToken(payload: object): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    algorithm: "HS256",
    expiresIn: ACCESS_TTL,
    issuer: "myapp",
  });
}

export function signRefreshToken(payload: object): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}
