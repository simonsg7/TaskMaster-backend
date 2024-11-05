import express from 'express';
import TaskServices from './task.services.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = express.Router();
const objTask = new TaskServices();

router.get('/all', verifyToken, objTask.getAllTasks);

router.get('/byid/:id', verifyToken, objTask.getAllTasksByUserId);

router.get('/task/:id', verifyToken, objTask.getTaskByUserId);

router.post('/create', verifyToken, objTask.create);

router.put('/update/:id', verifyToken, objTask.update);

router.delete('/delete/:id', verifyToken, objTask.deleteTask);

export default router;