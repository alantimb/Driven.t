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
        if (error.name === "NotFoundError") {
            return res.status(httpStatus.NOT_FOUND).send({
                message: error.message,
            })
        }
        
        return res.status(httpStatus.NOT_FOUND).send({
            message: error.message,
        })
    }
}

export async function createBookingByRoomId(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body as { roomId: number };
    
    try {
        const booking = await bookingsServices.createBooking(userId, roomId);

        return res.status(httpStatus.OK).send({bookingId: booking.id});
    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.status(httpStatus.NOT_FOUND).send({
                message: error.message,
            })
        }
        if (error.name === "ForbiddenError") {
            return res.status(httpStatus.FORBIDDEN).send({
                message: error.message,
            })
        }
        
        return res.sendStatus(httpStatus.FORBIDDEN)
    }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const bookingId  = +req.params;
    const { roomId } = req.body as { roomId: number };

    try {
        const booking = await bookingsServices.updateBooking(userId, bookingId, roomId)

        return res.status(httpStatus.OK).send({bookingId: booking.id})
    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.status(httpStatus.NOT_FOUND).send({
                message: error.message,
            })
        }
        if (error.name === "ForbiddenError") {
            return res.status(httpStatus.FORBIDDEN).send({
                message: error.message,
            })
        }
        
        return res.sendStatus(httpStatus.FORBIDDEN)
    }
}