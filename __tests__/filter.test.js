import request from 'supertest';
import app from '../app.js';
import { buildFilterClause } from '../src/middlewares/filter.middleware.js';
import { filterConfigs } from '../src/config/filters.config.js';

const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMwNWEyNWJlLWRlODEtNDgzOS05NGRiLTc0ZjE5Nzg2ZmFkMiIsImVtYWlsIjoiamltZW5hQGVtYWlsLmNvbSIsImlhdCI6MTczMDE0MjQ3MX0.7mrHlqwydVJlK9Pgofu5Mzj2MQR630k6t40vcg7p4Qg';

describe('Filter System Tests', () => {
    
    describe('buildFilterClause Middleware', () => {
        test('should create correct filter for text search', () => {
            const query = { name: 'test' };
            const filters = {
                name: { type: 'like' }
            };
            
            const result = buildFilterClause(query, filters);
            
            expect(result).toHaveProperty('name');
            expect(result.name).toHaveProperty('Op.like', '%test%');
        });

        test('should create correct date range filter', () => {
            const query = {
                due_from: '2024-01-01',
                due_until: '2024-12-31'
            };
            
            const result = buildFilterClause(query, filterConfigs.task);
            
            expect(result).toHaveProperty('expectation_date');
            expect(result.expectation_date).toHaveProperty('Op.gte');
            expect(result.expectation_date).toHaveProperty('Op.lte');
        });
    });

    // Test de endpoints
    describe('API Endpoints with Filters', () => {
        // Test para el endpoint de tareas
        test('GET /tasks/all should filter tasks correctly', async () => {
            const response = await request(app)
                .get('/tasks/all')
                .query({ 
                    state: 'Pendiente',
                    category: 'Trabajo' 
                })
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('ok', true);
            expect(Array.isArray(response.body.response)).toBe(true);
            
            // Verificar que los resultados cumplen con los filtros
            response.body.response.forEach(task => {
                expect(task.state).toBe('Pendiente');
                expect(task.category).toBe('Trabajo');
            });
        });

        // Test para el endpoint de proyectos
        test('GET /projects/all should filter projects correctly', async () => {
            const response = await request(app)
                .get('/projects/all')
                .query({ 
                    priority: 'Alta',
                    due_in_days: '7'
                })
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.response)).toBe(true);
        });
    });
});