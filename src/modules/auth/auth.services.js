import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../../../models/Model.user.js';
import usersDetail from '../../../models/Model.users_details.js';
import sequelize from '../../../dataBase/conexion.js';
import { sendPasswordResetEmail } from '../../shared/email.services.js';

dotenv.config();

class AuthServices {

    // Login
    async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ 
                where: { email },
                include: {
                    model: usersDetail,
                    attributes: ['id', 'first_name', 'last_name', 'image_url']
                }
            });

            if (!user) {
                return res.status(404).json({
                    ok: false,
                    message: 'Usuario y/o contraseña inválidos'
                });
            }

            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(401).json({
                    ok: false,
                    message: 'Usuario y/o contraseña inválidos'
                });
            }

            const token = jwt.sign(
                { 
                    id: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET
            );

            res.status(200).json({
                ok: true,
                user: {
                    id: user.id,
                    user_detail_id: user.users_detail?.id,
                    first_name: user.users_detail?.first_name,
                    last_name: user.users_detail?.last_name,
                    image_url: user.users_detail?.image_url
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

    // Registro
    async register(req, res) {
        const { email, password, first_name, last_name, type_document, number_document, phone } = req.body;
        
        const userExist = await User.findOne({ where: {email} });
        if (userExist === null) {
            try {
                const transaction = await sequelize.transaction();

                try {
                    const salt = bcrypt.genSaltSync();
                    const passwordHash = bcrypt.hashSync(password, salt); // Encripta la contraseña
                    
                    const createUser = await User.create({ email, password: passwordHash }, { transaction });
                    const imageUrl = `https://res.cloudinary.com/dm0g4d64z/image/upload/${createUser.id}`;

                    const createUserDetail = await usersDetail.create({ first_name, last_name, type_document, number_document, phone, user_id: createUser.id, image_url: imageUrl }, { transaction });

                    const token = jwt.sign(          // Genera token
                        { 
                            id: createUser.id,
                            email: createUser.email
                        },
                        process.env.JWT_SECRET
                    );

                    await transaction.commit();

                    res.status(201).json({
                        ok: true,
                        message: 'User created',
                        response: createUser,
                        token,
                        user_detail_id: createUserDetail.id,
                        imageUrl
                    });
                } catch (error) {
                    await transaction.rollback();
                    throw error;
                }
            } catch (error) {
                res.status(500).json({
                    ok: false,
                    message: 'Error al crear usuario',
                    error: error.message
                });
            }
        } else {
            res.status(400).json({
                ok: false,
                message: 'El usuario ya está registrado'
            });
        }
    }

    // Recuperación de contraseña
    async requestPasswordReset(req, res) {
        const { email } = req.body;

        try {
            const user = await User.findOne({ where: { email } });
            
            if (!user) {
                return res.status(404).json({
                    ok: false,
                    message: 'No existe una cuenta con este correo electrónico'
                });
            }

            const resetToken = jwt.sign (
                {
                    id: user.id,
                    email: user.email
                },
                process.env.JWT_RESET_SECRET,
                { expiresIn: '15m' }
            );

            const emailSent = await sendPasswordResetEmail(email, resetToken);

            if (emailSent) {
                res.status(200).json({
                    ok: true,
                    message: 'Se ha enviado un correo con las instrucciones para recuperar tu contraseña'
                });
            } else {
                throw new Error('Error al enviar el correo');
            }

        } catch (error) {
            res.status(500).json({
                ok: false,
                message: 'Error al procesar la solicitud',
                error: error.message
            });
        }
    }

    // Restablecer contraseña
    async resetPassword(req, res) {
        const { token, newPassword } = req.body;

        try {
            const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);

            const user = await User.findOne({
                where: {
                    id: decoded.id,
                    email: decoded.email
                }
            });

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    message: 'Token inválido o expirado'
                });
            }

            const salt = bcrypt.genSaltSync();
            const passwordHash = bcrypt.hashSync(newPassword, salt);

            await user.update({
                password: passwordHash
            });

            res.status(200).json({
                ok: true,
                message: 'Contraseña actualizada correctamente'
            });

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({
                    ok: false,
                    message: 'El token ha expirado'
                });
            }

            res.status(500).json({
                ok: false,
                message: 'Error al restablecer la contraseña',
                error: error.message
            });
        }
    }
}

export default AuthServices;