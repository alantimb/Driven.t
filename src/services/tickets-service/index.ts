import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
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


async function getUserTickets(params: number) {
    const enrollment = await enrollmentRepository.findFirstByUserId(params);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollment(enrollment.id);
    if (!ticket) throw notFoundError();

    const ticketType = await ticketsRepository.findFirst(ticket.ticketTypeId);
    if (!ticketType) throw notFoundError();

    const userTicket = {
        id: ticket.id,
        status: ticket.status,
        ticketTypeId: ticket.ticketTypeId,
        enrollmentId: ticket.enrollmentId,
        TicketType: ticketType,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
    };

    return userTicket;
}

export type CreateTicket = Omit<Ticket, 'id' | 'createdAt'>

async function createTicketByType(userId: number, ticketTypeId: number) {
    const ticketType = await ticketsRepository.findFirst(ticketTypeId);
    if (!ticketType) throw notFoundError();

    const enrollment = await ticketsRepository.findUnique(userId);
    if (!enrollment) throw notFoundError();
    
    const ticket: CreateTicket = {
        ticketTypeId: ticketType.id,
        enrollmentId: enrollment.id,
        status: 'RESERVED',
        updatedAt: dayjs().toDate(),
    }

    const newTicket = await ticketsRepository.create(ticket)

    const successTicket = {
        id: newTicket.id,
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
    createTicketByType,
    getUserTickets
}

export default ticketsService;