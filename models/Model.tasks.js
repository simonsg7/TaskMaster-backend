import {DataTypes, Model} from 'sequelize';
import sequelize from '../dataBase/conexion.js';

class Task extends Model {}

Task.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM,
        values: ['Alta', 'Media', 'Baja'],
        allowNull: false
    },
    expectation_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    state: {
        type: DataTypes.ENUM,
        values: ['Pendiente', 'En progreso', 'Completa'],
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'tasks'
});



export default Task;