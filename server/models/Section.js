import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    department: { type: String, required: true }, 
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
}, { timestamps: true });


sectionSchema.index({ name: 1, department: 1 }, { unique: true });

export default mongoose.model('Section', sectionSchema);
