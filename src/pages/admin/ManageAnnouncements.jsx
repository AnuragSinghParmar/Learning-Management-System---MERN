import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2, AlertCircle, RefreshCw, Megaphone, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/announcements', config);
            setAnnouncements(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch announcements');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/announcements/${id}`, config);
                setAnnouncements(announcements.filter(a => a._id !== id));
            } catch (err) {
                alert('Failed to delete announcement');
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const filteredAnnouncements = announcements.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
                        Manage Announcements
                    </h1>
                    <p className="text-gray-400 mt-1">History of all broadcasts</p>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors w-full md:w-64"
                        />
                    </div>
                    <button
                        onClick={fetchAnnouncements}
                        className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-gray-300"
                        title="Refresh List"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                    {loading ? (
                        <div className="py-20 text-center text-gray-500">Loading announcements...</div>
                    ) : filteredAnnouncements.length === 0 ? (
                        <div className="py-20 text-center text-gray-500">No announcements found.</div>
                    ) : (
                        filteredAnnouncements.map((announcement) => (
                            <motion.div
                                key={announcement._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-[#18181b] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors group relative"
                            >
                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={() => handleDelete(announcement._id)}
                                        className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 text-orange-400">
                                        <Megaphone className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-baseline gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-white">{announcement.title}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${announcement.targetAudience === 'all' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    announcement.targetAudience === 'student' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                        'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                }`}>
                                                @{announcement.targetAudience.charAt(0).toUpperCase() + announcement.targetAudience.slice(1)}
                                            </span>
                                        </div>

                                        <p className="text-gray-400 text-sm mb-3 leading-relaxed whitespace-pre-wrap">
                                            {announcement.message}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" />
                                                {announcement.postedBy?.name || 'Unknown User'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatDate(announcement.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ManageAnnouncements;
