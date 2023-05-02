import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createHotel, createRoomWithHotelId, createTicket, createTicketTypeRemote, createTicketTypeWithHotel, createTicketTypeWithNoHotel, createUser } from "../factories";
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from "@prisma/client";
import { createBooking } from "../factories/bookings-factory";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      describe('when token is valid', () => {
        it('should respond with status 404 when user has no booking', async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
    
          const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
          expect(response.status).toBe(httpStatus.NOT_FOUND);
        });
        
        it('should respond with status 200 and a list of hotels', async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const enrollment = await createEnrollmentWithAddress(user);
          const ticketType = await createTicketTypeWithHotel();
          await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
          const hotel = await createHotel()    
          const room = await createRoomWithHotelId(hotel.id)
          const booking = await createBooking(user.id, room.id)
            
          const result = {
            id: booking.id,
            Room: {
                ...booking.Room,               
                createdAt: booking.Room.createdAt.toISOString(),
                updatedAt: booking.Room.updatedAt.toISOString()
            }
          }
          
          const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
          
          expect(response.status).toBe(httpStatus.OK);
          expect(response.body).toEqual({
            ...result
          });
          
        });  
      });
})

describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/booking');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      describe('when token is valid', () => {
        it('should respond  with status 404 when there is no room id', async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const enrollment = await createEnrollmentWithAddress(user);
          const ticketType = await createTicketTypeWithHotel();
          await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

          const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
          
          expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it('shoul respons with status 403 when ticket type is remote', async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const enrollment = await createEnrollmentWithAddress(user);
          const ticketType = await createTicketTypeRemote();
          await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
          const hotel = await createHotel()    
          const room = await createRoomWithHotelId(hotel.id)

          const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId: room.id});
          
          expect(response.status).toBe(httpStatus.FORBIDDEN);
        });

        it('shoul respons with status 403 when ticket type has no hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithNoHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel()    
            const room = await createRoomWithHotelId(hotel.id)
  
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId: room.id});
            
            expect(response.status).toBe(httpStatus.FORBIDDEN);
          });

          it('shoul respons with status 403 when ticket is not paid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithNoHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel()    
            const room = await createRoomWithHotelId(hotel.id)
  
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId: room.id});
            
            expect(response.status).toBe(httpStatus.FORBIDDEN);
          });

          it('shoul respons with status 403 when room is full', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithNoHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
            await createBooking(user.id, room.id);
  
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId: room.id});
            
            expect(response.status).toBe(httpStatus.FORBIDDEN);
          });

          it('shoul respons with status 200 and room id reserved', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithNoHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
  
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId: room.id});
            
            expect(response.status).toBe(httpStatus.FORBIDDEN);
          });
      })
})
