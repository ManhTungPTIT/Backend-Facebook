"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const postRoute_1 = __importDefault(require("./router/postRoute"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 8080;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: "Secret Key is Tung",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
}));
console.log("Code dang chay");
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/user", userRouter_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "src", "uploads")));
app.use("/post", postRoute_1.default);
app.listen(port, () => {
    console.log("Server is listening on port", port);
});
//# sourceMappingURL=index.js.map