import { Request, Response } from "express"
import { OrderService } from "./order.service"
import { successResponse } from "../../utils/apiResponse"

export const OrderController = {

    async createOrder(req: Request, res: Response) {
        const order = await OrderService.createOrder(
            req.body,
            req.user!.id
        )

        res.json(successResponse(order, "Order created"))
    },

    async getMyOrders(req: Request, res: Response) {
        const orders = await OrderService.getMyOrders(
            req.user!.id
        )

        res.json(successResponse(orders))
    },

    async cancelOrder(req: Request<{ id: string }>, res: Response) {

        const order = await OrderService.cancelOrder(
            req.params.id,
            req.user!.id
        )

        res.json(successResponse(order, "Order cancelled"))
    },

    async createPaymentIntent(req: Request<{ id: string }>, res: Response) {
        const data = await OrderService.createPaymentIntent(
            req.params.id,
            req.user!.id
        )

        res.json(data)
    }
}