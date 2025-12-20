"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.findAllPosts = exports.findPostById = exports.createPost = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPost = async (post) => {
    return await prisma.post.create({
        data: post,
    });
};
exports.createPost = createPost;
const findPostById = async (id) => {
    return await prisma.post.findUnique({
        where: {
            id,
        },
    });
};
exports.findPostById = findPostById;
const findAllPosts = async () => {
    return await prisma.post.findMany();
};
exports.findAllPosts = findAllPosts;
const updatePost = async (id, des, img) => {
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
exports.updatePost = updatePost;
const deletePost = async (id) => {
    return await prisma.post.delete({
        where: {
            id,
        },
    });
};
exports.deletePost = deletePost;
//# sourceMappingURL=postDAO.js.map