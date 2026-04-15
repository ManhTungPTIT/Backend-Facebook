import express from "express";
import userRoute from "./router/userRouter";
import postRoute from "./router/postRoute";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import path from "path";
import MySQLStore from "express-mysql-session";
import { createServer } from "./controller/Post/socket";
import http from "http";
import "./prisma-env";

const app = express();
const port = 8080;
const MySQLStoreSession = MySQLStore(session);
const isProduction = process.env.NODE_ENV === "production";
const server = http.createServer(app);

createServer(server);

const dbOptions = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const sessionStore = new MySQLStoreSession(dbOptions);

// Cần thiết cho secure cookie khi chạy sau reverse proxy (Nginx, Heroku, Render, etc.)
if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(
  session({
    name: "connect.sid",
    secret: "Secret Key is Tung", // A secret key to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Save uninitialized sessions
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: isProduction, // true nếu là production, false nếu là local
      sameSite: isProduction ? "none" : "lax", // none cho prod (cross-site), lax cho local

      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // Session expiration time (e.g., 24 hours)
    },
  }),
);

app.use(passport.initialize());

app.use("/user", userRoute);
app.use("/uploads", express.static(path.join(process.cwd(), "src", "uploads")));
app.use("/post", postRoute);

server.listen(port, () => {
  console.log("Server is listening on port", port);
  console.log("ALL ENV:", Object.keys(process.env));
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
});
