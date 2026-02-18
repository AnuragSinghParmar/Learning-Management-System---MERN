import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Layers, BookOpen, UserCog, ArrowRight, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ManageSections = () => {
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newSection, setNewSection] = useState({ name: '', department: '' });

    const fetchSections = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/sections', config);
            setSections(data);
        } catch (error) {
            console.error('Error fetching sections:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/sections', newSection, config);
            setShowCreateModal(false);
            setNewSection({ name: '', department: '' });
            fetchSections();
        } catch (error) {
            alert('Failed to create section');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/sections/${id}`, config);
            setSections(sections.filter(s => s._id !== id));
        } catch (error) {
            alert('Failed to delete section');
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                        Class Sections
                    </h1>
                    <p className="text-gray-400 mt-1">Manage academic sections and allotments.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-lg shadow-indigo-600/20"
                >
                    <Plus className="w-4 h-4" />
                    New Section
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {sections.map((section) => (
                        <motion.div
                            key={section._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#18181b] border border-white/10 p-6 rounded-2xl hover:border-indigo-500/50 transition-all group relative"
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(section._id);
                                    }}
                                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xl font-bold">
                                    {section.name}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{section.department} - {section.name}</h3>
                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                        <UserCog className="w-3 h-3" />
                                        {section.teacher ? section.teacher.name : 'No Class Teacher'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                                <span className="text-sm text-gray-400">
                                    {section.students?.length || 0} Students
                                </span>
                                <button
                                    onClick={() => navigate(`/admin/sections/${section._id}`)}
                                    className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                                >
                                    Manage
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#18181b] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-white mb-4">Create New Section</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Department</label>
                                <select
                                    value={newSection.department}
                                    onChange={(e) => setNewSection({ ...newSection, department: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="MECH">MECH</option>
                                    <option value="CIVIL">CIVIL</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Section Name</label>
                                <input
                                    type="text"
                                    value={newSection.name}
                                    onChange={(e) => setNewSection({ ...newSection, name: e.target.value.toUpperCase() })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                                    placeholder="e.g. A, B, C"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 rounded-lg text-gray-400 hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                                >
                                    Create Section
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ManageSections;
