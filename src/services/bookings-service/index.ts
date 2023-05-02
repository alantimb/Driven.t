import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import bookingsRepository from "@/repositories/bookings-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
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

// Regra de negócio: Apenas usuários com ingresso do tipo presencial, 
// com hospedagem e pago podem fazer reservas.
async function createBooking(userId: number, roomId: number) {
    const enrollment = await enrollmentRepository.findFirstByUserId(userId);
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    const room = await roomsRepository.findRoom(roomId);
    const bookings = await bookingsRepository.findManyBookings(roomId)

    if (!room) throw notFoundError()
    if (!ticket) throw forbiddenError();
    if (ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false || ticket.status !== 'PAID') {
        throw forbiddenError();
    }
    if (bookings.length > room.capacity) throw forbiddenError()

    const booking = await bookingsRepository.createBooking(userId, roomId)

    return booking    
}

const bookingsServices = {
    listBooking,
    createBooking
};

export default bookingsServices;