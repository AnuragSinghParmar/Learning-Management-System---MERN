import Attendance from '../models/Attendance.js';
import Section from '../models/Section.js';


export const getAttendance = async (req, res) => {
    try {
        const { sectionId, date } = req.query;

        if (!sectionId || !date) {
            return res.status(400).json({ message: 'Section ID and Date are required' });
        }

        
        
        
        const queryDate = new Date(date);

        
        const attendance = await Attendance.findOne({
            section: sectionId,
            date: queryDate
        }).populate('records.student', 'name universityId');

        if (attendance) {
            return res.json(attendance);
        } else {
            
            return res.json(null);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const markAttendance = async (req, res) => {
    try {
        const { sectionId, date, records } = req.body; 

        const queryDate = new Date(date);

        
        let attendance = await Attendance.findOne({ section: sectionId, date: queryDate });

        if (attendance) {
            
            attendance.records = records;
            attendance.teacher = req.user._id; 
            await attendance.save();
        } else {
            
            attendance = await Attendance.create({
                section: sectionId,
                date: queryDate,
                teacher: req.user._id,
                records
            });
        }

        res.status(201).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



