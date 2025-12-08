import express from "express";
import { Request, Response } from "express";
import * as postDAO from "../../DAO/postDAO";

export const createPost = async (req: Request, res: Response) => {
  console.log("Data: ", req.body.userId);
  console.log("File: ", req.files);

  const files = req.files as Express.Multer.File[];
  console.log(files);

  const imageUrls = files.map(
    (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
  );

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
