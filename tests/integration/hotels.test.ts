import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import * as jwt from 'jsonwebtoken';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from "../factories";
import { generateValidToken } from "../helpers";
import { TicketStatus } from "@prisma/client";
import { createHotel } from "../factories/hotels-factory";

beforeAll(async () => {
    await init();
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
        it('should respond with empty array when there are no hotels created', async () => {
            const token = await generateValidToken();
            
            const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                "message": "No result for this search!",
            })
        });

        it('should respond with status 200 and with existing Hotels data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
            const hotel = await createHotel();

            const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK);
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
            ) 
        });

        it('should respond with status 404 when user doesnt have enrollment yet', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const ticketType = await createTicketType();

            const response = await server
                .post('/tickets')
                .set('Authorization', `Bearer ${token}`)
                .send({ ticketTypeId: ticketType.id });

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        })
    })
})
