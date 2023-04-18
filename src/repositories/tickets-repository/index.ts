import { prisma } from "@/config";
import { CreateTicket, CreateTicketType } from "@/services/tickets-service";
import { Enrollment, Ticket, TicketType } from "@prisma/client";

async function findMany(): Promise<TicketType[]> {
    return await prisma.ticketType.findMany();
}

async function findFirst(params: CreateTicketType): Promise<TicketType> {
    return await prisma.ticketType.findFirst({
        where: {
            id: params.ticketTypeId,
        }
    });
}

async function findUnique(params: number): Promise<Enrollment> {
    return await prisma.enrollment.findUnique({
        where: {
            userId: params,
        }
    });
}

async function create(params: CreateTicket): Promise<Ticket> {
    return await prisma.ticket.create({
        data: params
    });
}

const ticketsRepository = {
    findMany,
    findFirst,
    findUnique,
    create
}

export default ticketsRepository;