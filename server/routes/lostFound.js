import express from 'express';
import { getLostFoundItems, createLostFoundItem, resolveItem } from '../controllers/lostFoundController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getLostFoundItems);
router.post('/', protect, createLostFoundItem);
router.put('/:id/resolve', protect, resolveItem);

export default router;
