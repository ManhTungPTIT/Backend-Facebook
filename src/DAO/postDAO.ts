import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPost = async (post: {
  des: string;
  img: string;
  userMain: number;
}) => {
  return await prisma.post.create({
    data: post,
  });
};

export const findPostById = async (id: number) => {
  return await prisma.post.findUnique({
    where: {
      id,
    },
  });
};

export const findAllPosts = async () => {
  return await prisma.post.findMany();
};

export const updatePost = async (id: number, des: string, img: string) => {
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

export const deletePost = async (id: number) => {
  return await prisma.post.delete({
    where: {
      id,
    },
  });
};
