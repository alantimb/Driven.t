import { AuthenticatedRequest } from "@/middlewares";
import paymentsService from "@/services/payments-service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";

export async function getTicketPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { ticketId } = req.query as Record<string, string>;
    const { userId } = req.body.userId as { userId: number};
    
    try {
        const payment = await paymentsService.getTicketPayment(parseInt(ticketId), userId)
    
        return res.status(httpStatus.OK).send(payment);
    } catch (err) {
        next(err)
    }
}

export async function payTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // POST
}