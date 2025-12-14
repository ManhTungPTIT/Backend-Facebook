"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
const userDao = __importStar(require("../../DAO/userDAO"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const crypto_1 = require("./crypto");
const tokens_1 = require("./tokens");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "userName", passwordField: "password" }, async (userName, password, cb) => {
    try {
        const foundUser = await userDao.findUserByUserName(userName);
        console.log(foundUser);
        const hashPassword = await (0, crypto_1.hashPasswordPBKDF2)(password, foundUser.salt);
        const ok = (0, crypto_1.timingSafeEqualHex)(foundUser.password, hashPassword);
        return cb(null, {
            id: foundUser.id,
            username: foundUser.userName,
            name: foundUser.name,
            img: foundUser.img,
        });
    }
    catch (err) {
        return cb(err);
    }
}));
async function register(req, res) {
    try {
        const { userName, password, name, date, sex } = req.body || {};
        console.log(userName, password, name, date, sex);
        if (!userName || !password || !name || !date || !sex) {
            console.log("Error");
            return res.status(400).json({ error: "Missing username/password" });
        }
        const userCurrent = await userDao.findUserByUserName(userName);
        console.log(typeof new Date(date));
        if (!userCurrent) {
            console.log("zoooooo");
            await userDao.createUser(userName, password, name, (0, crypto_1.genSalt)(), new Date(date), sex);
            console.log("Create user success");
            return res.status(200).json({ text: "Success" });
        }
        else {
            return res.status(400).json({ error: "User is exis" });
        }
    }
    catch (err) {
        return res.status(400).json({ error: err.message || "Register failed" });
    }
}
function login(req, res, next) {
    console.log("Data: ", req.body);
    passport_1.default.authenticate("local", { session: false }, (err, user, info) => {
        if (err)
            return next(err);
        if (!user)
            return res.status(401).json({ error: info?.message || "Unauthorized" });
        const payload = {
            id: user.id,
            username: user.username,
            name: user.name,
            img: user.img,
        };
        const accessToken = (0, tokens_1.signAccessToken)(payload);
        const refreshToken = (0, tokens_1.signRefreshToken)({ sub: user.id });
        req.session.refreshToken = refreshToken;
        req.session.userId = user.id;
        const jwtToken = {
            access: accessToken,
            refresh: refreshToken,
        };
        return res.status(200).json({ jwtToken });
    })(req, res, next);
}
function refresh(req, res) {
    const token = req.session.refreshToken;
    if (!token)
        return res.status(401).json({ error: "Missing refresh token in session" });
    try {
        const decoded = (0, tokens_1.verifyRefreshToken)(token);
        if (req.session.userId && decoded.sub !== req.session.userId) {
            return res.status(403).json({ error: "Session token mismatch" });
        }
        const newAccess = (0, tokens_1.signAccessToken)({ id: decoded.sub });
        return res.json({ accessToken: newAccess });
    }
    catch {
        return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
}
function logout(req, res) {
    req.session.destroy((err) => {
        if (err)
            return res.status(500).json({ error: "Failed to destroy session" });
        res.clearCookie("sid");
        return res.json({ message: "Logged out" });
    });
}
//# sourceMappingURL=auths.js.map