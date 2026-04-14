import { error } from "console";
import * as userDao from "../../DAO/userDAO";
import { Request, Response } from "express";

export async function searchUser(req: Request, res: Response) {
  const keyword = req.query;
  console.log("keyword:", req.query);
  const users = await userDao.searchUserName(
    keyword.userSearch as string,
    Number(keyword.userDataId),
  );

  const Users = users.map((user) => ({
    ...user,
    relationStatus: "none",
    hasSentRequest: false,
  }));

  const userRequest = await userDao.searchUserInFriendRequest(
    keyword.userSearch as string,
    Number(keyword.userDataId),
  );

  const UserRequest = userRequest.map((user) => ({
    ...user,
    relationStatus: "pending",
    hasSentRequest: false,
  }));

  const userFriend = await userDao.searchUserInFriendShip(
    keyword.userSearch as string,
    Number(keyword.userDataId),
  );

  const UserFriend = userFriend.map((user) => ({
    ...user,
    relationStatus: "friend",
    hasSentRequest: false,
  }));

  const listSearch = {
    Users,
    UserRequest,
    UserFriend,
  };

  console.log("Data: ", listSearch);

  return res.status(200).json({ userSearch: listSearch });
}

export async function requestAddFriend(req: Request, res: Response) {
  console.log("BODY:", req.body);

  //check da co cap yeu cau nay giua 2 user chưa
  const friendRequest = await userDao.findFriendRequestById(
    req.body.senderID,
    req.body.receiverID,
  );

  console.log(friendRequest);
  if (!friendRequest) {
    console.log("No find ");
    await userDao.requestAddFriend(req.body.senderID, req.body.receiverID);

    return res.status(200).json();
  }

  return res.status(400).json();
}

export async function findAllFriendRequest(req: Request, res: Response) {
  const listFriendRquest = await userDao.findFriendRequestBySender(
    Number(req.query.id),
  );

  return res.status(200).json({ list: listFriendRquest });
}

export async function cancelFriendRequest(req: Request, res: Response) {
  console.log("Cancel add friend");
  console.log("Request: ", req.body.senderId, "and", req.body.receiverId);
  const requestFriend = await userDao.findFriendRequestById(
    req.body.senderId,
    req.body.receiverId,
  );

  console.log("Find requestFriend: ", requestFriend);
  if (!requestFriend) {
    return res.status(400).json({ error: "Request not found" });
  }
  await userDao.deleteFriendRequest(
    requestFriend.senderId,
    requestFriend.receiverId,
  );
  return res.status(200).json();
}

export async function acceptFriendRequest(req: Request, res: Response) {
  console.log("Accept add friend");

  await userDao.deleteFriendRequest(req.body.senderId, req.body.receiverId);
  await userDao.addFriendShip(req.body.senderId, req.body.receiverId);

  return res.status(200).json();
}

export async function findAllFriendShip(req: Request, res: Response) {
  console.log("Find all friend");
  const listFriendShip = await userDao.findAllFriendShip(Number(req.query.id));
  return res.status(200).json({ list: listFriendShip });
}
