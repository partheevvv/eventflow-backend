import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AuthRepository } from "./auth.repository"
import { RegisterDTO, LoginDTO } from "./auth.types"
import { ApiError } from "../../utils/ApiError"
import { env } from "../../config/env"

const JWT_SECRET = env.JWT_SECRET as string

export const AuthService = {

    async register(data: RegisterDTO) {

        const existingUser = await AuthRepository.findUserByEmail(data.email)

        if (existingUser) {
            throw new ApiError(400, "User already exists")
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const user = await AuthRepository.createUser(
            data.email,
            hashedPassword
        )

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: "1d" }
        )
        
        const { password, ...safeUser } = user

        return { 
            token, 
            user: safeUser
        }
    },

    async login(data: LoginDTO) {

        const user = await AuthRepository.findUserByEmail(data.email)

        if (!user) throw new ApiError(401 ,"Invalid credentials")

        const valid = await bcrypt.compare(
            data.password,
            user.password
        )

        if (!valid) throw new ApiError(401, "Invalid credentials")

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: "1d" }
        )

        const { password, ...safeUser } = user

        return { 
            token, 
            user: safeUser 
        }
    }
}