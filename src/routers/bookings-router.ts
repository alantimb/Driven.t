import { createBookingByRoomId, getBooking, updateBooking } from "@/controllers/bookings-controller";
import { authenticateToken, validateBody, validateParams } from "@/middlewares";
import { bookingIdSchema } from "@/schemas/booking-schema";
import { roomIdSchema } from "@/schemas/room-schema";
import { Router } from "express";

const bookingsRouter = Router();

bookingsRouter
    .all('/*', authenticateToken)
    .post('/', validateBody(roomIdSchema), createBookingByRoomId)
    .get('/', getBooking)
    .put('/:bookingId', validateParams(bookingIdSchema), validateBody(roomIdSchema), updateBooking)

export { bookingsRouter };