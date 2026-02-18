import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, ArrowRight, CheckCircle2, Shield, GraduationCap, User } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '', role: 'student' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`http://${window.location.hostname}:5000/api/auth/login`, formData);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user)); 

            if (data.user.role === 'admin') navigate('/admin');
            else if (data.user.role === 'teacher') navigate('/teacher');
            else navigate('/student');

        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { id: 'student', label: 'Student', icon: GraduationCap, description: 'Access course materials & grades' },
        { id: 'teacher', label: 'Teacher', icon: User, description: 'Manage classes & assignments' },
        { id: 'admin', label: 'Admin', icon: Shield, description: 'System administration' },
    ];

    return (
        <div className="min-h-screen w-full flex bg-[#09090b] text-white overflow-hidden font-sans">
            {}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex flex-col justify-between w-1/2 relative p-12 overflow-hidden"
            >
                {}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-950 to-black opacity-90" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                            <span className="text-sm">ED</span>
                        </div>
                        EduPortal
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
                        Empowering the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Future of Education
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Streamline your academic journey with our comprehensive management dashboard. Connect, learn, and grow efficiently.
                    </p>
                </div>

                <div className="relative z-10 text-sm text-gray-500">
                    © 2024 EduPortal Inc. All rights reserved.
                </div>
            </motion.div>

            {}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-[#09090b]">
                <div className="w-full max-w-md space-y-10">
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Sign in</h2>
                        <p className="text-gray-400">Choose your role to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {roles.map((role) => {
                                const Icon = role.icon;
                                const isActive = formData.role === role.id;
                                return (
                                    <div
                                        key={role.id}
                                        onClick={() => setFormData({ ...formData, role: role.id })}
                                        className={`cursor-pointer relative p-4 rounded-xl border transition-all duration-200 group ${isActive
                                            ? 'bg-blue-600/10 border-blue-500/50'
                                            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center gap-3 text-center">
                                            <Icon className={`w-6 h-6 ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'}`} />
                                            <span className={`text-sm font-medium ${isActive ? 'text-blue-100' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                                {role.label}
                                            </span>
                                        </div>
                                        {isActive && (
                                            <div className="absolute top-2 right-2">
                                                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={formData.role}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-[#18181b] border border-white/10 rounded-lg px-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                                            placeholder="name@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-sm font-medium text-gray-300">Password</label>
                                        <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</a>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full bg-[#18181b] border border-white/10 rounded-lg px-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
