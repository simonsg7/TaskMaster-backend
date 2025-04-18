import express from 'express';
import auth from '../src/modules/auth/auth.routes.js';
import users from '../src/modules/users/user.routes.js';
import tasks from '../src/modules/tasks/task.routes.js';
import projects from '../src/modules/projects/project.routes.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('TaskMaster');
});

const routers = (app) => {
    app.use('/', router);
    app.use('/auth', auth);
    app.use('/users', users);
    app.use('/tasks', tasks);
    app.use('/projects', projects);
}

export default routers;