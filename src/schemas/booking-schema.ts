import { BookingIdParams } from "@/protocols";
import Joi from "joi";

export const bookingIdSchema = Joi.object<BookingIdParams>({
    bookingId: Joi.number().required(),
})