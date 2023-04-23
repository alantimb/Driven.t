import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";

export async function getAllHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
 try {
    const hotels = await hotelsService.getAllHotels();

    return res.status(httpStatus.OK).send(hotels);
 } catch (err) {
    next(err);
 } 
}

export async function getAllRoomsByHotelId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
   const hotelId = +req.params;

   try {
      const hotelRooms = await hotelsService.getAllRooms(hotelId);
  
      return res.status(httpStatus.OK).send(hotelRooms);
   } catch (err) {
      next(err);
   } 
}