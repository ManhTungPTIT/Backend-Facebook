import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createLike = async (userId: number, postId: number) => {
  return await prisma.like.create({
    data: {
      userId,
      postId,
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

export const deleteLike = async (id: number) => {
  return await prisma.like.delete({
    where: {
      id,
    },
  });
};
