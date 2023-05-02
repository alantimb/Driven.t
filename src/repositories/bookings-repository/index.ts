import { prisma } from "@/config";
import { Booking } from "@prisma/client";

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

async function findManyBookings(roomId: number) {
    return prisma.booking.findMany({
        where: {
            id: roomId
        }
    })
}

async function findUserBooking(userId: number) {
    return await prisma.booking.findFirst({
        where: {
            userId
        }
    })
}

async function createBooking(userId: number, roomId: number) {
    return await prisma.booking.create({
        data: {
            userId: userId,
            roomId: roomId
        }
    })
}

async function updateBooking(bookingId: number, roomId: number): Promise<Booking> {
    return prisma.booking.update({
        where: {
            id: bookingId
        },
        data: {
            roomId: roomId
        }
    })
}

const bookingsRepository = {
    findBooking,
    createBooking,
    findManyBookings,
    findUserBooking,
    updateBooking
}

export default bookingsRepository