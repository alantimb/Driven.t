import { notFoundError, requestError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import { CardData } from "@/protocols";
import paymentsService from "@/services/payments-service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";

export async function getTicketPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { ticketId } = req.query as Record<string, string>;
    const { userId } = req as { userId: number};
    
    try {
        if(isNaN(parseInt(ticketId))) return res.status(httpStatus.BAD_REQUEST).send('TicketId format is invalid')

        const payment = await paymentsService.getTicketPayment(parseInt(ticketId), userId)
    
        return res.status(httpStatus.OK).send(payment);
    } catch (err) {
        next(err)
    }
}

export async function paymentProcess(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { ticketId, cardData } = req.body as { ticketId: number, cardData: CardData }
    const { userId } = req as { userId: number };

    try {
        const payment = await paymentsService.createPayment(ticketId, cardData, userId);
        
        return res.status(httpStatus.OK).send(payment);
    } catch (err) {
        next(err)
    }
}