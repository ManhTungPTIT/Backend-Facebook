"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genSalt = genSalt;
exports.hashPasswordPBKDF2 = hashPasswordPBKDF2;
exports.timingSafeEqualHex = timingSafeEqualHex;
const crypto_1 = __importDefault(require("crypto"));
function genSalt(bytes = 16) {
    return crypto_1.default.randomBytes(bytes).toString("hex");
}
function hashPasswordPBKDF2(password, salt, iterations = 310_000, keylen = 32, digest = "sha256") {
    return new Promise((resolve, reject) => {
        crypto_1.default.pbkdf2(password, salt, iterations, keylen, digest, (err, derived) => {
            if (err)
                return reject(err);
            resolve(derived.toString("hex"));
        });
    });
}
function timingSafeEqualHex(aHex, bHex) {
    const a = Buffer.from(aHex, "hex");
    const b = Buffer.from(bHex, "hex");
    if (a.length !== b.length)
        return false;
    return crypto_1.default.timingSafeEqual(a, b);
}
//# sourceMappingURL=crypto.js.map