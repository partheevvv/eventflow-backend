import { prisma } from "../../config/database";

export const AuthRepository =  {
    async findUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                role: true,
                password: true
            }
        })
    },

    async createUser(email: string, password: string) {
        return prisma.user.create({
            data: { email, password }
        })
    }
}