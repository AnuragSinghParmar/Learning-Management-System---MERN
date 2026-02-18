import User from '../models/User.js';
import Event from '../models/Event.js';

export const getDashboardStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'student' });
        const teacherCount = await User.countDocuments({ role: 'teacher' });
        const eventCount = await Event.countDocuments({});

        res.json({
            students: studentCount,
            teachers: teacherCount,
            events: eventCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
import bcrypt from 'bcryptjs';

export const addStudent = async (req, res) => {
    try {
        const { name, email, universityId, department, section } = req.body;

        
        if (!name || !email || !universityId || !department) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        
        const userExists = await User.findOne({
            $or: [{ email }, { universityId }]
        });

        if (userExists) {
            return res.status(400).json({ message: 'Student with this Email or University ID already exists' });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(universityId, salt);

        const student = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'student',
            universityId,
            department,
            section
        });

        if (student) {
            res.status(201).json({
                _id: student.id,
                name: student.name,
                email: student.email,
                universityId: student.universityId,
                role: student.role,
                message: 'Student added successfully'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const addTeacher = async (req, res) => {
    try {
        const { name, email, universityId, department } = req.body;

        if (!name || !email || !universityId || !department) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const userExists = await User.findOne({ $or: [{ email }, { universityId }] });
        if (userExists) {
            return res.status(400).json({ message: 'User with this Email or ID already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(universityId, salt); 

        const teacher = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'teacher',
            universityId,
            department
        });

        if (teacher) {
            res.status(201).json({
                _id: teacher.id,
                name: teacher.name,
                email: teacher.email,
                universityId: teacher.universityId,
                role: teacher.role,
                message: 'Teacher added successfully'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('-password');
        res.json(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
