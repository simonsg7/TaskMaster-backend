import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('taskmaster', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: '3306'
});

// //Para testear el Sequelize 
// const testConnection = async()=>{   
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     } 
// }

// testConnection();


export default sequelize;