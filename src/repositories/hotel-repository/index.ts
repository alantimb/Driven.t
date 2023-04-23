import { prisma } from "@/config";

async function findHotels() {
    return prisma.hotel.findMany()
}

async function findHotelById(hotelId: number) {
    return prisma.hotel.findFirst({
        where: {
            id: hotelId
        }
    })
}

async function findHotelRooms(hotelId: number) {
    return prisma.room.findMany({
        where: {
            hotelId: hotelId
        }
    })
}

const hotelsRepository = {
    findHotels,
    findHotelById,
    findHotelRooms
}

export default hotelsRepository;