import hotelsRepository from "@/repositories/hotel-repository";

async function getAllHotels() {
    const hotels = await hotelsRepository.findMany();

    return hotels;
}

async function getAllRooms(hotelId: number) {
    const rooms = await hotelsRepository.findFirst(hotelId)

    return rooms
}

const hotelsService = {
    getAllHotels,
    getAllRooms
}

export default hotelsService;