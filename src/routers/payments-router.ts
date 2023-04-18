import { getTicketPayment, paymentProcess } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { paymentsSchema } from "@/schemas/payments-schema";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter
    .all('/*', authenticateToken)
    .get('/', getTicketPayment)
    .post('/process', validateBody(paymentsSchema), paymentProcess)

export default paymentsRouter;

    
