import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";

export async function getAllHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
   const userId = req.body.userId as number;

   try {
      const hotels = await hotelsService.getAllHotels(userId);

      return res.status(httpStatus.OK).send(hotels);
   } catch (err) {
      next(err);
   }
}

export async function getAllRoomsByHotelId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
   const hotelId  = +req.params.hotelId;
   const userId = req.body.userId as number;

   try {
      const hotelRooms = await hotelsService.getAllRooms(hotelId, userId);
  
      return res.status(httpStatus.OK).send(hotelRooms);
   } catch (err) {
      next(err);
   } 
}