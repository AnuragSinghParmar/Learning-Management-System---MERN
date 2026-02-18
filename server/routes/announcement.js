import express from 'express';
import { createAnnouncement, getAnnouncements, deleteAnnouncement } from '../controllers/announcementController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/', protect, getAnnouncements);






const authorized = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'teacher')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized' });
    }
};

router.post('/', protect, authorized, createAnnouncement);
router.delete('/:id', protect, authorized, deleteAnnouncement);

export default router;
