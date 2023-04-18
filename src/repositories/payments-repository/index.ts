import { prisma } from "@/config";
import { PaymentProcess } from "@/services/payments-service";
import { Payment } from "@prisma/client";

async function findFirst(ticketId: number): Promise<Payment> {
    return await prisma.payment.findFirst({
        where: {
            ticketId: ticketId
        }
    })
}

async function create(payment: PaymentProcess): Promise<Payment> {
    return await prisma.payment.create({
        data: payment
    })
}

const paymentsRepository = {
    findFirst,
    create
}

export default paymentsRepository;