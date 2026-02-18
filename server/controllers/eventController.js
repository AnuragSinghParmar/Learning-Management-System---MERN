import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
    try {
        const { title, description, date, location } = req.body;

        if (!title || !date) {
            return res.status(400).json({ message: 'Title and Date are required' });
        }

        const event = await Event.create({
            title,
            description,
            date,
            location
        });

        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getEvents = async (req, res) => {
    try {
        
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
