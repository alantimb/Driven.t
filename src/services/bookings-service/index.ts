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
    const room = await roomsRepository.findRoomAndBookings(roomId);
    const bookings = await bookingsRepository.findManyBookings(roomId);
    
    if (!ticket) throw forbiddenError();
    if (ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false || ticket.status !== 'PAID') {
        throw forbiddenError();
    }
    
    if (!room) throw notFoundError();
    if (room.capacity <= room.Booking.length) throw forbiddenError()
    const booking = await bookingsRepository.createBooking(userId, roomId);
    
    return booking;
}

async function updateBooking(userId: number, bookingId: number, roomId: number) {
    const room = await roomsRepository.findRoomAndBookings(roomId); 
    if (!room) throw notFoundError();
    if (room.capacity <= room.Booking.length){ 
        throw forbiddenError()
    }

    const booking = await bookingsRepository.findUserBooking(userId, roomId)
    if (!booking) throw forbiddenError();

    const newBooking = await bookingsRepository.updateBooking(userId, bookingId, roomId);

    return newBooking;
}

const bookingsServices = {
    listBooking,
    createBooking,
    updateBooking
};

export default bookingsServices;