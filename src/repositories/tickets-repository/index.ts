import { prisma } from "@/config";

export async function findMany() {
    return prisma.ticketType.findMany();
}

const ticketsRepository = {
    findMany,
}

export default ticketsRepository;