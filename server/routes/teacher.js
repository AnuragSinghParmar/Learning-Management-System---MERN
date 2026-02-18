import express from 'express';
import { getTeacherSections, getTeacherStats, createAssignment, getTeacherAssignments, deleteAssignment, getSubmissionsForAssignment, createTest, getTeacherTests, getTestResults } from '../controllers/teacherController.js';
import { protect, teacherOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, teacherOnly, getTeacherStats);
router.get('/sections', protect, teacherOnly, getTeacherSections);

router.route('/assignments')
    .get(protect, teacherOnly, getTeacherAssignments)
    .post(protect, teacherOnly, createAssignment);

router.delete('/assignments/:id', protect, teacherOnly, deleteAssignment);
router.get('/assignments/:id/submissions', protect, teacherOnly, getSubmissionsForAssignment);

router.route('/tests')
    .get(protect, teacherOnly, getTeacherTests)
    .post(protect, teacherOnly, createTest);

router.get('/tests/:id/results', protect, teacherOnly, getTestResults);

export default router;
