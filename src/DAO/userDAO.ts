import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (
  userName: string,
  password: string,
  name: string,
  salt: string,
  date: Date,
  sex: number
) => {
  return await prisma.user.create({
    data: {
      userName,
      password,
      name,
      salt,
      date,
      sex,
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
