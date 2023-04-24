import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import * as jwt from 'jsonwebtoken';
import { createEnrollmentWithAddress, createTicket, createTicketType, createTicketTypeIncludesHotel, createTicketTypeIsRemote, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { TicketStatus } from "@prisma/client";
import { createHotel } from "../factories/hotels-factory";

beforeAll(async () => {
    await init();
});

afterEach(async () => {
    await cleanDb();
});

beforeEach(async () => {
    await cleanDb();
});


const server = supertest(app);

describe('GET /hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id}, process.env.JWT_SECRET);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 when there are no hotels created', async () => {
            const token = await generateValidToken();
            
            const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 and with existing Hotels data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeIncludesHotel(true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
            const hotel = await createHotel();

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: hotel.id,
                        name: hotel.name,
                        image: hotel.image,
                        createdAt: hotel.createdAt.toISOString(),
                        updatedAt: hotel.updatedAt.toISOString()
                    })
                ])
            );
            expect(response.status).toBe(httpStatus.OK); 
        });

        it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
            const token = await generateValidToken();

            const response = await server.get('/tickets').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        })

        it('should respond with status 404 when user doesnt have a ticket yet', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);

            const response = await server.get('/tickets').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        })

        it('should respond with status 402 when user hasnt paid a ticket yet', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED)
            
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 402 when user ticket type is remote', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeIsRemote(true, false);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED)
            
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 402 when user ticket type doesnt includes hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeIncludesHotel(false);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED)
            
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });
    })
})
