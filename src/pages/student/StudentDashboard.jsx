import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BookOpen, Calendar, HelpCircle, MessageCircle, FileText, Megaphone, Bell, CheckCircle, ClipboardList } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import DashboardLayout from '../../components/DashboardLayout';
import StudentAssignments from './StudentAssignments';
import StudentEvents from './StudentEvents';
import StudentAttendance from './StudentAttendance';
import LostFound from './LostFound';
import StudentTests from './StudentTests';

const StudentOverview = () => {
    const [stats, setStats] = useState({ assignments: 0, events: 0, announcements: 0, sectionName: '...' });
    const [announcements, setAnnouncements] = useState([]);
    const [user, setUser] = useState(null);
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.welcome-banner', {
            scale: 0.95,
            opacity: 0,
            duration: 0.8,
            y: 20
        })
            .from('.banner-text', {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1
            }, '-=0.4')
            .from('.quick-stat', {
                x: -20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1
            }, '-=0.2')
            .from('.content-card', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.2
            }, '-=0.3');

    }, { scope: containerRef });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = JSON.parse(localStorage.getItem('user'));
                if (userData) setUser(userData);

                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [statsRes, announcementsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/student/stats', config),
                    axios.get('http://localhost:5000/api/announcements', config)
                ]);

                setStats(statsRes.data);
                setAnnouncements(announcementsRes.data.filter(a => a.targetAudience === 'all' || a.targetAudience === 'student'));
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div ref={containerRef} className="space-y-6">
            <div className="welcome-banner p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 shadow-2xl overflow-hidden relative group">
                <div className="relative z-10">
                    <h2 className="banner-text text-3xl font-bold text-white mb-2">Welcome back, {user?.name.split(' ')[0]}!</h2>
                    <p className="banner-text text-indigo-100 text-lg">
                        You are in <span className="font-bold bg-white/20 px-2 py-0.5 rounded-lg">{stats.sectionName}</span>
                    </p>
                    <div className="mt-6 flex flex-wrap gap-4">
                        <div className="quick-stat bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10 hover:bg-black/30 transition-colors">
                            <FileText className="w-5 h-5 text-blue-200" />
                            <span className="font-bold">{stats.assignments} Assignments Due</span>
                        </div>
                        <div className="quick-stat bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10 hover:bg-black/30 transition-colors">
                            <Calendar className="w-5 h-5 text-indigo-200" />
                            <span className="font-bold">{stats.events} Upcoming Events</span>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/40 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl group-hover:scale-110 transition-transform duration-700 ease-in-out" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {}
                <div className="content-card bg-[#18181b] border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                            <Megaphone className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Announcements</h2>
                    </div>
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {announcements.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">No announcements.</div>
                        ) : (
                            announcements.map((ann, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-white text-sm">{ann.title}</h3>
                                        <span className="text-[10px] text-gray-500">{new Date(ann.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-400">{ann.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {}
                <div className="content-card bg-[#18181b] border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                            <Bell className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Notifications</h2>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-gray-300 text-sm">
                            Keep track of your assignments and event schedules here.
                            <br /><br />
                            Make sure to submit tasks before the deadline!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StudentDashboard = () => {
    const links = [
        { label: 'Overview', path: '/student', icon: BookOpen },
        { label: 'Assignments', path: '/student/assignments', icon: FileText },
        { label: 'Online Tests', path: '/student/tests', icon: ClipboardList },
        { label: 'Attendance', path: '/student/attendance', icon: CheckCircle },
        { label: 'Campus Events', path: '/student/events', icon: Calendar },
        { label: 'Lost & Found', path: '/student/lost-found', icon: HelpCircle },
    ];

    return (
        <DashboardLayout title="Student Portal" links={links}>
            <Routes>
                <Route path="/" element={<StudentOverview />} />
                <Route path="/assignments" element={<StudentAssignments />} />
                <Route path="/tests" element={<StudentTests />} />
                <Route path="/attendance" element={<StudentAttendance />} />
                <Route path="/events" element={<StudentEvents />} />
                <Route path="/lost-found" element={<LostFound />} />
            </Routes>
        </DashboardLayout>
    );
};

export default StudentDashboard;
