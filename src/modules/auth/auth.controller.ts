import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { successResponse } from "../../utils/apiResponse";

export const AuthController = {

    async register(req: Request, res: Response, next: NextFunction) {

        try {
            const result = await AuthService.register(req.body)
            res.json(
                successResponse(result, "User successfully registered")
            )
        } catch (error: any) {
            next(error)
        }
    },
    
    async login(req: Request, res: Response, next: NextFunction) {

        try {
            const result = await AuthService.login(req.body)
            res.json(successResponse(result, "User logged in"))
        } catch (error: any) {
            next(error)
        }
    },

    async me(req: Request, res: Response) {

        res.json({
            user: req.user
        })
    }
}