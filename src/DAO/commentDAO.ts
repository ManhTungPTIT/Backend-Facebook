import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createComment = async (
  des: string,
  userId: number,
  postId: number,
) => {
  return await prisma.comment.create({
    data: {
      des,
      userId,
      postId,
    },
  });
};

export const findCommentById = async (id: number) => {
  return await prisma.comment.findUnique({
    where: {
      id,
    },
  });
};

export const findAllComments = async () => {
  return await prisma.comment.findMany();
};

export const updateComment = async (
  id: number,
  des: string,
  userId: number,
  postId: number,
) => {
  return await prisma.comment.update({
    where: {
      id,
    },
    data: {
      des,
      userId,
      postId,
    },
  });
};

export const deleteComment = async (id: number) => {
  return await prisma.comment.delete({
    where: {
      id,
    },
  });
};
