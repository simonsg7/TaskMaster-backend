import {DataTypes, Model} from 'sequelize';
import sequelize from '../dataBase/conexion.js';

class CategoryTask extends Model {}

CategoryTask.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    category: {
        type: DataTypes.ENUM,
        values: [ 'Trabajo', 'Personal', 'Estudio', 'Finanzas', 'Salud y bienestar', 'Viajes', 'Hogar', 'Social' ],
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'category_tasks'
});



export default CategoryTask;