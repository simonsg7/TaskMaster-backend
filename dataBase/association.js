// import sequelize from '../dataBase/conexion.js';
import User from '../models/Model.user.js';
import usersDetail from '../models/Model.users_details.js';
import Task from '../models/Model.tasks.js';

// One to one 
// User - UserDetail
User.hasOne(usersDetail, {
    foreignKey: {
        name: 'user_id',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
usersDetail.belongsTo(User, {
    foreignKey: 'user_id'
});

// One to many
// Task - UserDetail
usersDetail.hasMany(Task, {
    foreignKey: {
        name: 'user_detail_id',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Task.belongsTo(usersDetail, {
    foreignKey: 'user_detail_id'
});

// const createTables = async () => {
    // await User.sync( {alter: true} ) //Crea o modifica, la tabla
    // await sequelize.sync({force: true}) //Crea las tablas
// }  // alter: true; es para modificar las tablas creadas, force: true; borrar y crear; cambiar y (vació); crea si no existe 

// export default createTables;