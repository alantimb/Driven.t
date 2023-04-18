import { notFoundError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";
import { Ticket, TicketType } from "@prisma/client";
import dayjs from "dayjs";

async function getAllTicketTypes(): Promise<TicketType[]> {
    const getAllTicketTypes = await ticketsRepository.findMany();

    if (getAllTicketTypes.length !== 0) {
        return getAllTicketTypes;
    } else if (getAllTicketTypes.length === 0) {
        return getAllTicketTypes;
    } else if (!getAllTicketTypes) {
        throw notFoundError();
    }
}

export type CreateTicketType = Omit<Ticket, 'id' | 'enrollmentId' | 'status' | 'createdAt' | 'updatedAt'>

export type CreateTicketParams = {
    ticketTypeId: CreateTicketType,
    userId: number
}

export type CreateTicket = Omit<Ticket, "id">


async function createTicketByType(params: CreateTicketParams) {
    const ticketType = await ticketsRepository.findFirst(params.ticketTypeId);
    if (!ticketType) throw notFoundError();

    const enrollment = await ticketsRepository.findUnique(params.userId);
    if (!enrollment) throw notFoundError();

    const ticket: CreateTicket = {
        ticketTypeId: ticketType.id,
        enrollmentId: enrollment.id,
        status: 'RESERVED',
        createdAt: dayjs().toDate(),
        updatedAt: dayjs().toDate()
    }

    const newTicket = await ticketsRepository.create(ticket)

    const successTicket = {
        status: newTicket.status,
        ticketTypeId: newTicket.ticketTypeId,
        enrollmentId: newTicket.enrollmentId,
        TicketType: ticketType,
        createdAt: newTicket.createdAt,
        updatedAt: newTicket.updatedAt
    }

    return successTicket;
}

const ticketsService = {
    getAllTicketTypes,
    createTicketByType
}

export default ticketsService;