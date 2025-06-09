import express from 'express';
import {  changePassword } from '../controllers/userController.js';

const router = express.Router();


router.post('/:userId/change-password', changePassword);

export default router;
