import express from 'express';
import TaskServices from './task.services.js';

const router = express.Router();
const objTask = new TaskServices();

router.get('/all', objTask.getAllTasks);

router.get('/byid/:id', objTask.getAllTasksByUserId);

router.get('/task/:id', objTask.getTaskByUserId);

router.post('/create', objTask.create);

// router.put('/update/:id', objTask.update);

// router.delete('/delete/:id', objTask.delete);

export default router;