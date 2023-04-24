import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createHotel() {
    return prisma.hotel.create({
        data: {
            name: faker.name.findName(),
            image: faker.image.image(),
        }
    })
}

export async function createRoom(hotelId: number) {
    return prisma.room.create({
        data: {
            name: faker.name.findName(),
            capacity: faker.datatype.number(),
            hotelId: hotelId
        }
    })
}

export async function createBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data: {
            userId: userId,
            roomId: roomId,
        }
    })
}