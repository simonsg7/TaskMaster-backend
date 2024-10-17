import { DataTypes, Model } from 'sequelize';
import sequelize from '../dataBase/conexion.js';

class UserProject extends Model {}

UserProject.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_detail_id: {
        type: DataTypes.UUID,
        references: {
            model: 'users_details',
            key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
    },
    project_id: {
        type: DataTypes.UUID,
        references: {
            model: 'projects',
            key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'user_project'
});

export default UserProject;