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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
const postDAO = __importStar(require("../../DAO/postDAO"));
const createPost = async (req, res) => {
    console.log("Data: ", req.body.userId);
    console.log("File: ", req.files);
    const files = req.files;
    console.log(files);
    const imageUrls = files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
    console.log(imageUrls);
    let imgData = "";
    imageUrls.forEach((img) => {
        imgData += img + ",";
    });
    const postData = {
        des: req.body.content,
        img: imgData,
        userMain: Number(req.body.userId),
    };
    const post = await postDAO.createPost(postData);
    const postRes = await postDAO.findPostById(post.id);
    console.log(postRes);
    return res.json({ newPost: postRes });
};
exports.createPost = createPost;
//# sourceMappingURL=uploadImgFirebase.js.map