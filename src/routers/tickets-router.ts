import { authenticateToken, validateBody } from "@/middlewares";
import { Router } from "express";
import { createTicketByType, getAllTicketTypes } from "@/controllers";
import { createTicketSchema } from "@/schemas/tickets-schemas";

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getAllTicketTypes)
    // .get('/')
    .post('/', validateBody(createTicketSchema), createTicketByType)

export { ticketsRouter }