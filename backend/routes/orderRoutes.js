import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { createOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', authenticateToken, createOrder);

export default router;
