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
    category: {
        type: DataTypes.ENUM,
        values: [ 'trabajo', 'personal', 'estudio', 'finanzas', 'salud y bienestar', 'viajes', 'hogar', 'social' ],
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    priority: {
        type: DataTypes.ENUM,
        values: ['alta', 'media', 'baja'],
        allowNull: false
    },
    expectation_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    state: {
        type: DataTypes.ENUM,
        values: ['pendiente', 'en progreso', 'completo'],
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'projects'
});

export default Project;