import express from 'express';
import AuthServices from './auth.services.js';

const router = express.Router();
const authService = new AuthServices();

router.post('/login', authService.login);
router.post('/register', authService.register);
router.post('/request-password-reset', authService.requestPasswordReset);
router.post('/reset-password', authService.resetPassword);

export default router;