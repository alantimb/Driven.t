import { notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotel-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import httpStatus from "http-status";

async function getAllHotels(userId: number) {
    const isEnrollmentExists = await ticketsRepository.findUnique(userId);
    if (!isEnrollmentExists) throw notFoundError();
    
    const isTicketExists = await ticketsRepository.findTicketByEnrollment(isEnrollmentExists.id);
    if (!isTicketExists) throw notFoundError();

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

// async function itExists(userId: number) {
//     console.log(userId + " oi")

//     try {
//         const isEnrollmentExists = await ticketsRepository.findUnique(userId);
//         if (!isEnrollmentExists) throw notFoundError();
    
//         const isTicketExists = await ticketsRepository.findTicketByEnrollment(isEnrollmentExists.id);
//         if (!isTicketExists) throw notFoundError();
//     } catch (err) {
//         return httpStatus.NOT_FOUND
//     }
// }

const hotelsService = {
    getAllHotels,
    getAllRooms
}

export default hotelsService;