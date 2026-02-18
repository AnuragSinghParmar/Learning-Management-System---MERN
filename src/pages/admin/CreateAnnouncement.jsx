import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Megaphone, AlignLeft, CheckCircle2, AlertCircle, Type, Users2 } from 'lucide-react';

const CreateAnnouncement = () => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        targetAudience: 'all'
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const { data } = await axios.post('http://localhost:5000/api/announcements', formData, config);

            setStatus({ type: 'success', message: `Announcement created successfully!` });
            setFormData({ title: '', message: '', targetAudience: 'all' });
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to create announcement';
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
                    Post Announcement
                </h1>
                <p className="text-gray-400 mt-2">Broadcast important updates to the university.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#18181b] p-8 rounded-2xl border border-white/10 shadow-xl"
            >
                {status.message && (
                    <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-sm font-medium text-gray-400">Title</label>
                        <div className="relative">
                            <Type className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                placeholder="Important Notice"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-sm font-medium text-gray-400">Target Audience</label>
                        <div className="relative">
                            <Users2 className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <select
                                name="targetAudience"
                                value={formData.targetAudience}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none"
                            >
                                <option value="all" className="text-black">All Users</option>
                                <option value="student" className="text-black">Students Only</option>
                                <option value="teacher" className="text-black">Teachers Only</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                        <label className="text-sm font-medium text-gray-400">Message</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="6"
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                                placeholder="Write your announcement here..."
                                required
                            />
                        </div>
                    </div>

                    <div className="col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${loading
                                    ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                                    : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-orange-600/25 hover:scale-[1.01]'
                                }`}
                        >
                            {loading ? 'Posting...' : 'Post Announcement'}
                            {!loading && <Megaphone className="w-5 h-5" />}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateAnnouncement;
