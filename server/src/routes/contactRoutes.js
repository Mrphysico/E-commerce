import express from 'express';
import {
  submitContactMessage,
  getContactMessages,
} from '../controllers/contactController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContactMessage);
router.get('/', protect, isAdmin, getContactMessages);

export default router;
