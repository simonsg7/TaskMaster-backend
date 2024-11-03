import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import User from '../models/Model.user.js';
import usersDetail from '../models/Model.users_details.js';

// Mock de los modelos de Sequelize
jest.mock('../models/Model.user.js');
jest.mock('../models/Model.users_details.js');

describe('User Endpoints', () => {
    beforeEach(() => {
        // Limpia todos los mocks antes de cada prueba
        jest.clearAllMocks();
    });

    describe('GET /users/all', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { id: '1', email: 'user1@example.com', users_detail: { first_name: 'John', last_name: 'Doe' } },
                { id: '2', email: 'user2@example.com', users_detail: { first_name: 'Jane', last_name: 'Doe' } },
            ];

            User.findAll.mockResolvedValue(mockUsers);

            const res = await request(app).get('/users/all');

            expect(res.statusCode).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.response).toHaveLength(2);
            expect(res.body.response[0].email).toBe('user1@example.com');
        });

        it('should handle errors', async () => {
            User.findAll.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/users/all');

            expect(res.statusCode).toBe(500);
            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Error al obtener usuarios');
        });
    });

    describe('POST /users/create', () => {
        it('should create a new user', async () => {
            const newUser = {
                email: 'newuser@example.com',
                password: 'password123',
                first_name: 'New',
                last_name: 'User',
                type_document: 'C.C',
                number_document: '1234567890',
                phone: '1234567890'
            };

            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({ id: '3', email: newUser.email });
            usersDetail.create.mockResolvedValue({});

            const res = await request(app)
                .post('/users/create')
                .send(newUser);

            expect(res.statusCode).toBe(201);
            expect(res.body.ok).toBe(true);
            expect(res.body.message).toBe('User created');
            expect(res.body.response.email).toBe(newUser.email);
        });

        it('should return error if user already exists', async () => {
            const existingUser = {
                email: 'existing@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue({ id: '4', email: existingUser.email });

            const res = await request(app)
                .post('/users/create')
                .send(existingUser);

            expect(res.statusCode).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.message).toBe('El usuario ya esta registrado');
        });
    });

});