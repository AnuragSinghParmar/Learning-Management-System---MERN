import Section from '../models/Section.js';
import Assignment from '../models/Assignment.js';
import Announcement from '../models/Announcement.js';
import Event from '../models/Event.js';
import Attendance from '../models/Attendance.js';
import Submission from '../models/Submission.js';
import Test from '../models/Test.js';
import TestSubmission from '../models/TestSubmission.js';

export const getStudentStats = async (req, res) => {
    try {
        
        const section = await Section.findOne({ students: req.user._id });

        let assignmentsCount = 0;
        let pendingassignmentsCount = 0; 
        if (section) {
            assignmentsCount = await Assignment.countDocuments({ section: section._id });
            
            
        }

        const eventsCount = await Event.countDocuments({ date: { $gte: new Date() } }); 
        const announcementsCount = await Announcement.countDocuments({
            $or: [{ targetAudience: 'all' }, { targetAudience: 'student' }]
        });

        res.json({
            assignments: assignmentsCount,
            events: eventsCount,
            announcements: announcementsCount,
            sectionName: section ? `${section.department} - ${section.name}` : 'Not Assigned'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getStudentAssignments = async (req, res) => {
    try {
        const section = await Section.findOne({ students: req.user._id });

        if (!section) {
            return res.json([]);
        }

        const assignments = await Assignment.find({ section: section._id })
            .populate('teacher', 'name')
            .sort({ dueDate: 1 });

        res.json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getStudentAttendance = async (req, res) => {
    try {
        const logs = await Attendance.find({ "records.student": req.user._id })
            .sort({ date: -1 });

        const history = logs.map(log => {
            const record = log.records.find(r => r.student.toString() === req.user._id.toString());
            return {
                _id: log._id,
                date: log.date,
                status: record ? record.status : 'Unknown'
            };
        });

        const totalClasses = history.length;
        const presentCount = history.filter(h => h.status === 'Present').length;
        const absentCount = history.filter(h => h.status === 'Absent').length;
        const lateCount = history.filter(h => h.status === 'Late').length;

        const attendancePercentage = totalClasses === 0 ? 0 : ((presentCount + lateCount) / totalClasses) * 100;

        res.json({
            stats: {
                total: totalClasses,
                present: presentCount,
                absent: absentCount,
                late: lateCount,
                percentage: attendancePercentage.toFixed(1)
            },
            history
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId, fileUrl } = req.body;

        
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        
        const existingSubmission = await Submission.findOne({
            assignment: assignmentId,
            student: req.user._id
        });

        if (existingSubmission) {
            existingSubmission.fileUrl = fileUrl;
            existingSubmission.submittedAt = Date.now();
            await existingSubmission.save();
            return res.json({ message: 'Assignment updated', submission: existingSubmission });
        }

        const submission = await Submission.create({
            assignment: assignmentId,
            student: req.user._id,
            fileUrl
        });

        res.status(201).json({ message: 'Assignment submitted', submission });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getAvailableTests = async (req, res) => {
    try {
        const section = await Section.findOne({ students: req.user._id });
        if (!section) return res.json([]);

        
        const tests = await Test.find({
            section: section._id,
            active: true
        }).populate('teacher', 'name');

        
        const submissions = await TestSubmission.find({
            student: req.user._id
        });

        const submittedTestIds = submissions.map(sub => sub.test.toString());

        const testsWithStatus = tests.map(test => {
            const t = test.toObject();
            
            const questionCount = t.answerKey ? t.answerKey.length : 0;
            delete t.answerKey;

            return {
                ...t,
                questionCount,
                isSubmitted: submittedTestIds.includes(test._id.toString())
            };
        });

        res.json(testsWithStatus);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const submitTest = async (req, res) => {
    try {
        const { testId, answers, violations } = req.body;

        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ message: 'Test not found' });

        
        const existing = await TestSubmission.findOne({ test: testId, student: req.user._id });
        if (existing) return res.status(400).json({ message: 'Already submitted' });

        
        let score = 0;
        const maxScore = test.answerKey.length;

        
        test.answerKey.forEach(key => {
            const studentAns = answers.find(a => a.question === key.question);
            if (studentAns && studentAns.selectedOption === key.answer) {
                score++;
            }
        });

        const submission = await TestSubmission.create({
            test: testId,
            student: req.user._id,
            answers,
            score,
            maxScore,
            violations
        });

        res.status(201).json({ message: 'Test submitted successfully', score, maxScore });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
