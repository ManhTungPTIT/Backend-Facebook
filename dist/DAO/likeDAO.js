"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLike = exports.updateLike = exports.findAllLikes = exports.findLikeById = exports.createLike = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createLike = async (des, userCus, userMain) => {
    return await prisma.like.create({
        data: {
            des,
            userCus,
            userMain,
        },
    });
};
exports.createLike = createLike;
const findLikeById = async (id) => {
    return await prisma.like.findUnique({
        where: {
            id,
        },
    });
};
exports.findLikeById = findLikeById;
const findAllLikes = async () => {
    return await prisma.like.findMany();
};
exports.findAllLikes = findAllLikes;
const updateLike = async (id, des, userCus, userMain) => {
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
exports.updateLike = updateLike;
const deleteLike = async (id) => {
    return await prisma.like.delete({
        where: {
            id,
        },
    });
};
exports.deleteLike = deleteLike;
//# sourceMappingURL=likeDAO.js.map