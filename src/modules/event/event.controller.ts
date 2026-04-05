import { Request, Response } from "express"
import { EventService } from "./event.service"
import { successResponse } from "../../utils/apiResponse"

export const EventController = {

    async createEvent(req: Request, res: Response) {
        
        const event = await EventService.createEvent(
            req.body,
            req.user!.id
        )

        res.json(successResponse(event, "Event created"))
    },

    async getEvents(req: Request, res: Response) {
        
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const location = req.query.location as string | undefined
                
        const events = await EventService.getEvents({
            page,
            limit,
            location
        })

        res.json(successResponse(events))
    },

    async getEvent(
        req: Request<{ id: string }>, 
        res: Response) {
        
        const event = await EventService.getEventById(
            req.params.id
        )

        res.json(successResponse(event))
    },

    async updateEvent(req: Request<{ id: string }>, res: Response) {

        const updated = await EventService.updateEvent(
            req.params.id,
            req.body,
            req.user!.id
        )

        res.json(successResponse(updated, "Event updated"))
    },
    async deleteEvent(req: Request<{ id: string }>, res: Response) {
        
        const result = await EventService.deleteEvent(
            req.params.id,
            req.user!.id
        )

        res.json(successResponse(result, "Event deleted"))
    },
}