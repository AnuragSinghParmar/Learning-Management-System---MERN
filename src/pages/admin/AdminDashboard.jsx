import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, Calendar, Bell, Settings, Search, UserPlus, UserCog, CalendarPlus, List, Megaphone, Layers } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import AddStudent from './AddStudent';
import ManageUsers from './ManageUsers';
import AddTeacher from './AddTeacher';
import ManageTeachers from './ManageTeachers';
import CreateEvent from './CreateEvent';
import ManageEvents from './ManageEvents';
import CreateAnnouncement from './CreateAnnouncement';
import ManageAnnouncements from './ManageAnnouncements';
import ManageSections from './Sections/ManageSections';
import SectionDetails from './Sections/SectionDetails';
const Overview = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ students: 0, teachers: 0, events: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = JSON.parse(localStorage.getItem('user'));
                if (userData) setUser(userData);

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:5000/api/admin/stats', config);
                if (data.students !== undefined) setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const quickActions = [
        { label: 'Add Student', icon: UserPlus, path: '/admin/add-student' },
        { label: 'Post Announcement', icon: Megaphone, path: '/admin/announcements/create' },
        { label: 'Create Event', icon: CalendarPlus, path: '/admin/events/create' },
        { label: 'Manage Sections', icon: Layers, path: '/admin/sections' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Welcome back, <span className="text-blue-400">{user?.name || 'Admin'}</span>
                    </h1>
                    <p className="text-gray-400 mt-1">Here's what's happening in your university today.</p>
                </div>
                <div className="text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Students', value: loading ? '...' : stats.students, color: 'from-blue-500 to-blue-600' },
                    { label: 'Total Teachers', value: loading ? '...' : stats.teachers, color: 'from-purple-500 to-purple-600' },
                    { label: 'Active Events', value: loading ? '...' : stats.events, color: 'from-emerald-500 to-emerald-600' },
                ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg transition-transform hover:scale-[1.02]`}>
                        <h3 className="text-white/80 font-medium">{stat.label}</h3>
                        <p className="text-4xl font-bold mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            { }
            <div className="col-span-full mt-8">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {quickActions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(action.path)}
                            className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer"
                        >
                            <action.icon className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform mb-3" />
                            <span className="text-sm font-medium text-gray-300">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const links = [
        { label: 'Overview', path: '/admin', icon: Users },
        { label: 'Sections', path: '/admin/sections', icon: Layers },
        { label: 'Add Student', path: '/admin/add-student', icon: UserPlus },
        { label: 'Manage Students', path: '/admin/users', icon: Search },
        { label: 'Add Teacher', path: '/admin/add-teacher', icon: UserCog },
        { label: 'Manage Teachers', path: '/admin/teachers', icon: Search },
        { label: 'Create Event', path: '/admin/events/create', icon: CalendarPlus },
        { label: 'Manage Events', path: '/admin/events', icon: Calendar },
        { label: 'Post Announcement', path: '/admin/announcements/create', icon: Megaphone },
        { label: 'Announcements', path: '/admin/announcements', icon: List },
    ];

    return (
        <DashboardLayout title="Admin" links={links}>
            <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/sections" element={<ManageSections />} />
                <Route path="/sections/:id" element={<SectionDetails />} />
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/users" element={<ManageUsers />} />
                <Route path="/add-teacher" element={<AddTeacher />} />
                <Route path="/teachers" element={<ManageTeachers />} />
                <Route path="/events/create" element={<CreateEvent />} />
                <Route path="/events" element={<ManageEvents />} />
                <Route path="/announcements/create" element={<CreateAnnouncement />} />
                <Route path="/announcements" element={<ManageAnnouncements />} />
            </Routes>
        </DashboardLayout>
    );
};

export default AdminDashboard;
