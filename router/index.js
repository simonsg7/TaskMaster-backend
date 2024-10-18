import users from '../src/modules/users/user.routes.js';
import tasks from '../src/modules/tasks/task.routes.js';
import projects from '../src/modules/projects/project.routes.js';

const routers = (app) => {
    app.use('/users', users);
    app.use('/tasks', tasks);
    app.use('/projects', projects);
}

export default routers;