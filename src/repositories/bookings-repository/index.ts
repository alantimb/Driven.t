import { prisma } from "@/config";

async function findBooking(userId: number) {
    return prisma.booking.findFirst({
        where: {
            userId: userId
        },
        include: {
            Room: true
        }
    })
}

async function createBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data: {
            userId: userId,
            roomId: roomId
        }
    })
}

const bookingsRepository = {
    findBooking,
    createBooking
}

export default bookingsRepository