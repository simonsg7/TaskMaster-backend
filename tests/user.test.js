import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

let app;
let User;
let usersDetail;
let token;

beforeAll(async () => {
    app = (await import('../app.js')).default;
    User = (await import('../models/Model.user.js')).default;
    usersDetail = (await import('../models/Model.users_details.js')).default;
    
    // Generar un token de prueba
    token = jwt.sign(
        { id: '1', email: 'test@test.com' },
        process.env.JWT_SECRET || 'test_secret'
    );
});

afterAll(async () => {
    // Si estás usando Sequelize, cierra la conexión
    const sequelize = (await import('../dataBase/conexion.js')).default;
    await sequelize.close();
});

jest.mock('../models/Model.user.js');
jest.mock('../models/Model.users_details.js');

describe('User Endpoints', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('GET /users/all', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { id: '1', email: 'user1@example.com', users_detail: { first_name: 'John', last_name: 'Doe' } },
                { id: '2', email: 'user2@example.com', users_detail: { first_name: 'Jane', last_name: 'Doe' } },
            ];

            User.findAll = jest.fn().mockResolvedValue(mockUsers);

            const res = await request(app)
                .get('/users/all')
                .set('Authorization', `Bearer ${token}`); // Añadir el token en el header

            expect(res.statusCode).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(User.findAll).toHaveBeenCalled();
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

            User.findOne = jest.fn().mockResolvedValue(null);
            User.create = jest.fn().mockResolvedValue({ id: '3', email: newUser.email });
            usersDetail.create = jest.fn().mockResolvedValue({});

            const res = await request(app)
                .post('/users/create')
                .send(newUser);

            expect(res.statusCode).toBe(201);
            expect(res.body.ok).toBe(true);
            expect(res.body.message).toBe('User created');
            expect(res.body.response.email).toBe(newUser.email);
            expect(User.findOne).toHaveBeenCalled();
            expect(User.create).toHaveBeenCalled();
            expect(usersDetail.create).toHaveBeenCalled();
        });
    });
});