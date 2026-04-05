import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { TicketController } from "./ticket.controller";
import { validate } from "../../middleware/validate.middleware";
import { createTicketSchema } from "./ticket.validation";

const router = Router()

router.post(
    "/",
    authMiddleware,
    validate(createTicketSchema),
    asyncHandler(TicketController.createTicket)
)

router.get(
    "/:eventId",
    asyncHandler(TicketController.getTickets)
)

export default router