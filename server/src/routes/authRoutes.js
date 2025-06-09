import express from 'express';
import { login, register, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Do NOT add the change password route here.
// The change password route should remain in userRoutes.js, not authRoutes.js.

export default router;
