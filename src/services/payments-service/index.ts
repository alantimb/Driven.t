import { notFoundError, requestError, unauthorizedError } from "@/errors"
import { CardData } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import paymentsRepository from "@/repositories/payments-repository"
import ticketsRepository from "@/repositories/tickets-repository"
import { Payment } from "@prisma/client";
import dayjs from "dayjs";

async function getTicketPayment(ticketId: number, userId: number): Promise<Payment> {
    const ticket = await ticketsRepository.findTicketById(ticketId);
    if (!ticket) throw notFoundError() 

    const enrollment = await enrollmentRepository.findFirstByUserId(userId)
    if (!enrollment) throw notFoundError()

    if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

    const payment = await paymentsRepository.findFirst(ticketId)

    return payment;
}

export type PaymentProcess = Omit<Payment, 'id'>

async function createPayment(ticketId: number, cardData: CardData, userId: number): Promise<Payment> {
    const ticket = await ticketsRepository.findTicketById(ticketId);
    if (!ticket) throw notFoundError();

    const ticketType = await ticketsRepository.findFirst(ticket.ticketTypeId);
    if (!ticketType) throw notFoundError();

    const enrollment = await enrollmentRepository.findFirstByUserId(userId)
    if (!enrollment) throw notFoundError()

    if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

    const paymentProcess: PaymentProcess = {
            ticketId: ticketId,
            value: ticketType.price,
            cardIssuer: cardData.issuer,
            cardLastDigits: (cardData.number % 10000).toString(),
            createdAt: dayjs().toDate(),
            updatedAt: dayjs().toDate(),
    }

    const payment = await paymentsRepository.create(paymentProcess);

    return payment;
}

const paymentsService = {
    getTicketPayment,
    createPayment
}

export default paymentsService