// import sequelize from '../dataBase/conexion.js';
import User from '../models/Model.user.js';
import usersDetail from '../models/Model.users_details.js';
import Task from '../models/Model.tasks.js';
import Project from '../models/Model.projects.js';
import UserProject from '../models/Model.usersDetails_projects.js';

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

// Project - Task
Project.hasMany(Task, {
    foreignKey: {
        name: 'project_id',
        allowNull: true
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
Task.belongsTo(Project, {
    foreignKey: 'project_id'
});

// Many to many
usersDetail.belongsToMany(Project, {
    through: {
        model: UserProject,
        unique: false
    },
    foreignKey: 'user_detail_id',
    otherKey: 'project_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Project.belongsToMany(usersDetail, {
    through: {
        model: UserProject,
        unique: false
    },
    foreignKey: 'project_id',
    otherKey: 'user_detail_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// const createTables = async () => {
    // await Project.sync({ force: true }) //Crea o modifica, la tabla
    // await sequelize.sync({ force: true }) //Crea las tablas
// }  // alter: true; es para modificar las tablas creadas, force: true; borrar y crear; cambiar y (vació); crea si no existe 

// export default createTables;