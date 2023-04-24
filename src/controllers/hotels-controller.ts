import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
   const { userId } = req;
      
   try {
      const hotels = await hotelsService.getAllHotels(userId);

      return res.status(httpStatus.OK).send(hotels);
   } catch (err) {
      return res.sendStatus(httpStatus.NOT_FOUND)
   }
}

export async function getAllRoomsByHotelId(req: AuthenticatedRequest, res: Response) {
   const hotelId  = +req.params.hotelId;
   const { userId } = req;

   try {
      const hotelRooms = await hotelsService.getAllRooms(hotelId, userId);
  
      return res.status(httpStatus.OK).send(hotelRooms);
   } catch (err) {
      return res.sendStatus(httpStatus.NOT_FOUND)
   } 
}