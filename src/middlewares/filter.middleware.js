import { Op } from 'sequelize';

export const filterClause = (query, allowedFilters) => {
    try {
        const clause = {};
        
        Object.entries(query).forEach(([key, value]) => {
            if (allowedFilters[key]) {
                switch (allowedFilters[key].type) {
                    case 'like':
                        if (key === 'name'){
                            clause[Op.or] = [
                                {'$users_detail.first_name$': { [Op.like]: `%${value}%` }},
                                {'$users_detail.last_name$': { [Op.like]: `%${value}%` }}
                            ];
                        } else {
                            clause[key] = { [Op.like]: `%${value}%` };
                        }
                        break;
                        
                    case 'exact':
                        clause[key] = value;
                        break;
                        
                    case 'date':
                        if (key === 'due_until') {
                            clause.expectation_date = {
                                ...(clause.expectation_date || {}),
                                [Op.lte]: new Date(value)
                            };
                        } else if (key === 'due_from') {
                            clause.expectation_date = {
                                ...(clause.expectation_date || {}),
                                [Op.gte]: new Date(value)
                            };
                        } 
                        else if (key.includes('_start')) {
                            const endKey = key.replace('_start', '');
                            clause[endKey] = {
                                ...(clause[endKey] || {}),
                                [Op.gte]: value
                            };
                        } else if (key.includes('_end')) {
                            const startKey = key.replace('_end', '');
                            clause[startKey] = {
                                ...(clause[startKey] || {}),
                                [Op.lte]: value
                            };
                        }
                        break;
                        
                    case 'custom':
                        if (key === 'is_overdue') {
                            Object.assign(clause, {
                                expectation_date: { [Op.lt]: new Date() },
                                state: { [Op.ne]: 'Completa' }
                            });
                        } else if (key === 'due_in_days' && value) {
                            const days = parseInt(value, 10);
                            Object.assign(clause, {
                                    expectation_date: {
                                        [Op.between]: [
                                            new Date(),
                                            new Date(Date.now() + days * 24 * 60 * 60 * 1000)
                                        ]
                                    }
                            });
                        }
                        break;
                }
            }
        });

        return clause;
        
    } catch (error) {
        console.error('Error building filter clause:', error);
        throw new Error('Invalid filter parameters');
    }
};