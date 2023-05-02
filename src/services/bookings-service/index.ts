import { notFoundError } from "@/errors";
import bookingsRepository from "@/repositories/bookings-repository";
import roomsRepository from "@/repositories/rooms-repository";

async function listBooking(userId: number) {
    const booking = await bookingsRepository.findBooking(userId);

    if (!booking) throw notFoundError()

    const room = await roomsRepository.findRoom(booking.roomId)

    const userBooking = {
        id: booking.id,
        Room: room
    }

    return userBooking
}

const bookingsServices = {
    listBooking
};

export default bookingsServices;