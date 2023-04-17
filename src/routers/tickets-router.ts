import { authenticateToken } from "@/middlewares";
import { prisma } from "@/config";
import { Router } from "express";
import { getAllTicketTypes } from "@/controllers";

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getAllTicketTypes)
    // .get('/')
    // .post('/')

export { ticketsRouter }