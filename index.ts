import express from "express";
import userRoute from "./router/userRouter";
import postRoute from "./router/postRoute";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import path from "path";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    secret: "Secret Key is Tung", // A secret key to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // Session expiration time (e.g., 24 hours)
    },
  })
);
console.log("Code dang chay");

app.use(passport.initialize());
app.use(passport.session());
app.use("/user", userRoute);
app.use("/uploads", express.static(path.join(process.cwd(), "src", "uploads")));
app.use("/post", postRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
