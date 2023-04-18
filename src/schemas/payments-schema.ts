import Joi from "joi";

const cardDataSchema = Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.date().required(),
    cvv: Joi.number().required()
})

export const paymentsSchema = Joi.object({
    ticketId: Joi.number().required(),
    cardData: cardDataSchema.required()
})
