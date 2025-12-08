import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createLike = async (
  des: string,
  userCus: number,
  userMain: number
) => {
  return await prisma.like.create({
    data: {
      des,
      userCus,
      userMain,
    },
  });
};

export const findLikeById = async (id: number) => {
  return await prisma.like.findUnique({
    where: {
      id,
    },
  });
};

export const findAllLikes = async () => {
  return await prisma.like.findMany();
};

export const updateLike = async (
  id: number,
  des: string,
  userCus: number,
  userMain: number
) => {
  return await prisma.like.update({
    where: {
      id,
    },
    data: {
      des,
      userCus,
      userMain,
    },
  });
};

export const deleteLike = async (id: number) => {
  return await prisma.like.delete({
    where: {
      id,
    },
  });
};
