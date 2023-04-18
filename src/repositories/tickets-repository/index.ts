import { prisma } from "@/config";
import { CreateTicket } from "@/services/tickets-service";
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

async function findTicketByEnrollment(params: number) {
    return prisma.ticket.findFirst({
        where: {
            enrollmentId: params
        }
    })
}

async function findTicketById(params: number) {
    return prisma.ticket.findUnique({
        where: {
            id: params
        }
    })
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

async function updateTicket(ticket: Ticket) {
    return await prisma.ticket.update({
        where: {
            id: ticket.id
        }, 
        data: {
            status: 'PAID'
        }
    })
}

const ticketsRepository = {
    findMany,
    findFirst,
    findUnique,
    create,
    findTicketByEnrollment,
    findTicketById,
    updateTicket
}

export default ticketsRepository;