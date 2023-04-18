import { notFoundError } from "@/errors"
import paymentsRepository from "@/repositories/payments-repository"

async function getTicketPayment(params: string) {
    let ticketId = Number(params)
    const payment = await paymentsRepository.findFirst(ticketId)
    if (!payment) throw notFoundError()

    return payment
}

const paymentsService = {
    getTicketPayment,
}

export default paymentsService