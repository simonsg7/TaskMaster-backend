export const filterConfigs = {
    task: {
        name: { type: 'like' },
        category: { type: 'exact' },
        priority: { type: 'exact' },
        state: { type: 'exact' },
        created_at_start: { type: 'date' },
        created_at_end: { type: 'date' },
        expectation_date_start: { type: 'date' },
        expectation_date_end: { type: 'date' },
        is_overdue: { type: 'custom' },
        due_in_days: { type: 'custom' },
        due_until: { type: 'date' },
        due_from: { type: 'date' }
    },
    project: {
        name: { type: 'like' },
        category: { type: 'exact' },
        priority: { type: 'exact' },
        state: { type: 'exact' },
        created_at_start: { type: 'date' },
        created_at_end: { type: 'date' },
        expectation_date_start: { type: 'date' },
        expectation_date_end: { type: 'date' },
        is_overdue: { type: 'custom' },
        due_in_days: { type: 'custom' },
        due_until: { type: 'date' },
        due_from: { type: 'date' }
    },
    user: {
        email: { type: 'like' },
        name: { type: 'like' },
    }
};