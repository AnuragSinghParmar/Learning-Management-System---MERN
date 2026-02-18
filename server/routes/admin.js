import express from 'express';
import { addStudent, getAllStudents, deleteUser, addTeacher, getAllTeachers, getDashboardStats } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, adminOnly, getDashboardStats);

router.post('/add-student', protect, adminOnly, addStudent);
router.get('/users', protect, adminOnly, getAllStudents); 


router.post('/add-teacher', protect, adminOnly, addTeacher);
router.get('/teachers', protect, adminOnly, getAllTeachers);

router.delete('/users/:id', protect, adminOnly, deleteUser);

export default router;
