import Announcement from '../models/Announcement.js';

export const createAnnouncement = async (req, res) => {
    try {
        const { title, message, targetAudience } = req.body;

        if (!title || !message) {
            return res.status(400).json({ message: 'Title and Message are required' });
        }

        const announcement = await Announcement.create({
            title,
            message,
            targetAudience: targetAudience || 'all',
            postedBy: req.user._id
        });

        res.status(201).json(announcement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getAnnouncements = async (req, res) => {
    try {
        
        const announcements = await Announcement.find()
            .populate('postedBy', 'name role')
            .sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        
        
        
        if (req.user.role !== 'admin' && announcement.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this announcement' });
        }

        await announcement.deleteOne();
        res.json({ message: 'Announcement removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
