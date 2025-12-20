"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const tokens_1 = require("../Authen/tokens");
function authenticateToken(req, res, next) {
    const auth = req.headers["authorization"];
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token)
        return res.status(401).json({ error: "Missing access token" });
    try {
        const payload = (0, tokens_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid or expired access token" });
    }
}
//# sourceMappingURL=auth.js.map