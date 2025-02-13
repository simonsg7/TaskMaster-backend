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
        values: [ 'Trabajo', 'Personal', 'Estudio', 'Finanzas', 'Salud y bienestar', 'Viajes', 'Hogar', 'Social' ],
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    priority: {
        type: DataTypes.ENUM,
        values: ['Alta', 'Media', 'Baja'],
        allowNull: false
    },
    expectation_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    state: {
        type: DataTypes.ENUM,
        values: ['Diario', 'Pendiente', 'En progreso', 'Completo'],
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'projects'
});

export default Project;