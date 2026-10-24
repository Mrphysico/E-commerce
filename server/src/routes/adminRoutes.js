import express from 'express';
import {
  getAdminDashboard,
  getAdminCustomers,
  getLowStockProducts,
} from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, isAdmin);

router.get('/dashboard', getAdminDashboard);
router.get('/customers', getAdminCustomers);
router.get('/low-stock', getLowStockProducts);

export default router;
