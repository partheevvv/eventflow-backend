import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { loginSchema, registerSchema } from "./auth.validation";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router()

router.post("/register", validate(registerSchema), asyncHandler(AuthController.register))
router.post("/login", validate(loginSchema), asyncHandler(AuthController.login))

router.get("/me", authMiddleware, AuthController.me)

export default router