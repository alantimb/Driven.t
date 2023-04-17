import { notFoundError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";
import { TicketType } from "@prisma/client";

export async function getAllTicketTypes(): Promise<TicketType[]> {
    const getAllTicketTypes = await ticketsRepository.findMany();

    if (getAllTicketTypes.length !== 0) {
        return getAllTicketTypes;
    } else if (getAllTicketTypes.length === 0) {
        return getAllTicketTypes;
    } else if (!getAllTicketTypes) {
        throw notFoundError();
    }
}

const ticketsService = {
    getAllTicketTypes,
}

export default ticketsService;