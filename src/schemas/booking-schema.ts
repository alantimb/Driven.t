import { BookingIdParams } from "@/protocols";
import Joi from "joi";

export const roomIdSchema = Joi.object<BookingIdParams>({
    bookingId: Joi.number().required()
})