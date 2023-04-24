import { ApplicationError } from "@/protocols";

export function paymentRequiredError(): ApplicationError {
    return {
        name: 'PaymentRequiredError',
        message: 'Payment has not yet been made!'
    }
}