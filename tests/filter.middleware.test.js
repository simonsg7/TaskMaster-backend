import { buildFilterClause } from '../src/middlewares/filter.middleware.js';

describe('Filter Middleware', () => {
    const allowedFilters = {
        priority: { type: 'exact' },
        state: { type: 'exact' },
        name: { type: 'like' },
        category: { type: 'exact' },
        expectation_date: { type: 'date' },
        is_overdue: { type: 'custom' },
        due_in_days: { type: 'custom' }
    };

    it('should return empty clause with no query parameters', () => {
        const query = {};
        const result = buildFilterClause(query, allowedFilters);
        expect(result).toEqual({});
    });

    it('should build clause for exact match filters', () => {
        const query = { priority: 'Alta' };
        const result = buildFilterClause(query, allowedFilters);
        expect(result).toHaveProperty('priority', 'Alta');
    });

    it('should build clause for name search', () => {
        const query = { name: 'John' };
        const result = buildFilterClause(query, allowedFilters);
        expect(result).toHaveProperty([Symbol.for('or')]);
    });

    it('should handle is_overdue filter', () => {
        const query = { is_overdue: 'true' };
        const result = buildFilterClause(query, allowedFilters);
        expect(result).toHaveProperty('expectation_date');
        expect(result).toHaveProperty('state');
    });

    it('should handle due_in_days filter', () => {
        const query = { due_in_days: '7' };
        const result = buildFilterClause(query, allowedFilters);
        expect(result).toHaveProperty('expectation_date');
    });

    it('should ignore invalid filters', () => {
        const query = { invalid_filter: 'value' };
        const result = buildFilterClause(query, allowedFilters);
        expect(result).toEqual({});
    });
});