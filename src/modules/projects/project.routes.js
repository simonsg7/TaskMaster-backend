import express from 'express';
import ProjectServices from './project.services.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = express.Router();
const objProject = new ProjectServices();

router.get('/all', verifyToken, objProject.getAllProjects);

router.get('/projectbyid/:id', verifyToken, objProject.getProjectById);

router.get('/projectsbyuserid/:id', verifyToken, objProject.getProjectsByUserId);

router.post('/create', verifyToken, objProject.create);

router.put('/update/:id', verifyToken, objProject.updateProject);

router.delete('/delete/:id', verifyToken, objProject.deleteProject);

export default router;