import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getAllTicketTypes(req: AuthenticatedRequest, res: Response) {
    try {
        const getAllTicketTypes  = await ticketsService.getAllTicketTypes();

        return res.status(httpStatus.OK).send(getAllTicketTypes);
    } catch (err) {
        return res.status(500).send()
    }
}