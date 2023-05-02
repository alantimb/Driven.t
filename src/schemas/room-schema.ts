import { RoomIdParams } from "@/protocols";
import Joi from "joi";

export const roomIdSchema = Joi.object<RoomIdParams>({
    roomId: Joi.number().required()
})