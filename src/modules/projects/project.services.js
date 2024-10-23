import Project from '../../../models/Model.projects.js';
import usersDetail from '../../../models/Model.users_details.js';
import Task from '../../../models/Model.tasks.js';
import Users from '../../../models/Model.user.js';
import '../../../dataBase/association.js';

class ProjectServices {

    // Consultar todo
    async getAllProjects (req, res) {
        try {
            const response = await Project.findAll({
                attributes: ["name", "category", "priority", "expectation_date", "state", "description"],
                include: [
                    {
                        model: usersDetail,
                        attributes: ["first_name", "last_name"],
                        through: { attributes: [] }
                    },
                    {
                        model: Task,
                        attributes: ["name", "category", "state"],
                        include: {
                            model: usersDetail,
                            attributes: ["first_name", "last_name"]
                        }
                    },
                ]
            });
            
            res.status(200).json({
                response
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Consultar un proyecto por id
    async getProjectById (req, res) {
        const { id } = req.params;

        try {
            const response = await Project.findOne({
                where: { id },
                attributes: ["name", "category", "priority", "expectation_date", "state", "description"],
                include: [
                    {
                        model: usersDetail,
                        attributes: ["first_name", "last_name"],
                        through: { attributes: [] }
                    },
                    {
                        model: Task,
                        attributes: ["name", "category", "state"],
                        include: {
                            model: usersDetail,
                            attributes: ["first_name", "last_name"]
                        }
                    },
                ]
            });
            
            res.status(200).json({
                response
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Consultar todos los proyectos relacionados a un usuario por users.id
    async getProjectsByUserId (req, res) {
        const { id } = req.params;
        const user = await Users.findOne({
            where: { id }
        });
        
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        try {
            const userDetails = await usersDetail.findOne({
                where: { user_id: id },
                attributes: ["first_name", "last_name"],
                include: [
                    {
                        model: Project,
                        attributes: ["name", "category", "priority", "expectation_date", "state", "description"],
                        through: { attributes: [] }
                    }
                ]
            });
            
            if (!userDetails) {
                return res.status(404).json({ message: "Detalles del usuario no encontrados." });
            }
            
            res.status(200).json([
                userDetails
            ]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Crear Task
    // create(req, res){
    //     const { name, category, priority, expectation_date, state, user_detail_id } = req.body
        
    //     try {
    //         Task.create({ name, category, priority, expectation_date, state, user_detail_id });

    //         res.status(201).json({
    //             ok: true,
    //             status: 201,
    //             message: 'Task created'
    //         });
    //     } catch (error) {
    //         res.status(500).json({
    //             ok: false,
    //             status: 500,
    //             message: 'Error al crear tarea',
    //             error: error.message
    //         });
    //     }
    // }

    // Actualizar Task
    // async update(req, res) {
    //     const { id } = req.params;
    //     const { name, category, priority, expectation_date, state } = req.body;

    //     try {
    //         const task = await Task.findOne({ where: { id } });

    //         if (!task) {
    //             return res.status(404).json({ message: 'Task not found' });
    //         }

    //         await Task.update(
    //             { name, category, priority, expectation_date, state },
    //             { where: { id } }
    //         );

    //         res.status(200).json({
    //             ok: true,
    //             message: 'Task updated successfully'
    //         });
    //     } catch (error) {
    //         res.status(500).json({
    //             ok: false,
    //             message: 'Error updating task',
    //             error: error.message
    //         });
    //     }
    // }

    // Eliminar User
    // async delete(req, res){
    //     const { id } = req.params
    //     const response = await Task.destroy({
    //         where: { id },
    //     });

    //     res.status(200).json({
    //         ok: true,
    //         status: 200,
    //         message: 'Task deleted',
    //         data: response
    //     })
    // }
}

export default ProjectServices;