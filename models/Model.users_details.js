import {DataTypes, Model} from 'sequelize';
import sequelize from '../dataBase/conexion.js';

class usersDetail extends Model {}

usersDetail.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type_document: {
        type: DataTypes.ENUM,
        values: ['C.C', 'C.E', 'T.I'],
        allowNull: false
    },
    number_document: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'users_details'
});

export default usersDetail;