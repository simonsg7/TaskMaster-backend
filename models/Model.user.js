import {DataTypes, Model} from 'sequelize';
import sequelize from '../dataBase/conexion.js';

class User extends Model {}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
            msg: 'La dirección de correo electrónico debe ser válida.'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    // Other model options go here
    sequelize, //We need to pass the connection instance
    modelName: 'user' //We need to choose the model name
});


export default User;