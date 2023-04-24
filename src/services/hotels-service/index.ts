import { notFoundError } from "@/errors";
import { paymentRequiredError } from "@/errors/payment-error";
import hotelsRepository from "@/repositories/hotel-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getAllHotels(userId: number) {
    const isEnrollmentExists = await ticketsRepository.findUnique(userId);
    if (!isEnrollmentExists) throw notFoundError();
    
    const isTicketExists = await ticketsRepository.findTicketByEnrollment(isEnrollmentExists.id);
    if (!isTicketExists) throw notFoundError();
    if (isTicketExists.status !== 'PAID') throw paymentRequiredError();

    const ticketType = await ticketsRepository.findFirst(isTicketExists.ticketTypeId)
    if (ticketType.isRemote === true || ticketType.includesHotel === false) throw paymentRequiredError()

    const hotels = await hotelsRepository.findHotels();
    if (!hotels) throw notFoundError();

    return hotels;
}

async function getAllRooms(hotelId: number, userId: number) {
    const isEnrollmentExists = await ticketsRepository.findUnique(userId);
    if (!isEnrollmentExists) throw notFoundError();
    
    const isTicketExists = await ticketsRepository.findTicketByEnrollment(isEnrollmentExists.id);
    if (!isTicketExists) throw notFoundError();

    const hotel = await hotelsRepository.findHotelById(hotelId);
    if (!hotel) throw notFoundError();

    const rooms = await hotelsRepository.findHotelRooms(hotelId);
    
    const hotelRooms = {
      id: hotel.id,
      name: hotel.name,
      image: hotel.image,
      createdAt: hotel.createdAt.toISOString(),
      updatedAt: hotel.updatedAt.toISOString(),
      Rooms: rooms
    };

    return hotelRooms;
}

const hotelsService = {
    getAllHotels,
    getAllRooms
}

export default hotelsService;