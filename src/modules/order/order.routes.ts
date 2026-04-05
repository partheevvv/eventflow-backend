import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createOrderSchema } from "./order.validation";
import { asyncHandler } from "../../utils/asyncHandler";
import { OrderController } from "./order.controller";


const router = Router()

router.post(
    "/",
    authMiddleware,
    validate(createOrderSchema),
    asyncHandler(OrderController.createOrder)
)

router.get(
    "/my",
    authMiddleware,
    asyncHandler(OrderController.getMyOrders)
)

router.post(
    "/:id/cancel",
    authMiddleware,
    asyncHandler(OrderController.cancelOrder)
)

router.post(
    "/:id/pay",
    authMiddleware,
    asyncHandler(OrderController.createPaymentIntent)
)
export default router