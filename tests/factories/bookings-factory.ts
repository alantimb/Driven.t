import { prisma } from "@/config";
import { Booking, Room } from "@prisma/client";

export async function createBooking(userId: number, roomId: number): Promise<Booking & { Room: Room }> {
    return prisma.booking.create({
        data: {
            userId,
            roomId
        }, include: {
            Room: true
        }
    })
}   