import { Sequelize } from 'sequelize';
import 'dotenv/config'; // Para cargar variables de entorno en desarrollo local

const sequelize = new Sequelize('taskmaster', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: '3306'
});
// Usamos DATABASE_URL como el estándar para la cadena de conexión.
// La tomará de tu archivo .env en local, o de las variables de entorno del servidor en producción.
const connectionString = process.env.DATABASE_URL;

// //Para testear el Sequelize 
// const testConnection = async()=>{   
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     } 
// }
if (!connectionString) {
    throw new Error("La variable de entorno DATABASE_URL no está definida. Asegúrate de tener un archivo .env para desarrollo local.");
}

// testConnection();
// Instanciamos Sequelize una sola vez con la configuración correcta.
const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: {
        // Esencial para conectar a bases de datos en la nube como Supabase, Vercel, etc.
        ssl: {
            require: true,
            rejectUnauthorized: false // Necesario para conexiones a Supabase sin configurar el CA.
        }
    },
    logging: false // Opcional: deshabilita los logs de SQL en la consola
});


export default sequelize;