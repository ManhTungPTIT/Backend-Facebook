"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMess = exports.updateMess = exports.findAllMess = exports.findMessById = exports.createMess = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createMess = async (des, img) => {
    return await prisma.mess.create({
        data: {
            des,
            img,
        },
    });
};
exports.createMess = createMess;
const findMessById = async (id) => {
    return await prisma.mess.findUnique({
        where: {
            id,
        },
    });
};
exports.findMessById = findMessById;
const findAllMess = async () => {
    return await prisma.mess.findMany();
};
exports.findAllMess = findAllMess;
const updateMess = async (id, des, img) => {
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
exports.updateMess = updateMess;
const deleteMess = async (id) => {
    return await prisma.mess.delete({
        where: {
            id,
        },
    });
};
exports.deleteMess = deleteMess;
//# sourceMappingURL=messDAO.js.map