import { PrismaClient } from "@prisma/client";
import { title } from "process";

const prisma = new PrismaClient();

//create room + add member
type TitleType = {
  userName: string;
  friendName: string;
};
export const createRoom = async (
  type: boolean,
  title: TitleType,
  user: number,
  friend: number,
) => {
  return await prisma.room.create({
    data: {
      type,
      members: {
        create: [
          {
            userId: user,
            nickname: title.userName,
          },
          {
            userId: friend,
            nickname: title.friendName,
          },
        ],
      },
    },
  });
};

// Returns only the roomId for a direct 1-on-1 room between two users
export const getDirectRoomId = async (
  userA: number,
  userB: number,
): Promise<number | null> => {
  const result = await prisma.memberRoom.groupBy({
    by: ["roomId"],
    where: {
      userId: { in: [userA, userB] },
      room: { type: false },
    },
    having: {
      userId: { _count: { equals: 2 } },
    },
    _count: { userId: true },
  });

  const row = result.find((r) => r._count.userId === 2);
  return row ? row.roomId : null;
};

// Find existing direct room between exactly two users, returns roomId or null
export const findDirectRoom = async (
  userA: number,
  userB: number,
): Promise<number | null> => {
  const room = await prisma.room.findFirst({
    where: {
      type: false,
      AND: [
        { members: { some: { userId: userA } } },
        { members: { some: { userId: userB } } },
      ],
    },
    select: {
      id: true,
      _count: { select: { members: true } },
    },
  });
  if (!room || room._count.members !== 2) return null;

  return room.id;
};

// Atomically find-or-create a direct room to avoid duplicates
export const findOrCreateDirectRoom = async (
  title: TitleType,
  user: number,
  friend: number,
) => {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.room.findFirst({
      where: {
        type: false,
        AND: [
          { members: { some: { userId: user } } },
          { members: { some: { userId: friend } } },
        ],
      },
      include: {
        _count: { select: { members: true } },
        members: { select: { userId: true } },
      },
    });

    if (existing && existing._count.members === 2)
      return { room: existing, created: false };

    const room = await tx.room.create({
      data: {
        type: false,
        members: {
          create: [
            { userId: user, nickname: title.userName },
            { userId: friend, nickname: title.friendName },
          ],
        },
      },
    });
    return { room, created: true };
  });
};

//list all room with user
export const getRoomsByUser = async (userId: number) => {
  return await prisma.room.findMany({
    where: { members: { some: { userId } } },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, img: true } } },
      },
      mess: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { sender: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

//room detail with member
export const getRoomById = async (roomId: number) => {
  return await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, img: true } } },
      },
    },
  });
};

//membership check
export const isUserInRoom = async (userId: number, roomId: number) => {
  const member = await prisma.memberRoom.findUnique({
    where: { roomId_userId: { roomId, userId } },
  });
  return !!member;
};

//chat with users
export const sendMessage = async (
  roomId: number,
  senderId: number,
  content: string,
) => {
  return await prisma.mess.create({
    data: { roomId, senderId, content },
    include: {
      sender: { select: { id: true, name: true, img: true } },
      attachment: true,
    },
  });
};

//history message when see old message
export const getMessages = async (
  roomId: number,
  limit = 50,
  cursor?: number,
) => {
  return await prisma.mess.findMany({
    where: {
      roomId,
      deletedAt: null,
      ...(cursor ? { id: { lt: cursor } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      sender: { select: { id: true, name: true, img: true } },
      attachment: true,
    },
  });
};

export const getRoomMemberIds = async (roomId: number) => {
  const members = await prisma.memberRoom.findMany({
    where: { roomId },
    select: { userId: true },
  });
  return members.map((m) => m.userId);
};

export const addMemberToRoom = async (roomId: number, userId: number) => {
  return await prisma.memberRoom.create({ data: { roomId, userId } });
};

// Check friendship (bidirectional rows exist, check one direction is enough)
export const areFriends = async (userA: number, userB: number) => {
  const row = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId: userA, friendId: userB },
        { userId: userB, friendId: userA },
      ],
    },
  });
  return !!row;
};

export const findLastMessage = async (roomId: number) => {
  return await prisma.mess.findFirst({
    where: {
      roomId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
