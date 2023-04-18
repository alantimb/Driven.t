import { notFoundError, unauthorizedError } from "@/errors"
import enrollmentRepository from "@/repositories/enrollment-repository";
import paymentsRepository from "@/repositories/payments-repository"
import ticketsRepository from "@/repositories/tickets-repository"
import { Payment } from "@prisma/client";

async function getTicketPayment(ticketId: number, userId: number): Promise<Payment> {
    const ticket = await ticketsRepository.findTicketById(ticketId);
    if (!ticket) throw notFoundError() 

    const enrollment = await enrollmentRepository.findFirstByUserId(userId)
    if (!enrollment) throw notFoundError()

    if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

    const payment = await paymentsRepository.findFirst(ticketId)

    return payment;
}

const paymentsService = {
    getTicketPayment,
}

export default paymentsService