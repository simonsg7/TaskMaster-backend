import express from 'express';
import UserServices from './user.services.js';

const router = express.Router();
const objUser = new UserServices();

router.get('/all', objUser.getAll);

router.get('/byid/:id', objUser.getById);

router.post('/create', objUser.create);

router.put('/update/:id', objUser.update);

router.delete('/delete/:id', objUser.delete);

export default router;