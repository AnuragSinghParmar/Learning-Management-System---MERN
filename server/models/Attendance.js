import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    records: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late'],
            default: 'Present'
        }
    }]
}, { timestamps: true });




attendanceSchema.index({ date: 1, section: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
