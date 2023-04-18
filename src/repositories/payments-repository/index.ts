import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function findFirst(ticketId: number): Promise<Payment> {
    return await prisma.payment.findFirst({
        where: {
            ticketId: ticketId
        }
    })
}

const paymentsRepository = {
    findFirst,
}

export default paymentsRepository;