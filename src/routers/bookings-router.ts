import { createBookingByRoomId, getBooking } from "@/controllers/bookings-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { roomIdSchema } from "@/schemas/room-schema";
import { Router } from "express";

const bookingsRouter = Router();

bookingsRouter
    .all('/*', authenticateToken)
    .get('/', getBooking)
    .post('/', validateBody(roomIdSchema), createBookingByRoomId)

export { bookingsRouter };