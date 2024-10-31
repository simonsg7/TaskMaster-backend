import sequelize from '../../../dataBase/conexion.js';
import '../../../dataBase/association.js';
import Users from '../../../models/Model.user.js';
import usersDetail from '../../../models/Model.users_details.js';
import Task from '../../../models/Model.tasks.js';
import Project from '../../../models/Model.projects.js';
import UserProject from '../../../models/Model.usersDetails_projects.js';
import { buildFilterClause } from '../../middlewares/filter.middleware.js';
import { filterConfigs } from '../../config/filters.config.js';

class ProjectServices {

    // Consultar todos los proyectos
    async getAllProjects (req, res) {
        try {
            const filterClause = buildFilterClause(req.query, filterConfigs.project);

            const response = await Project.findAll({
                where: filterClause,
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
            res.status(500).json({
                message: 'Error al obtener los proyectos',
                error: error.message
            });
        }
    }
    
    // Consultar todos los proyectos relacionados a un usuario por users.id
    async getProjectsByUserId (req, res) {
        try {
            const { id } = req.params;

            const user = await Users.findOne({
                where: { id }
            });
        
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const filterClause = buildFilterClause(req.query, filterConfigs.project);

            const userDetails = await usersDetail.findOne({
                where: filterClause,
                attributes: ["first_name", "last_name"],
                include: [
                    {
                        model: Project,
                        attributes: ["name", "category", "priority", "expectation_date", "state", "description"],
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
            
            if (!userDetails) {
                return res.status(404).json({ message: "Detalles del usuario no encontrados." });
            }
            
            res.status(200).json([
                userDetails
            ]);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener los proyectos del usuario',
                error: error.message
            });
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


    // Crear proyecto
    async create(req, res) {
        const { name, category, priority, expectation_date, state, description, user_detail_id } = req.body;

        if (!user_detail_id) {
            return res.status(400).json({
                ok: false,
                status: 400,
                message: 'user detail es requerido'
            });
        }

        const transaction = await sequelize.transaction();

        try {
            const newProject = await Project.create({ name, category, priority, expectation_date, state, description }, { transaction });

            await UserProject.create({  // Asociar el proyecto con el usuario en la tabla intermedia
                user_detail_id: user_detail_id,
                project_id: newProject.id
            }, { transaction });

            await transaction.commit();

            res.status(201).json({
                ok: true,
                status: 201,
                message: 'Project created',
                project: newProject
            });

        } catch (error) {
            await transaction.rollback();
            res.status(500).json({
                ok: false,
                status: 500,
                message: 'Error al crear proyecto',
                error: error.message
            });
        }
    }

    // Actualizar proyecto
    async updateProject(req, res) {
        const { id } = req.params;
        const { name, category, priority, expectation_date, state, description } = req.body;

        try {
            const task = await Project.findOne({ where: { id } });

            if (!task) {
                return res.status(404).json({ message: 'Project not found' });
            }

            await Project.update(
                { name, category, priority, expectation_date, state, description },
                { where: { id } }
            );

            res.status(200).json({
                ok: true,
                message: 'Project updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                message: 'Error updating project',
                error: error.message
            });
        }
    }

    // Eliminar proyecto
    async deleteProject(req, res){
        const { id } = req.params
        const response = await Project.destroy({
            where: { id },
        });

        res.status(200).json({
            ok: true,
            status: 200,
            message: 'Project deleted',
            data: response
        })
    }
}

export default ProjectServices;