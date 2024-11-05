import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

let app;
let Project;
let UserProject;
let sequelize;
let token;

jest.mock('../models/Model.users_details.js');
jest.mock('../models/Model.tasks.js');
jest.mock('../models/Model.usersDetails_projects.js');

beforeAll(async () => {
    app = (await import('../app.js')).default;
    Project = (await import('../models/Model.projects.js')).default;
    UserProject = (await import('../models/Model.usersDetails_projects.js')).default;
    sequelize = (await import('../dataBase/conexion.js')).default;
    
    token = jwt.sign(
        { id: '1', email: 'test@test.com' },
        process.env.JWT_SECRET || 'test_secret'
    );
});

afterAll(async () => {
    await sequelize.close();
});

describe('Project Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /projects/all', () => {
        it('should get all projects', async () => {
            const mockProjects = [
                {
                    name: "Proyecto test",
                    category: "Trabajo",
                    priority: "Alta",
                    expectation_date: "2024-12-31",
                    state: "Pendiente",
                    description: "Descripción test",
                    users_details: [{
                        first_name: "Test",
                        last_name: "User"
                    }],
                    tasks: [{
                        name: "Tarea test",
                        category: "Trabajo",
                        state: "Pendiente"
                    }]
                }
            ];

            const findAllSpy = jest.spyOn(Project, 'findAll').mockResolvedValue(mockProjects);

            const response = await request(app)
                .get('/projects/all')
                .set('Authorization', `Bearer ${token}`);

            expect(findAllSpy).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.response)).toBe(true);
        });
    });

    describe('POST /projects/create', () => {
        it('should create a new project', async () => {
            const newProject = {
                name: "Nuevo proyecto",
                category: "Trabajo",
                priority: "Alta",
                expectation_date: "2024-12-31",
                state: "Pendiente",
                description: "Descripción test",
                user_detail_id: "1"
            };

            // Mock para la transacción
            const mockTransaction = {
                commit: jest.fn(),
                rollback: jest.fn()
            };
            jest.spyOn(sequelize, 'transaction').mockResolvedValue(mockTransaction);

            // Mock para Project.create
            const createdProject = { 
                id: '123', 
                ...newProject 
            };
            const createProjectSpy = jest.spyOn(Project, 'create')
                .mockResolvedValue(createdProject);

            // Mock para UserProject.create
            const createUserProjectSpy = jest.spyOn(UserProject, 'create')
                .mockResolvedValue({ 
                    id: '456', 
                    user_detail_id: newProject.user_detail_id, 
                    project_id: createdProject.id 
                });

            const response = await request(app)
                .post('/projects/create')
                .set('Authorization', `Bearer ${token}`)
                .send(newProject);

            expect(createProjectSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: newProject.name,
                    category: newProject.category,
                    priority: newProject.priority,
                    expectation_date: newProject.expectation_date,
                    state: newProject.state,
                    description: newProject.description
                }),
                expect.objectContaining({ transaction: mockTransaction })
            );

            expect(createUserProjectSpy).toHaveBeenCalled();
            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(response.status).toBe(201);
            expect(response.body.ok).toBe(true);
            expect(response.body.message).toBe('Project created');
        });
    });
});