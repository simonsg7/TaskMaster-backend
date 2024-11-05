import express from 'express';
import UserServices from './user.services.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = express.Router();
const objUser = new UserServices();

router.get('/all', verifyToken, objUser.getAll);
router.get('/byid/:id', verifyToken, objUser.getById);
router.put('/update/:id', verifyToken, objUser.update);
router.delete('/delete/:id', verifyToken, objUser.deleteUser);

export default router;