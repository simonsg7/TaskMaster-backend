import express from 'express';
import ProjectServices from './project.services.js';

const router = express.Router();
const objProject = new ProjectServices();

router.get('/all', objProject.getAllProjects);

router.get('/projectbyid/:id', objProject.getProjectById);

router.get('/projectsbyuserid/:id', objProject.getProjectsByUserId);

router.post('/create', objProject.create);

router.put('/update/:id', objProject.updateProject);

router.delete('/delete/:id', objProject.deleteProject);

export default router;