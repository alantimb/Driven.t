import { CreateTicketType } from "@/services/tickets-service";
import Joi from "joi";

export const createTicketSchema = Joi.object<CreateTicketType>({
    ticketTypeId: Joi.number().required(),
})