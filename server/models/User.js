import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },

    
    universityId: { type: String, unique: true, sparse: true }, 
    department: { type: String },
    section: { type: String }, 

    
}, { timestamps: true });

export default mongoose.model('User', userSchema);
