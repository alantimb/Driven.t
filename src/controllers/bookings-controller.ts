import { AuthenticatedRequest } from "@/middlewares";
import bookingsServices from "@/services/bookings-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    try {
        const booking = await bookingsServices.listBooking(userId);

        return res.status(httpStatus.OK).send(booking)
    } catch (error) {
        if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND)
        
        return res.status(httpStatus.NOT_FOUND)
    }
}

export async function createBookingByRoomId(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body as { roomId: number };
    
    try {
        console.log(userId)

        const bookingId = await bookingsServices.createBooking(userId, roomId);

        return res.status(httpStatus.OK).send(bookingId);
    } catch (error) {
        if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND)
        if (error.name === "ForbiddenError") return res.status(httpStatus.FORBIDDEN)

        return res.status(httpStatus.FORBIDDEN)
    }
}