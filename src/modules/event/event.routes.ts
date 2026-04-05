import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createEventSchema } from "./event.validation";
import { asyncHandler } from "../../utils/asyncHandler";
import { EventController } from "./event.controller";


const router = Router()

router.post(
    "/",
    authMiddleware,
    validate(createEventSchema),
    asyncHandler(EventController.createEvent)
)

router.get(
    "/",
    asyncHandler(EventController.getEvents)
)

router.get(
    "/:id",
    asyncHandler(EventController.getEvent)
)

router.patch(
    "/:id",
    authMiddleware,
    asyncHandler(EventController.updateEvent)
)

router.delete(
    "/:id",
    authMiddleware,
    asyncHandler(EventController.deleteEvent)
)

export default router
