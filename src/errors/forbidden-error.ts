import { ApplicationError } from "@/protocols";

export function forbiddenError(): ApplicationError {
    return {
        name: 'Forbidden',
        message: "you don't have permission to access this resource"
    }
}