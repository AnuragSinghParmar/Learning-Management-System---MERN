import mongoose from 'mongoose';

const lostFoundSchema = new mongoose.Schema({
    type: { type: String, enum: ['Lost', 'Found'], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    image: { type: String }, 
    contact: { type: String, required: true }, 
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' }
}, { timestamps: true });

export default mongoose.model('LostFound', lostFoundSchema);
