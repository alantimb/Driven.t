import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";

export async function getAllTicketTypes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const getAllTicketTypes  = await ticketsService.getAllTicketTypes();

        return res.status(httpStatus.OK).send(getAllTicketTypes);
    } catch (err) {
        next(err)
    }
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req as { userId: number };

    try {
        const tickets = await ticketsService.getUserTickets(userId)

        return res.status(httpStatus.OK).send(tickets)
    } catch (err) {
        if (err.name === 'NotFoundError'){
            return res.status(httpStatus.NOT_FOUND).send(err.message)
        }
    next(err)
    }
}


export async function createTicketByType(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { ticketTypeId }  = req.body as {ticketTypeId: number};
    const { userId } = req as { userId: number };
    
    try {
        const ticket = await ticketsService.createTicketByType(
            userId, 
            ticketTypeId
        )

        return res.status(httpStatus.CREATED).send(ticket)
    } catch (err) {
        if (err.name === 'NotFoundError'){
            return res.status(httpStatus.NOT_FOUND).send(err.message)
        }
    next(err)
    }
}