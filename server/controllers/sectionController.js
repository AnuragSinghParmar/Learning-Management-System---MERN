import Section from '../models/Section.js';
import User from '../models/User.js';

export const createSection = async (req, res) => {
    try {
        const { name, department, teacherId } = req.body;

        if (!name || !department) {
            return res.status(400).json({ message: 'Name and Department are required' });
        }

        const sectionExists = await Section.findOne({ name, department });
        if (sectionExists) {
            return res.status(400).json({ message: 'Section already exists in this department' });
        }

        const section = await Section.create({
            name,
            department,
            teacher: teacherId || null
        });

        res.status(201).json(section);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getAllSections = async (req, res) => {
    try {
        const sections = await Section.find()
            .populate('teacher', 'name email')
            .populate('students', 'name universityId section'); 
        res.json(sections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateSection = async (req, res) => {
    try {
        const { teacherId } = req.body;
        const section = await Section.findById(req.params.id);

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        if (teacherId) {
            section.teacher = teacherId;
        }

        await section.save();
        res.json(section);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const assignStudentsToSection = async (req, res) => {
    try {
        const { studentIds } = req.body; 
        const sectionId = req.params.id;

        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        
        
        
        

        
        section.students = [...new Set([...section.students.map(id => id.toString()), ...studentIds])];
        await section.save();

        
        await User.updateMany(
            { _id: { $in: studentIds } },
            { $set: { section: section.name, department: section.department } }
        );

        res.json({ message: 'Students assigned successfully', section });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteSection = async (req, res) => {
    try {
        const section = await Section.findById(req.params.id);
        if (!section) return res.status(404).json({ message: 'Section not found' });

        await section.deleteOne();
        res.json({ message: 'Section removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const removeStudentFromSection = async (req, res) => {
    try {
        const { id, studentId } = req.params;

        const section = await Section.findById(id);
        if (!section) return res.status(404).json({ message: 'Section not found' });


        section.students = section.students.filter(s => s.toString() !== studentId);
        await section.save();

        await User.findByIdAndUpdate(studentId, { $unset: { section: "", department: "" } });

        res.json({ message: 'Student removed from section' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
