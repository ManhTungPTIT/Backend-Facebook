import express from "express";
import * as posts from "../controller/Post/uploadImgFirebase";
import path from "path";
import fs from "fs";
import multer from "multer";

const postRoute = express.Router();

//tao file luu anh
const uploadFolder = path.join(process.cwd(), "src", "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    console.log(uniqueName);
    cb(null, uniqueName);
  },
});

const uploads = multer({ storage });

postRoute.post("/createPost", uploads.array("image", 100), posts.createPost);

export default postRoute;
