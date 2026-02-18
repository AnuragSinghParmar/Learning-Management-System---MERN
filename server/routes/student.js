import express from 'express';
import { getStudentStats, getStudentAssignments, getStudentAttendance, submitAssignment, getAvailableTests, submitTest } from '../controllers/studentController.js';
import { protect, studentOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, studentOnly, getStudentStats);
router.get('/assignments', protect, studentOnly, getStudentAssignments);
router.post('/assignments/submit', protect, studentOnly, submitAssignment);
router.get('/tests', protect, studentOnly, getAvailableTests);
router.post('/tests/submit', protect, studentOnly, submitTest);
router.get('/attendance', protect, studentOnly, getStudentAttendance);

export default router;
