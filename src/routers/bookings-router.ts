import { createBookingByRoomId, getBooking } from "@/controllers/bookings-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { roomIdSchema } from "@/schemas/room-schema";
import { Router } from "express";

const bookingsRouter = Router();

bookingsRouter
    .all('/*', authenticateToken)
    .post('/', validateBody(roomIdSchema), createBookingByRoomId)
    .get('/', getBooking)
    

export { bookingsRouter };