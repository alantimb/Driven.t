import { prisma } from "@/config";

async function findFirst(params: number) {
    return await prisma.payment.findFirst({
        where: {
            ticketId: params
        }
    })
}

const paymentsRepository = {
    findFirst,
}

export default paymentsRepository;