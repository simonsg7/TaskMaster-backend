import express from 'express';
import cors from 'cors';
import routers from './router/index.js';
// import createTables from './dataBase/association.js';

const app = express();

app.set('port', 3000);

app.use(express.json());

app.use(cors(
    {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
    }
));

routers(app);

// createTables();

export default app;