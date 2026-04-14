import "../prisma-env";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (
  userName: string,
  password: string,
  name: string,
  nameNoSign: string,
  salt: string,
  date: Date,
  sex: number,
  refreshToken?: string,
) => {
  return await prisma.user.create({
    data: {
      userName,
      password,
      name,
      nameNoSign,
      salt,
      date,
      sex,
      refreshToken,
    },
  });
};

export const findUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const findUserByUserName = async (username: string) => {
  console.log("🔍 [findUserByUserName] Đang tìm:", username);

  try {
    const user = await prisma.user.findFirst({
      where: {
        userName: {
          equals: username,
        },
      },
    });

    return user;
  } catch (error) {
    console.error("❌ Lỗi khi tìm user:", error);
    throw error;
  }
};

export const findAllUsers = async () => {
  return await prisma.user.findMany();
};

export const updateIsFriendById = async (id: number) => {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      isFriend: true,
    },
  });
};

export const updateRefreshToken = async (
  id: number,
  refreshToken: string,
  date: Date,
) => {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      refreshToken: refreshToken,
      date: date,
    },
  });
};

export const findRefreshToken = async (id: number) => {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
};

export const searchUserName = async (name: string, sendId: number) => {
  return await prisma.user.findMany({
    where: {
      nameNoSign: {
        contains: name,
      },
      id: {
        not: sendId,
      },
      // Không có request user đó -> mình
      sentRequests: {
        none: {
          receiverId: sendId,
        },
      },

      // Không có request mình -> user đó
      receivedRequests: {
        none: {
          senderId: sendId,
        },
      },

      user: {
        none: {
          friendId: sendId,
        },
      },

      // User đó không phải bạn của mình (chiều friendId -> userId)
      friend: {
        none: {
          userId: sendId,
        },
      },
    },
  });
};

export const requestAddFriend = async (
  senderId: number,
  receiverId: number,
) => {
  return await prisma.friendRequest.create({
    data: {
      senderId,
      receiverId,
    },
  });
};

export const findFriendRequestById = async (
  senderId: number,
  receiverId: number,
) => {
  return await prisma.friendRequest.findFirst({
    where: {
      OR: [
        {
          senderId: senderId,
          receiverId: receiverId,
        },
        {
          senderId: receiverId,
          receiverId: senderId,
        },
      ],
    },
  });
};

export const findFriendRequestBySender = async (receiverId: number) => {
  return await prisma.friendRequest.findMany({
    where: {
      receiverId: receiverId,
    },
    include: {
      sender: true,
    },
  });
};

export const deleteFriendRequest = async (
  senderId: number,
  receiverId: number,
) => {
  return await prisma.friendRequest.delete({
    where: {
      senderId_receiverId: {
        senderId: senderId,
        receiverId: receiverId,
      },
    },
  });
};

//tim kiem nguoi co ten trong bảng friendrequest
export const searchUserInFriendRequest = async (
  name: string,
  currentUserId: number,
) => {
  return await prisma.user.findMany({
    where: {
      AND: [
        // Tên khớp từ khóa
        {
          nameNoSign: {
            contains: name,
          },
        },

        // Không phải chính mình
        {
          id: {
            not: currentUserId,
          },
        },

        // Có friend request với mình
        {
          OR: [
            {
              sentRequests: {
                some: {
                  receiverId: currentUserId,
                  status: "pending",
                },
              },
            },
            {
              receivedRequests: {
                some: {
                  senderId: currentUserId,
                  status: "pending",
                },
              },
            },
          ],
        },

        // Chưa là bạn
        {
          NOT: {
            OR: [
              {
                user: {
                  some: {
                    friendId: currentUserId,
                  },
                },
              },
              {
                friend: {
                  some: {
                    userId: currentUserId,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  });
};

//tim kiem nguoi va da la ban
export const searchUserInFriendShip = async (
  name: string,
  currentUserId: number,
) => {
  return prisma.user.findMany({
    where: {
      nameNoSign: {
        contains: name,
      },

      id: {
        not: currentUserId,
      },

      OR: [
        {
          user: {
            some: {
              friendId: currentUserId,
            },
          },
        },
        {
          friend: {
            some: {
              userId: currentUserId,
            },
          },
        },
      ],
    },
  });
};

export const addFriendShip = async (userId: number, friendId: number) => {
  return await prisma.friendship.create({
    data: {
      userId: userId,
      friendId: friendId,
    },
  });
};

export const findAllFriendShip = async (userId: number) => {
  return await prisma.friendship.findMany({
    where: {
      OR: [
        {
          userId: userId,
        },
        {
          friendId: userId,
        },
      ],
    },
    include: {
      user: true,
      friend: true,
    },
  });
};
