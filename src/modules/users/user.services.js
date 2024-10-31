import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sequelize from '../../../dataBase/conexion.js';
import User from '../../../models/Model.user.js';
import usersDetail from '../../../models/Model.users_details.js';
import '../../../dataBase/association.js';
import { buildFilterClause } from '../../middlewares/filter.middleware.js';
import { filterConfigs } from '../../config/filters.config.js';

dotenv.config();

class UserServices {

    // Consultar todo
    async getAll (req, res){
        try {
            const filterClause = buildFilterClause(req.query, filterConfigs.user);

            const response = await User.findAll({
                where: filterClause,
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

    // Crear User
    async create (req, res){
        const { email, password, first_name, last_name, type_document, number_document, phone } = req.body
        
        const userExist = await User.findOne({ where: {email} }); // Verificar si el usuario, ya existe por medio del email.
        if (userExist === null) {
            try {
                const transaction = await sequelize.transaction();

                try {
                    const salt = bcrypt.genSaltSync();
                    const passwordHash = bcrypt.hashSync(password, salt); // Se usa para encriptar la contraseña
                    
                    const createUser = await User.create({ email, password: passwordHash }, { transaction });
                    await usersDetail.create({ first_name, last_name, type_document, number_document, phone, user_id: createUser.id }, { transaction });

                    const token = jwt.sign( // Genera Token
                        { 
                            id: createUser.id,
                            email: createUser.email
                        },
                        process.env.JWT_SECRET
                    );

                    await transaction.commit();

                    res.status(201).json({
                        ok: true,
                        status: 201,
                        message: 'User created',
                        response: createUser,
                        token
                    });
                } catch (error) {
                    await transaction.rollback();
                    throw error;
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    ok: false,
                    status: 500,
                    message: 'Error al crear usuario',
                    error: error.message
                });
            }
        } else {
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'El usuario ya esta registrado',
            });
        }
    }

    // Login
    async login (req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ 
                where: { email },
                include: {
                    model: usersDetail,
                    attributes: ['first_name', 'last_name']
                }
            });

            if (!user) {
                return res.status(404).json({
                    ok: false,
                    message: 'Usuario no encontrado'
                });
            }

            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(401).json({
                    ok: false,
                    message: 'Contraseña incorrecta'
                });
            }

            const token = jwt.sign( // Genera token
                { 
                    id: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET
            );

            res.status(200).json({
                ok: true,
                user: {
                    first_name: user.users_detail?.first_name,
                    last_name: user.users_detail?.last_name
                },
                token
            });

        } catch (error) {
            res.status(500).json({
                ok: false,
                message: 'Error en el servidor',
                error: error.message
            });
        }
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
    async delete (req, res){
        const { id } = req.params
        const response = await User.destroy({
            where: { id },
        });

        res.status(200).json({
            ok: true,
            status: 200,
            message: 'User deleted',
            data: response
        })
    }
}

export default UserServices;