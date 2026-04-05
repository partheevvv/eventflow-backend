import { Request, Response } from "express"
import { successResponse } from "../../utils/apiResponse"
import { TicketService } from "./ticket.service"

export const TicketController = {
    
    async createTicket(req: Request, res: Response) {
        
        const ticket = await TicketService.createTicket(
            req.body,
            req.user!.id
        )

        res.json(successResponse(ticket, "Ticket created"))
    },

    async getTickets(req: Request<{eventId: string}>, res: Response) {

        const tickets = await TicketService.getTickets(
            req.params.eventId
        )

        res.json(successResponse(tickets))
    }

}