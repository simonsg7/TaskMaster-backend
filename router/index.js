import users from'../src/modules/users/user.routes.js';
import tasks from'../src/modules/tasks/task.routes.js';

const routers = (app) => {
    app.use('/users', users);
    app.use('/tasks', tasks);
}

export default routers;