import * as userDao from "../../DAO/userDAO";
import { Request, Response } from "express";

export async function searchUser(req: Request, res: Response) {
  const keyword = req.query;

  console.log("keyword:", keyword.userSearch);
  const users = await userDao.searchUserName(keyword.userSearch as string);
  return res.status(200).json({ userSearch: users });
}
