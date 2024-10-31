import Task from '../../../models/Model.tasks.js';
import usersDetail from '../../../models/Model.users_details.js';
import Users from '../../../models/Model.user.js'
import '../../../dataBase/association.js';
import { buildFilterClause } from '../../middlewares/filter.middleware.js';
import { filterConfigs } from '../../config/filters.config.js';

class TaskServices {

    // Consultar todo
    async getAllTasks(req, res) {
        try {
            const filterClause = buildFilterClause(req.query, filterConfigs.task);

            const response = await Task.findAll({
                where: filterClause,
                attributes: ["name", "category", "priority", "expectation_date", "state"],
                include: {
                    model: usersDetail,
                    attributes: ["first_name", "last_name"]
                }
            });
            
            res.status(200).json({
                ok: true,
                response
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener las tareas',
                error: error.message
            });
        }
    }

    // Consultar todas las tareas de un usuario por id de usuario
    async getAllTasksByUserId(req, res) {
        try {
            const { id } = req.params;
            
            const user = await Users.findOne({
                where: { id }
            });
            
            if (!user) {
                return res.status(404).json({ 
                    ok: false,
                    message: 'User not found' 
                });
            }
            
            const userDetail = await usersDetail.findOne({
                where: { user_id: user.id }
            });
            
            if (!userDetail) {
                return res.status(404).json({ 
                    ok: false,
                    message: 'User detail not found' 
                });
            }
            
            const filterClause = buildFilterClause(req.query, filterConfigs.task);
            filterClause.user_detail_id = userDetail.id;

            const response = await Task.findAll({
                where: filterClause,
                attributes: ["name", "category", "priority", "expectation_date", "state"],
                include: {
                    model: usersDetail,
                    attributes: ["first_name", "last_name"]
                }
            });
            
            res.status(200).json({
                ok: true,
                response
            });
            
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener las tareas',
                error: error.message
            });
        }
    }
    
    // Consultar una sola tarea de un usuario específico
    async getTaskByUserId(req, res) {
        const { id } = req.params;
        const { task_id } = req.body;
    
        const user = await Users.findOne({
            where: { id }
        });
    
        if (!user) {
            res.status(404).json({ message: 'User  not found' });
            return;
        }
    
        const userDetail = await usersDetail.findOne({
            where: { user_id: user.id }
        });
    
        if (!userDetail) {
            res.status(404).json({ message: 'User  detail not found' });
            return;
        }
    
        const task = await Task.findOne({
            where: { id: task_id, user_detail_id: userDetail.id },
            attributes: [ "name", "category", "priority", "expectation_date", "state" ],
            include: {
                model: usersDetail,
                attributes: [ "first_name", "last_name" ]
            }
        });
    
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
    
        res.status(200).json({
            task
        });
    }

    // Crear Task
    create(req, res){
        const { name, category, priority, expectation_date, state, user_detail_id } = req.body
        
        try {
            Task.create({ name, category, priority, expectation_date, state, user_detail_id });

            res.status(201).json({
                ok: true,
                status: 201,
                message: 'Task created'
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                status: 500,
                message: 'Error al crear tarea',
                error: error.message
            });
        }
    }

    // Actualizar Task
    async update(req, res) {
        const { id } = req.params;
        const { name, category, priority, expectation_date, state } = req.body;

        try {
            const task = await Task.findOne({ where: { id } });

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            await Task.update(
                { name, category, priority, expectation_date, state },
                { where: { id } }
            );

            res.status(200).json({
                ok: true,
                message: 'Task updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                message: 'Error updating task',
                error: error.message
            });
        }
    }

    // Eliminar User
    async delete(req, res){
        const { id } = req.params
        const response = await Task.destroy({
            where: { id },
        });

        res.status(200).json({
            ok: true,
            status: 200,
            message: 'Task deleted',
            data: response
        })
    }
}

export default TaskServices;