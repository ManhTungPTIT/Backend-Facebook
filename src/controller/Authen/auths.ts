import * as userDao from "../../DAO/userDAO";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { hashPasswordPBKDF2, timingSafeEqualHex, genSalt } from "./crypto";
import crypto from "crypto";
import { Request, Response } from "express";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "./tokens";
import { config } from "dotenv";
config();

passport.use(
  new LocalStrategy(
    { usernameField: "userName", passwordField: "password" },
    async (userName, password, cb) => {
      try {
        const foundUser = await userDao.findUserByUserName(userName);
        console.log(foundUser);
        // if (foundUser === null) {
        //   return cb(null, false, {
        //     message: "Incorrect username or password.",
        //   });
        // }

        const hashPassword = await hashPasswordPBKDF2(password, foundUser.salt);
        const ok = timingSafeEqualHex(foundUser.password, hashPassword);
        // if (!ok) {
        //   return cb(null, false, {
        //     message: "Incorrect username or password.",
        //   });
        // }

        // Trả user “gọn” cho Passport
        return cb(null, {
          id: foundUser.id,
          username: foundUser.userName,
          name: foundUser.name,
          img: foundUser.img,
        });
      } catch (err) {
        return cb(err as any);
      }
    }
  )
);

//Register
export async function register(req: Request, res: Response) {
  try {
    const { userName, password, name, date, sex } = req.body || {};
    console.log(userName, password, name, date, sex);
    if (!userName || !password || !name || !date || !sex) {
      console.log("Error");
      return res.status(400).json({ error: "Missing username/password" });
    }

    const userCurrent = await userDao.findUserByUserName(userName);
    const refreshToken = "";
    if (!userCurrent) {
      console.log("zoooooo");
      await userDao.createUser(
        userName,
        password,
        name,
        genSalt(),
        new Date(date),
        sex,
        refreshToken
      );
      console.log("Create user success");
      return res.status(200).json({ text: "Success" });
    } else {
      return res.status(400).json({ error: "User is exis" });
    }
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Register failed" });
  }
}

//Login -> tạo Access + Refresh; LƯU refresh token vào session
export async function login(req: Request, res: Response, next: Function) {
  console.log("Data: ", req.body);

  passport.authenticate("local", async (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ error: info?.message || "Unauthorized" });

    const payload = {
      id: user.id,
      username: user.username,
      name: user.name,
      img: user.img,
    };

    const accessToken = signAccessToken(payload);

    // Refresh token: JWT nhưng LƯU TRONG SESSION
    const refreshToken = signRefreshToken({ sub: user.id });
    const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const expire = new Date(date.toISOString());

    await userDao.updateRefreshToken(user.id, refreshToken, expire);

    // Lưu vào session
    req.session.refreshToken = refreshToken;
    req.session.userId = user.id;
    req.session.save(() => {
      console.log("LOGIN SESSION ID:", req.sessionID);
      console.log("LOGIN SESSION:", req.session);
    });

    const jwtToken = {
      access: accessToken,
      refresh: refreshToken,
    };
    return res.status(200).json({ jwtToken });
  })(req, res, next);
}

// Lấy Access token mới từ refresh token trong session
export async function refresh(req: Request, res: Response) {
  const user = await userDao.findRefreshToken(req.body.userId!);
  if (!user) {
    console.log("User not found");
    return res.status(401).json({ error: "User not found" });
  }
  const timeEpri = user.date.getTime();
  if (timeEpri < Date.now()) {
    console.log("RefreshToken expired");
    return res.status(402).json({ error: "RefreshToken expired" });
  }
  const token = user.refreshToken;
  console.log("token: ", token);
  if (token !== req.body.refreshToken)
    return res.status(401).json({ error: "Missing refresh token in session" });

  try {
    const decoded: any = verifyRefreshToken(token);
    // Có thể kiểm tra thêm decoded.sub == req.session.userId
    if (req.session.userId && decoded.sub !== req.session.userId) {
      return res.status(403).json({ error: "Session token mismatch" });
    }
    const newAccess = signAccessToken({ id: decoded.sub });
    return res.json({ accessToken: newAccess });
  } catch {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
}

// Logout -> xóa refreshtoken trong db
export async function logout(req: Request, res: Response) {
  const userId = req.body.userId;
  console.log("userId: ", req.body);
  await userDao.updateRefreshToken(userId, "", new Date());
  return res.status(200).json({ text: "Success" });
}
