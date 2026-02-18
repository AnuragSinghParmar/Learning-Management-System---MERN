import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, User, Clock, CheckCircle } from 'lucide-react';

const StudentAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/student/assignments', config);
            setAssignments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB');
                return;
            }
            if (selectedFile.type !== 'application/pdf') {
                alert('Only PDF files are allowed');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !selectedAssignment) return;

        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                await axios.post('http://localhost:5000/api/student/assignments/submit', {
                    assignmentId: selectedAssignment._id,
                    fileUrl: reader.result 
                }, config);

                alert('Assignment submitted successfully!');
                setSelectedAssignment(null);
                setFile(null);
            } catch (error) {
                console.error(error);
                alert('Submission failed.');
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="max-w-6xl mx-auto relative">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                    My Assignments
                </h1>
                <p className="text-gray-400 mt-2">View and manage your tasks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                    {loading ? (
                        <div className="col-span-full text-center text-gray-500 py-20">Loading assignments...</div>
                    ) : assignments.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-20">No pending assignments. Great job!</div>
                    ) : (
                        assignments.map((assignment, i) => (
                            <motion.div
                                key={assignment._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#18181b] p-6 rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${new Date(assignment.dueDate) < new Date() ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            : 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        }`}>
                                        {new Date(assignment.dueDate) < new Date() ? 'Overdue' : 'Active'}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">{assignment.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">{assignment.description || 'No description.'}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <User className="w-4 h-4" />
                                        <span>Teacher: {assignment.teacher?.name || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        <span>Due: {new Date(assignment.dueDate).toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                    onClick={() => setSelectedAssignment(assignment)}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Submit Assignment
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {}
            <AnimatePresence>
                {selectedAssignment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[#18181b] border border-white/10 rounded-2xl p-8 max-w-md w-full relative"
                        >
                            <h2 className="text-2xl font-bold text-white mb-2">Submit Assignment</h2>
                            <p className="text-gray-400 mb-6 text-sm">Upload a PDF for <b>{selectedAssignment.title}</b></p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-indigo-500/50 transition-colors">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="pdf-upload"
                                    />
                                    <label htmlFor="pdf-upload" className="cursor-pointer block">
                                        <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                        {file ? (
                                            <span className="text-indigo-400 font-medium break-all">{file.name}</span>
                                        ) : (
                                            <span className="text-gray-400">Click to upload PDF (Max 5MB)</span>
                                        )}
                                    </label>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedAssignment(null); setFile(null); }}
                                        className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!file || uploading}
                                        className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {uploading ? 'Uploading...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentAssignments;
