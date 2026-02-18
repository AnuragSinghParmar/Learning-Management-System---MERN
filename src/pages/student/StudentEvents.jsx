import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

const StudentEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:5000/api/events', config);
                setEvents(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-8">
                Campus Events
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {loading ? (
                        <div className="col-span-full text-center text-gray-500 py-20">Loading events...</div>
                    ) : events.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-20">No upcoming events.</div>
                    ) : (
                        events.map((event, i) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#18181b] border border-white/10 p-6 rounded-2xl hover:border-blue-500/50 transition-all group overflow-hidden relative"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-white/5 p-3 rounded-xl text-center min-w-[4rem]">
                                        <div className="text-sm text-blue-400 font-bold uppercase">
                                            {new Date(event.date).toLocaleString('default', { month: 'short' })}
                                        </div>
                                        <div className="text-2xl font-bold text-white">
                                            {new Date(event.date).getDate()}
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                                        {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{event.title}</h3>

                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    <span>{event.location || 'TBA'}</span>
                                </div>

                                <p className="text-gray-400 text-sm line-clamp-3">
                                    {event.description}
                                </p>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StudentEvents;
