import express from 'express';
import { createSection, getAllSections, updateSection, assignStudentsToSection, deleteSection, removeStudentFromSection } from '../controllers/sectionController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, adminOnly, createSection);
router.get('/', protect, adminOnly, getAllSections);
router.put('/:id', protect, adminOnly, updateSection);
router.post('/:id/assign', protect, adminOnly, assignStudentsToSection);
router.delete('/:id/students/:studentId', protect, adminOnly, removeStudentFromSection);
router.delete('/:id', protect, adminOnly, deleteSection);

export default router;
