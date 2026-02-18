import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, BookOpen, Layers, CheckSquare, Plus, Folder, Calendar, Megaphone, Bell, FileText } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import DashboardLayout from '../../components/DashboardLayout';
import MySections from './MySections';
import TeacherAssignments from './TeacherAssignments';
import TeacherAttendance from './TeacherAttendance';
import TeacherEvents from './TeacherEvents';
import TeacherTests from './TeacherTests';

const TeacherOverview = () => {
    const [stats, setStats] = useState({ sections: 0, students: 0, assignments: 0 });
    const [announcements, setAnnouncements] = useState([]);
    const [user, setUser] = useState(null);
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.header-text', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        })
            .from('.stat-card', {
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15
            }, '-=0.4')
            .from('.content-section', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.2
            }, '-=0.2');

    }, { scope: containerRef });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = JSON.parse(localStorage.getItem('user'));
                if (userData) setUser(userData);

                const config = { headers: { Authorization: `Bearer ${token}` } };

                
                const [statsRes, announcementsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/teacher/stats', config),
                    axios.get('http://localhost:5000/api/announcements', config)
                ]);

                setStats(statsRes.data);
                setAnnouncements(announcementsRes.data.filter(a => a.targetAudience === 'all' || a.targetAudience === 'teacher'));
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div ref={containerRef} className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="header-text text-3xl font-bold text-white">
                        Welcome, <span className="text-purple-400">{user?.name}</span>
                    </h1>
                    <p className="header-text text-gray-400 mt-1">Manage your classes and assignments.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'My Sections', value: stats.sections, icon: Layers, color: 'from-blue-500 to-blue-600' },
                    { label: 'Total Students', value: stats.students, icon: Users, color: 'from-indigo-500 to-indigo-600' },
                    { label: 'Assignments', value: stats.assignments, icon: BookOpen, color: 'from-purple-500 to-purple-600' },
                ].map((stat, i) => (
                    <div key={i} className={`stat-card p-6 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}>
                        <stat.icon className="absolute right-4 top-4 w-12 h-12 text-white/20 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-white/80 font-medium">{stat.label}</h3>
                        <p className="text-4xl font-bold mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {}
                <div className="content-section bg-[#18181b] border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                            <Megaphone className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Announcements</h2>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {announcements.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">No active announcements.</div>
                        ) : (
                            announcements.map((ann, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-white">{ann.title}</h3>
                                        <span className="text-xs text-gray-500">{new Date(ann.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">{ann.message}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            {ann.targetAudience}
                                        </span>
                                        <span>• Posted by {ann.postedBy?.name || 'Admin'}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {}
                <div className="content-section bg-[#18181b] border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                            <Bell className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Notifications</h2>
                    </div>
                    <p className="text-gray-400">
                        Check here for latest updates on your submissions and system notifications.
                        <br /><br />
                        <span className="text-sm italic opacity-70">(System notifications coming soon)</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

const TeacherDashboard = () => {
    const links = [
        { label: 'Overview', path: '/teacher', icon: Users },
        { label: 'My Sections', path: '/teacher/sections', icon: Layers },
        { label: 'Assignments', path: '/teacher/assignments', icon: CheckSquare },
        { label: 'Online Tests', path: '/teacher/tests', icon: FileText },
        { label: 'Attendance', path: '/teacher/attendance', icon: Calendar },
        { label: 'Events', path: '/teacher/events', icon: Calendar },
    ];

    return (
        <DashboardLayout title="Teacher Portal" links={links}>
            <Routes>
                <Route path="/" element={<TeacherOverview />} />
                <Route path="/sections" element={<MySections />} />
                <Route path="/assignments" element={<TeacherAssignments />} />
                <Route path="/tests" element={<TeacherTests />} />
                <Route path="/attendance" element={<TeacherAttendance />} />
                <Route path="/events" element={<TeacherEvents />} />
            </Routes>
        </DashboardLayout>
    );
};

export default TeacherDashboard;
