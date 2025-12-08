import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createMess = async (des: string, img: string) => {
  return await prisma.mess.create({
    data: {
      des,
      img,
    },
  });
};

export const findMessById = async (id: number) => {
  return await prisma.mess.findUnique({
    where: {
      id,
    },
  });
};

export const findAllMess = async () => {
  return await prisma.mess.findMany();
};

export const updateMess = async (id: number, des: string, img: string) => {
  return await prisma.post.update({
    where: {
      id,
    },
    data: {
      des,
      img,
    },
  });
};

export const deleteMess = async (id: number) => {
  return await prisma.mess.delete({
    where: {
      id,
    },
  });
};
