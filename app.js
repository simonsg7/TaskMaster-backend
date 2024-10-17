import express from 'express';
import routers from './router/index.js';
import createTables from './dataBase/association.js';

const app = express();

app.set('port', 3000);
app.use(express.json());

routers(app);

createTables();

app.listen(app.get('port'), () => {
    console.log(`Listening on port ${app.get('port')}`);
});