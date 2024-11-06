import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sequelize from '../../../dataBase/conexion.js';
import User from '../../../models/Model.user.js';
import usersDetail from '../../../models/Model.users_details.js';
import '../../../dataBase/association.js';
import { filterClause } from '../../middlewares/filter.middleware.js';
import { filterConfigs } from '../../config/filters.config.js';

dotenv.config();

class UserServices {

    // Consultar todo
    async getAll (req, res){
        try {
            const filClause = filterClause(req.query, filterConfigs.user);

            const response = await User.findAll({
                where: filClause,
                attributes: ["id", "email"],
                include: {
                    model: usersDetail,
                    attributes: ["first_name", "last_name", "phone"],
                },
            });
            
            res.status(200).json({
                ok: true,
                response
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                message: 'Error al obtener usuarios',
                error: error.message
            });
        }
    }

    // Consultar uno
    async getById (req, res){
        const {id} = req.params
        
        const response = await User.findOne({ 
            where: { id },
            attributes: ["id", "email"],
            include: {
                model: usersDetail,
                attributes: [ "first_name", "last_name", "phone" ],
            },
        });
        
        res.status(200).json({
            response
        })
    }

    // Actualizar User
    async update (req, res) {
        const { id } = req.params;
        const { email, password, first_name, last_name, type_document, number_document, phone } = req.body;

        try {
            const user = await User.findByPk(id);
            if (!user) {
                res.status(404).json({
                    ok: false,
                    status: 404,
                    message: 'User not found',
                });
                return;
            }

            const transaction = await sequelize.transaction();

            try {
                if (email) {
                    user.email = email;
                }
                if (password) {
                    const salt = bcrypt.genSaltSync();
                    const passwordHash = bcrypt.hashSync(password, salt);
                    user.password = passwordHash;
                }

                await user.save({ transaction });

                const userDetail = await usersDetail.findOne({ where: { user_id: id } });
                if (userDetail) {
                    if (first_name) {
                        userDetail.first_name = first_name;
                    }
                    if (last_name) {
                        userDetail.last_name = last_name;
                    }
                    if (type_document) {
                        userDetail.type_document = type_document;
                    }
                    if (number_document) {
                        userDetail.number_document = number_document;
                    }
                    if (phone) {
                        userDetail.phone = phone;
                    }
                    await userDetail.save({ transaction });
                }

                await transaction.commit();

                res.status(200).json({
                    ok: true,
                    status: 200,
                    message: 'User updated',
                    response: user,
                });
            } catch (error) {
                await transaction.rollback();
                res.status(500).json({
                    ok: false,
                    status: 500,
                    message: 'Error al actualizar usuario',
                    error: error.message,
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                status: 500,
                message: 'Error al actualizar usuario',
                error: error.message,
            });
        }
    }

    // Eliminar User
    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    ok: false,
                    message: 'User not found'
                });
            }
            await user.destroy();
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'User deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                message: 'Error deleting User',
                error: error.message
            });
        }
    }
}

export default UserServices;