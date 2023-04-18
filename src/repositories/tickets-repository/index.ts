import { prisma } from "@/config";
import { CreateTicket, CreateTicketType } from "@/services/tickets-service";
import { Enrollment, Ticket, TicketType } from "@prisma/client";

async function findMany(): Promise<TicketType[]> {
    return prisma.ticketType.findMany();
}

async function findFirst(ticketTypeId: number): Promise<TicketType> {
    return prisma.ticketType.findFirst({
        where: {
            id: ticketTypeId,
        }
    });
}

async function findUnique(userId: number): Promise<Enrollment> {
    const teste = await prisma.enrollment.findUnique({
        where: {
            userId: userId,
        }
    });

    return teste
}

async function create(params: CreateTicket): Promise<Ticket> {
    return prisma.ticket.create({
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