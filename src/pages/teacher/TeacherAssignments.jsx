import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileText, CheckCircle, ExternalLink, Download, Plus, X } from 'lucide-react';

const TeacherAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [viewingSubmissionsFor, setViewingSubmissionsFor] = useState(null);
    const [loading, setLoading] = useState(true);

    
    const [showModal, setShowModal] = useState(false);
    const [sections, setSections] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        sectionId: ''
    });

    useEffect(() => {
        fetchAssignments();
        fetchSections();
    }, []);

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const { data } = await axios.get('http://localhost:5000/api/teacher/assignments', config);
            setAssignments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSections = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/teacher/sections', config);
            setSections(data);
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    };

    const fetchSubmissions = async (assignmentId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`http://localhost:5000/api/teacher/assignments/${assignmentId}/submissions`, config);
            setSubmissions(data);
            setViewingSubmissionsFor(assignmentId);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('http://localhost:5000/api/teacher/assignments', formData, config);

            setShowModal(false);
            setFormData({ title: '', description: '', dueDate: '', sectionId: '' });
            fetchAssignments(); 
        } catch (error) {
            console.error('Error creating assignment:', error);
            alert(error.response?.data?.message || 'Error creating assignment');
        }
    };

    const downloadPdf = (base64, filename) => {
        const link = document.createElement('a');
        link.href = base64;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-6xl mx-auto relative">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Manage Assignments</h1>
                {!viewingSubmissionsFor && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" /> Add Assignment
                    </button>
                )}
            </div>

            {!viewingSubmissionsFor ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? <p className="text-gray-500">Loading...</p> : assignments.map(assignment => (
                        <div key={assignment._id} className="bg-[#18181b] p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all">
                            <h3 className="text-xl font-bold text-white mb-2">{assignment.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{assignment.description}</p>

                            <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded">
                                    {assignment.section?.name || 'Section'}
                                </span>
                            </div>

                            <button
                                onClick={() => fetchSubmissions(assignment._id)}
                                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Users className="w-4 h-4" /> View Submissions
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <button
                        onClick={() => setViewingSubmissionsFor(null)}
                        className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
                    >
                        ← Back to Assignments
                    </button>

                    <div className="bg-[#18181b] rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">Submissions</h2>
                        </div>
                        <div className="divide-y divide-white/10">
                            {submissions.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No submissions yet.</div>
                            ) : (
                                submissions.map(sub => (
                                    <div key={sub._id} className="p-4 flex items-center justify-between hover:bg-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                                                {sub.student?.name?.[0] || 'S'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{sub.student?.name}</h4>
                                                <p className="text-sm text-gray-500">Submitted: {new Date(sub.submittedAt).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => downloadPdf(sub.fileUrl, `Submission_${sub.student?.name}.pdf`)}
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 text-sm"
                                        >
                                            <Download className="w-4 h-4" /> Download PDF
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#18181b] rounded-2xl border border-white/10 w-full max-w-md overflow-hidden relative"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Create Assignment</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                        placeholder="e.g., Chapter 1 Review"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 h-24 resize-none"
                                        placeholder="Enter assignment instructions..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Section</label>
                                    <select
                                        required
                                        value={formData.sectionId}
                                        onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="">Select a section</option>
                                        {sections.map(section => (
                                            <option key={section._id} value={section._id}>
                                                {section.name} ({section.department})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors mt-2"
                                >
                                    Create Assignment
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherAssignments;
