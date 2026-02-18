import Section from '../models/Section.js';
import Assignment from '../models/Assignment.js';
import User from '../models/User.js';
import Submission from '../models/Submission.js';
import Test from '../models/Test.js';
import TestSubmission from '../models/TestSubmission.js';

export const getTeacherSections = async (req, res) => {
    try {
        const sections = await Section.find({ teacher: req.user._id }).populate('students', 'name email universityId');
        res.json(sections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getTeacherStats = async (req, res) => {
    try {
        const sectionsCount = await Section.countDocuments({ teacher: req.user._id });
        
        const sections = await Section.find({ teacher: req.user._id });
        const studentCount = sections.reduce((acc, curr) => acc + curr.students.length, 0);

        const assignmentCount = await Assignment.countDocuments({ teacher: req.user._id });

        res.json({
            sections: sectionsCount,
            students: studentCount,
            assignments: assignmentCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createAssignment = async (req, res) => {
    try {
        const { title, description, dueDate, sectionId } = req.body;

        if (!title || !dueDate || !sectionId) {
            return res.status(400).json({ message: 'Please provide title, date and section' });
        }

        const assignment = await Assignment.create({
            title,
            description,
            dueDate,
            section: sectionId,
            teacher: req.user._id
        });

        res.status(201).json(assignment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getTeacherAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ teacher: req.user._id })
            .populate('section', 'name department')
            .sort({ dueDate: 1 });
        res.json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (assignment.teacher.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await assignment.deleteOne();
        res.json({ message: 'Assignment removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getSubmissionsForAssignment = async (req, res) => {
    try {
        const { id } = req.params;

        
        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        if (assignment.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const submissions = await Submission.find({ assignment: id })
            .populate('student', 'name email universityId')
            .sort({ submittedAt: -1 });

        res.json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createTest = async (req, res) => {
    try {
        const { title, description, pdfUrl, answerKey, duration, sectionId } = req.body;

        if (!title || !pdfUrl || !answerKey || !sectionId) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const test = await Test.create({
            title,
            description,
            pdfUrl,
            answerKey,
            duration,
            section: sectionId,
            teacher: req.user._id
        });

        res.status(201).json(test);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getTeacherTests = async (req, res) => {
    try {
        const tests = await Test.find({ teacher: req.user._id })
            .populate('section', 'name department')
            .sort({ createdAt: -1 });
        res.json(tests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getTestResults = async (req, res) => {
    try {
        const { id } = req.params;

        const test = await Test.findById(id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        if (test.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const submissions = await TestSubmission.find({ test: id })
            .populate('student', 'name email universityId')
            .sort({ score: -1 });

        res.json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
