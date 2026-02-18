import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { UserPlus, Mail, Hash, BookOpen, CheckCircle2, AlertCircle, UserCog } from 'lucide-react';

const AddTeacher = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        universityId: '',
        department: ''
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
            const { data } = await axios.post('http://localhost:5000/api/admin/add-teacher', formData, config);

            setStatus({ type: 'success', message: `Successfully added Teacher: ${data.name}` });
            setFormData({ name: '', email: '', universityId: '', department: '' });
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to add teacher';
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    Add New Teacher
                </h1>
                <p className="text-gray-400 mt-2">Onboard a new faculty member.</p>
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
                        <label className="text-sm font-medium text-gray-400">Full Name</label>
                        <div className="relative">
                            <UserCog className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                placeholder="Dr. John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-sm font-medium text-gray-400">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                placeholder="teacher@university.edu"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Employee ID</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                name="universityId"
                                value={formData.universityId}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                placeholder="EMP001"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Department</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none"
                                required
                            >
                                <option value="" className="text-gray-500">Select Department</option>
                                <option value="CSE" className="text-black">Computer Science (CSE)</option>
                                <option value="ECE" className="text-black">Electronics (ECE)</option>
                                <option value="MECH" className="text-black">Mechanical (MECH)</option>
                                <option value="CIVIL" className="text-black">Civil</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${loading
                                    ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-600/25 hover:scale-[1.01]'
                                }`}
                        >
                            {loading ? 'Adding...' : 'Add Teacher'}
                            {!loading && <UserPlus className="w-5 h-5" />}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddTeacher;
