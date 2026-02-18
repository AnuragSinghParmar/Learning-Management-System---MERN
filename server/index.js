import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import eventRoutes from './routes/event.js';
import announcementRoutes from './routes/announcement.js';
import sectionRoutes from './routes/section.js';
import teacherRoutes from './routes/teacher.js';
import attendanceRoutes from './routes/attendance.js';
import studentRoutes from './routes/student.js';
import lostFoundRoutes from './routes/lostFound.js';

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: true, 
    credentials: true
}));


export const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) return;
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/lost-found', lostFoundRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});


if (process.argv[1] === fileURLToPath(import.meta.url)) {
    connectDB().then(() => {
        app.listen(5000, () => {
            console.log('Server running on port 5000');
        });
    });
}

export default app;
