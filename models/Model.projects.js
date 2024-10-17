import { DataTypes, Model } from 'sequelize';
import sequelize from '../dataBase/conexion.js';

class Project extends Model {}

Project.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
}, {
    sequelize,
    modelName: 'projects'
});

export default Project;