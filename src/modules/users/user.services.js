import bcrypt from 'bcryptjs';
import sequelize from '../../../dataBase/conexion.js';
import User from '../../../models/Model.user.js';
import usersDetail from '../../../models/Model.users_details.js';
import '../../../dataBase/association.js';

class UserServices {

    // Consultar todo
    async getAll(req, res){
        const response = await User.findAll({
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
    async create(req, res){
        const { email, password, first_name, last_name, type_document, number_document, phone } = req.body
        
        const userExist = await User.findOne({ where: {email} }); // Verificar si el usuario, ya existe por medio del email.
        if (userExist === null) {
            try {
                const transaction = await sequelize.transaction();

                try {
                    const salt = bcrypt.genSaltSync();     // Se usa para encriptar la contraseña
                    const passwordHash = bcrypt.hashSync(password, salt); // Se usa para encriptar la contraseña
                    
                    const createUser = await User.create({ email, password: passwordHash }, { transaction });
                    await usersDetail.create({ first_name, last_name, type_document, number_document, phone, user_id: createUser.id }, { transaction });

                    await transaction.commit();

                    res.status(201).json({
                        ok: true,
                        status: 201,
                        message: 'User created',
                        response: createUser
                    });
                } catch (error) {
                    await transaction.rollback();
                    res.status(500).json({
                        ok: false,
                        status: 500,
                        message: 'Error al crear usuario',
                        error: error.message
                    });
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

    // Actualizar User
    async update(req, res) {
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
    async delete(req, res){
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