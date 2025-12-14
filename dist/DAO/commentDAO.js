"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.findAllComments = exports.findCommentById = exports.createComment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createComment = async (des, userCus, userMain) => {
    return await prisma.comment.create({
        data: {
            des,
            userCus,
            userMain,
        },
    });
};
exports.createComment = createComment;
const findCommentById = async (id) => {
    return await prisma.comment.findUnique({
        where: {
            id,
        },
    });
};
exports.findCommentById = findCommentById;
const findAllComments = async () => {
    return await prisma.comment.findMany();
};
exports.findAllComments = findAllComments;
const updateComment = async (id, des, userCus, userMain) => {
    return await prisma.comment.update({
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
exports.updateComment = updateComment;
const deleteComment = async (id) => {
    return await prisma.comment.delete({
        where: {
            id,
        },
    });
};
exports.deleteComment = deleteComment;
//# sourceMappingURL=commentDAO.js.map