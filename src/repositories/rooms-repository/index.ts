import { prisma } from "@/config"

async function findRoomAndBookings(roomId: number) {
    return prisma.room.findUnique({
        where: {
            id: roomId
        },
        include: {
            Booking: true
        }
    })
}

const roomsRepository = {
    findRoomAndBookings
}

export default roomsRepository