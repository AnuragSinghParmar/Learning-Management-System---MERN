import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers, Users, BookOpen, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MySections = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:5000/api/teacher/sections', config);
                setSections(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSections();
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
                My Sections
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {loading ? (
                        <div className="col-span-full text-center text-gray-500 py-20">Loading sections...</div>
                    ) : sections.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-20">No sections assigned to you yet.</div>
                    ) : (
                        sections.map((section, i) => (
                            <motion.div
                                key={section._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#18181b] border border-white/10 p-6 rounded-2xl hover:border-purple-500/50 transition-all group"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-xl">
                                        {section.name}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{section.department}</h3>
                                        <div className="text-sm text-gray-400">{section.department} - Section {section.name}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white/5 p-3 rounded-xl">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs uppercase font-semibold">
                                            <Users className="w-3 h-3" /> Students
                                        </div>
                                        <div className="text-2xl font-bold text-white">{section.students.length}</div>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs uppercase font-semibold">
                                            <Calendar className="w-3 h-3" /> Year
                                        </div>
                                        <div className="text-2xl font-bold text-white">2024</div>
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

export default MySections;
