import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    targetAudience: { type: String, enum: ['all', 'student', 'teacher'], default: 'all' }
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);
