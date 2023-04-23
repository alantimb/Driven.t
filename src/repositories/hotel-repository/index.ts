import { prisma } from "@/config";

async function findMany() {
    return prisma.hotel.findMany()
}

async function findFirst(hotelId: number) {
    return prisma.room.findFirst({
        where: {
            id: hotelId
        }
    })
}

const hotelsRepository = {
    findMany,
    findFirst
}

export default hotelsRepository;