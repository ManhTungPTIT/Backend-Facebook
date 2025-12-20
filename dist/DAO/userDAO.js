"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllUsers = exports.findUserByUserName = exports.findUserById = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = async (userName, password, name, salt, date, sex) => {
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
exports.createUser = createUser;
const findUserById = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id,
        },
    });
};
exports.findUserById = findUserById;
const findUserByUserName = async (username) => {
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
    }
    catch (error) {
        console.error("❌ Lỗi khi tìm user:", error);
        throw error;
    }
};
exports.findUserByUserName = findUserByUserName;
const findAllUsers = async () => {
    return await prisma.user.findMany();
};
exports.findAllUsers = findAllUsers;
//# sourceMappingURL=userDAO.js.map