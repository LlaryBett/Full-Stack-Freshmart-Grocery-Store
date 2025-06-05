import express from 'express';
import { broadcastNotification } from '../controllers/adminController.js';

const router = express.Router();

router.post('/broadcast', broadcastNotification);

export default router;
