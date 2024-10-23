import express from 'express';
import ProjectServices from './project.services.js';

const router = express.Router();
const objProject = new ProjectServices();

router.get('/all', objProject.getAllProjects);

router.get('/projectbyid/:id', objProject.getProjectById);

router.get('/projectsbyuserid/:id', objProject.getProjectsByUserId);

// router.get('/byid/:id', objTask.getAllTasksByUserId);

// router.get('/task/:id', objTask.getTaskByUserId);

// router.post('/create', objTask.create);

// router.put('/update/:id', objTask.update);

// router.delete('/delete/:id', objTask.delete);

export default router;