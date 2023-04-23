import hotelsRepository from "@/repositories/hotel-repository";

async function getAllHotels() {
    const hotels = await hotelsRepository.findHotels();

    return hotels;
}

async function getAllRooms(hotelId: number) {
    const hotel = await hotelsRepository.findHotelById(hotelId);

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