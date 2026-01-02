import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (
  userName: string,
  password: string,
  name: string,
  salt: string,
  date: Date,
  sex: number,
  refreshToken?: string
) => {
  return await prisma.user.create({
    data: {
      userName,
      password,
      name,
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

export const updateRefreshToken = async (
  id: number,
  refreshToken: string,
  date: Date
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
