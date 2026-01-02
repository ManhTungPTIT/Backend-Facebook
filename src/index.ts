import express from "express";
import userRoute from "./router/userRouter";
import postRoute from "./router/postRoute";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import path from "path";
import MySQLStore from "express-mysql-session";
import mysql from "mysql2/promise";

const app = express();
const port = 8080;
const MySQLStoreSession = MySQLStore(session);
const isProduction = process.env.NODE_ENV === "production";

const dbOptions = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123456",
  database: "facebook",
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
    origin: "http://localhost:3000",
    credentials: true,
  })
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
  })
);
console.log("Code dang chay");

app.use(passport.initialize());

app.use("/user", userRoute);
app.use("/uploads", express.static(path.join(process.cwd(), "src", "uploads")));
app.use("/post", postRoute);

app.listen(port, () => {
  console.log("Server is listening on port", port);
});
