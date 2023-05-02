import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import bookingsRepository from "@/repositories/bookings-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import roomsRepository from "@/repositories/rooms-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function listBooking(userId: number) {
    const booking = await bookingsRepository.findBooking(userId);
    if (!booking) throw notFoundError()

    const userBooking = {
        id: booking.id,
        Room: booking.Room
    }

    return userBooking;
}

async function createBooking(userId: number, roomId: number) {
    const enrollment = await enrollmentRepository.findFirstByUserId(userId);
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    const room = await roomsRepository.findRoom(roomId);
    const bookings = await bookingsRepository.findManyBookings(roomId);
    console.log(ticket, room, bookings)
    if (!room) {
        console.log("oiii");
        throw notFoundError();
    }
    if (!ticket) throw forbiddenError();
    if (ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false || ticket.status !== 'PAID') {
        console.log("oiii")
        throw forbiddenError();
    }
    
    if (bookings.length > room.capacity) throw forbiddenError()
    
    const booking = await bookingsRepository.createBooking(userId, roomId);
    console.log(booking)
    return booking;
}

const bookingsServices = {
    listBooking,
    createBooking
};

export default bookingsServices;