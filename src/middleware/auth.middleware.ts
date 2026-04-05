import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import { prisma } from "../config/database";
import { env } from "../config/env";

const JWT_SECRET = env.JWT_SECRET as string

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        
        const authHeader = req.headers.authorization

        if(!authHeader) {
            return res.status(401).json({
                message: "Authorization header missing"
            })
        }

        const token = authHeader.split(" ")[1]

        const payload = jwt.verify(token, JWT_SECRET) as { userId: string }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId }
        })

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            })
        }

        req.user = user

        next()

    } catch (error) {
        
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}