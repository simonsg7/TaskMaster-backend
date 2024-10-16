// import bcrypt from 'bcryptjs';
// import sequelize from '../../../dataBase/conexion.js';
import Task from '../../../models/Model.tasks.js';
import usersDetail from '../../../models/Model.users_details.js';
import Users from '../../../models/Model.user.js'
import '../../../dataBase/association.js';

class TaskServices {

    // Consultar todo
    async getAllTasks(req, res){
        const response = await Task.findAll({
            attributes: [ "name", "category", "priority", "expectation_date", "state" ],
            include: {
                model: usersDetail,
                attributes: [ "first_name", "last_name" ]
            }
        });
        
        res.status(200).json({
            response
        })
    }

    // Consultar todas las tareas de un usuario por id de usuario
    async getAllTasksByUserId(req, res) {
        const { id } = req.params;
        const user = await Users.findOne({
            where: { id }
        });
        
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        
        const userDetail = await usersDetail.findOne({
            where: { user_id: user.id }
        });
        
        if (!userDetail) { res.status(404).json({ message: 'User detail not found' });
            return;
        }
        
        const response = await Task.findAll({
            where: { user_detail_id: userDetail.id },
            attributes: [ "name", "category", "priority", "expectation_date", "state" ],
            include: {
                model: usersDetail,
                attributes: [ "first_name", "last_name" ]
            }
        });
        
        res.status(200).json({
            response
        })
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

    // // Actualizar User
    // async update(req, res) {
    //     const { id } = req.params;
    //     const { email, password, first_name, last_name, type_document, number_document, phone } = req.body;

    //     try {
    //         const user = await User.findByPk(id);
    //         if (!user) {
    //             res.status(404).json({
    //                 ok: false,
    //                 status: 404,
    //                 message: 'User not found',
    //             });
    //             return;
    //         }

    //         const transaction = await sequelize.transaction();

    //         try {
    //             if (email) {
    //                 user.email = email;
    //             }
    //             if (password) {
    //                 const salt = bcrypt.genSaltSync();
    //                 const passwordHash = bcrypt.hashSync(password, salt);
    //                 user.password = passwordHash;
    //             }

    //             await user.save({ transaction });

    //             const userDetail = await usersDetail.findOne({ where: { user_id: id } });
    //             if (userDetail) {
    //                 if (first_name) {
    //                     userDetail.first_name = first_name;
    //                 }
    //                 if (last_name) {
    //                     userDetail.last_name = last_name;
    //                 }
    //                 if (type_document) {
    //                     userDetail.type_document = type_document;
    //                 }
    //                 if (number_document) {
    //                     userDetail.number_document = number_document;
    //                 }
    //                 if (phone) {
    //                     userDetail.phone = phone;
    //                 }
    //                 await userDetail.save({ transaction });
    //             }

    //             await transaction.commit();

    //             res.status(200).json({
    //                 ok: true,
    //                 status: 200,
    //                 message: 'User updated',
    //                 response: user,
    //             });
    //         } catch (error) {
    //             await transaction.rollback();
    //             res.status(500).json({
    //                 ok: false,
    //                 status: 500,
    //                 message: 'Error al actualizar usuario',
    //                 error: error.message,
    //             });
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({
    //             ok: false,
    //             status: 500,
    //             message: 'Error al actualizar usuario',
    //             error: error.message,
    //         });
    //     }
    // }

    // // Eliminar User
    // async delete(req, res){
    //     const { id } = req.params
    //     const response = await User.destroy({
    //         where: {
    //             id
    //         },
    //     });

    //     res.status(200).json({
    //         ok: true,
    //         status: 200,
    //         message: 'User deleted',
    //         data: response
    //     })
    // }
}

export default TaskServices;