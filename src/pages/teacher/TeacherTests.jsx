import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, X, Search, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const TeacherTests = () => {
    const [tests, setTests] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewResults, setViewResults] = useState(null);
    const [submissionResults, setSubmissionResults] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: 45,
        sectionId: '',
        pdfUrl: '',
        answerKey: []
    });

    const [questionCount, setQuestionCount] = useState(1);

    useEffect(() => {
        fetchTests();
        fetchSections();
    }, []);

    const fetchTests = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5000/api/teacher/tests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTests(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSections = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5000/api/teacher/sections', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSections(data);
        } catch (error) { console.error(error); }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, pdfUrl: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleAnswerKeyChange = (index, value) => {
        const newKey = [...formData.answerKey];
        
        while (newKey.length <= index) newKey.push({ question: newKey.length + 1, answer: '' });

        newKey[index] = { question: index + 1, answer: value };
        setFormData({ ...formData, answerKey: newKey });
    };

    const generateAnswerKey = () => {
        const newKey = Array.from({ length: questionCount }, (_, i) => ({
            question: i + 1,
            answer: formData.answerKey[i]?.answer || 'A'
        }));
        setFormData({ ...formData, answerKey: newKey });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/teacher/tests', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            fetchTests();
            setFormData({ title: '', description: '', duration: 45, sectionId: '', pdfUrl: '', answerKey: [] });
        } catch (error) {
            console.error('Test creation error:', error);
            const errorMsg = error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response?.data : '') ||
                error.message ||
                'Error creating test';
            alert(`Failed to create test: ${errorMsg}`);
        }
    };

    const fetchResults = async (testId) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`http://localhost:5000/api/teacher/tests/${testId}/results`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubmissionResults(data);
            setViewResults(testId);
        } catch (error) { console.error(error); }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Manage Tests</h1>
                {!viewResults && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" /> Create Test
                    </button>
                )}
            </div>

            {!viewResults ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map(test => (
                        <div key={test._id} className="bg-[#18181b] p-6 rounded-2xl border border-white/10 hover:border-pink-500/50 transition-all">
                            <h3 className="text-xl font-bold text-white mb-2">{test.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{test.description}</p>
                            <div className="flex justify-between text-sm text-gray-500 mb-6">
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {test.duration} mins</span>
                                <span className="bg-pink-500/10 text-pink-400 px-2 py-1 rounded">{test.section?.name}</span>
                            </div>
                            <button
                                onClick={() => fetchResults(test._id)}
                                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                            >
                                View Results
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    <button onClick={() => setViewResults(null)} className="mb-4 text-gray-400 hover:text-white">← Back to Tests</button>
                    <div className="bg-[#18181b] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">Test Results</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-400">
                                <thead className="bg-white/5 text-xs uppercase font-bold text-gray-300">
                                    <tr>
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">Score</th>
                                        <th className="px-6 py-4">Violations</th>
                                        <th className="px-6 py-4">Submitted At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {submissionResults.map(sub => (
                                        <tr key={sub._id} className="hover:bg-white/5">
                                            <td className="px-6 py-4 font-medium text-white">{sub.student?.name}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded ${sub.score / sub.maxScore > 0.5 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    {sub.score} / {sub.maxScore}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-red-400 font-bold">{sub.violations}</td>
                                            <td className="px-6 py-4">{new Date(sub.submittedAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#18181b] rounded-2xl border border-white/10 w-full max-w-2xl my-8">
                            <div className="p-6 border-b border-white/10 flex justify-between">
                                <h2 className="text-xl font-bold text-white">Create New Test</h2>
                                <button onClick={() => setShowModal(false)}><X className="text-gray-400 hover:text-white" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Test Title" className="bg-black/20 border border-white/10 rounded px-4 py-2 text-white w-full"
                                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                    <select className="bg-black/20 border border-white/10 rounded px-4 py-2 text-white w-full"
                                        value={formData.sectionId} onChange={e => setFormData({ ...formData, sectionId: e.target.value })} required>
                                        <option value="">Select Section</option>
                                        {sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <textarea placeholder="Description" className="bg-black/20 border border-white/10 rounded px-4 py-2 text-white w-full h-20"
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                <div className="flex gap-4">
                                    <input type="number" placeholder="Duration (min)" className="bg-black/20 border border-white/10 rounded px-4 py-2 text-white w-1/3"
                                        value={formData.duration} onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })} required />
                                    <div className="flex-1">
                                        <label className="block text-xs text-gray-500 mb-1">Upload Question Paper (PDF)</label>
                                        <input type="file" accept="application/pdf" onChange={handleFileUpload} className="text-gray-400 text-sm" required />
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-4">
                                    <h3 className="text-white font-bold mb-2">Answer Key</h3>
                                    <div className="flex gap-2 mb-4">
                                        <input type="number" placeholder="Num Questions" className="bg-black/20 border border-white/10 rounded px-2 py-1 text-white w-20"
                                            value={questionCount} onChange={e => setQuestionCount(Number(e.target.value))} />
                                        <button type="button" onClick={generateAnswerKey} className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20">Set Questions</button>
                                    </div>
                                    <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-2 bg-black/20 rounded">
                                        {formData.answerKey.map((key, i) => (
                                            <div key={i} className="flex items-center gap-1">
                                                <span className="text-gray-500 w-6">{key.question}.</span>
                                                <select className="bg-[#18181b] border border-white/10 rounded text-white text-sm"
                                                    value={key.answer} onChange={e => handleAnswerKeyChange(i, e.target.value)} required>
                                                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg">Create Test</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherTests;
