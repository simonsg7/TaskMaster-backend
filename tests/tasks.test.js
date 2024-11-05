import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

let app;
let Task;
let usersDetail;
let token;

// No necesitamos mockear todo el módulo aquí
jest.mock('../models/Model.users_details.js');

beforeAll(async () => {
    app = (await import('../app.js')).default;
    Task = (await import('../models/Model.tasks.js')).default;
    usersDetail = (await import('../models/Model.users_details.js')).default;
    
    token = jwt.sign(
        { id: '1', email: 'test@test.com' },
        process.env.JWT_SECRET || 'test_secret'
    );
});

afterAll(async () => {
    const sequelize = (await import('../dataBase/conexion.js')).default;
    await sequelize.close();
});

describe('Task Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /tasks/all', () => {
        it('should get all tasks', async () => {
            const mockTasks = [
                {
                    name: "Tarea test",
                    category: "Trabajo",
                    priority: "Alta",
                    expectation_date: "2024-12-31",
                    state: "Pendiente",
                    users_detail: {
                        first_name: "Test",
                        last_name: "User"
                    }
                }
            ];

            // Usar spyOn en lugar de mock directo
            const findAllSpy = jest.spyOn(Task, 'findAll').mockResolvedValue(mockTasks);

            const response = await request(app)
                .get('/tasks/all')
                .set('Authorization', `Bearer ${token}`);

            expect(findAllSpy).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(Array.isArray(response.body.response)).toBe(true);
        });
    });

    describe('POST /tasks/create', () => {
        it('should create a new task', async () => {
            const newTask = {
                name: "Nueva tarea",
                category: "Trabajo",
                priority: "Alta",
                expectation_date: "2024-12-31",
                state: "Pendiente",
                user_detail_id: "1"
            };

            // Usar spyOn en lugar de mock directo
            const createSpy = jest.spyOn(Task, 'create').mockResolvedValue(newTask);

            const response = await request(app)
                .post('/tasks/create')
                .set('Authorization', `Bearer ${token}`)
                .send(newTask);

            expect(createSpy).toHaveBeenCalled();
            expect(response.status).toBe(201);
            expect(response.body.ok).toBe(true);
            expect(response.body.message).toBe('Task created');
        });
    });
});