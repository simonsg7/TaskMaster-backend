import { Sequelize } from 'sequelize';
import dbConfig from './config.js';

let sequelize;

if (dbConfig.url) {
    sequelize = new Sequelize(dbConfig.url, dbConfig);
} else {
    sequelize = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        dbConfig
    );
}

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