import { prisma } from "@/config";
import { ProcessPayment } from "@/protocols";
import { Payment } from "@prisma/client";

async function findFirst(ticketId: number) {
    return await prisma.payment.findFirst({
        where: {
            ticketId: ticketId
        }
    })
}

async function create(payment: ProcessPayment) {
    return await prisma.payment.create({
        data: {
            ticketId: payment.ticketId,
            value: payment.value,
            cardIssuer: payment.cardIssuer,
            cardLastDigits: payment.cardLastDigits
        }
    })
}

const paymentsRepository = {
    findFirst,
    create
}

export default paymentsRepository;