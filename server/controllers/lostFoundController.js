import LostFound from '../models/LostFound.js';

export const getLostFoundItems = async (req, res) => {
    try {
        const items = await LostFound.find()
            .populate('postedBy', 'name role')
            .sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createLostFoundItem = async (req, res) => {
    try {
        const { type, title, description, location, date, contact, image } = req.body;

        const item = await LostFound.create({
            type,
            title,
            description,
            location,
            date,
            contact,
            image, 
            postedBy: req.user._id
        });

        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const resolveItem = async (req, res) => {
    try {
        const item = await LostFound.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        
        if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        item.status = 'Resolved';
        await item.save();

        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
