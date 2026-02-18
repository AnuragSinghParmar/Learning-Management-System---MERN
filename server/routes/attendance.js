import express from 'express';
import { getAttendance, markAttendance } from '../controllers/attendanceController.js';
import { protect, teacherOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, teacherOnly, getAttendance);
router.post('/', protect, teacherOnly, markAttendance);

export default router;
