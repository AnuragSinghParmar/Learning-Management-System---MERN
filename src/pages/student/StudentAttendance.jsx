import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const StudentAttendance = () => {
    const [data, setData] = useState({ stats: { total: 0, present: 0, absent: 0, late: 0, percentage: 0 }, history: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:5000/api/student/attendance', config);
                setData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const chartData = [
        { name: 'Present', value: data.stats.present, color: '#10b981' },
        { name: 'Absent', value: data.stats.absent, color: '#ef4444' },
        { name: 'Late', value: data.stats.late, color: '#eab308' },
    ];

    if (loading) return <div className="text-center text-gray-500 py-20">Loading attendance data...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                Attendance Analytics
            </h1>

            {}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-[#18181b] border border-white/10 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Total Classes</p>
                        <p className="text-3xl font-bold text-white mt-1">{data.stats.total}</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                        <Calendar className="w-6 h-6" />
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-[#18181b] border border-white/10 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Present</p>
                        <p className="text-3xl font-bold text-green-400 mt-1">{data.stats.present}</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-[#18181b] border border-white/10 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Absent</p>
                        <p className="text-3xl font-bold text-red-400 mt-1">{data.stats.absent}</p>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
                        <XCircle className="w-6 h-6" />
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-[#18181b] border border-white/10 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Attendance %</p>
                        <p className={`text-3xl font-bold mt-1 ${Number(data.stats.percentage) >= 75 ? 'text-green-400' : 'text-red-400'
                            }`}>{data.stats.percentage}%</p>
                    </div>
                    <div className="w-16 h-16">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    innerRadius={20}
                                    outerRadius={30}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {}
                <div className="lg:col-span-2 bg-[#18181b] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="font-bold text-white text-lg">History</h3>
                    </div>
                    <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
                        {data.history.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No attendance records found.</div>
                        ) : (
                            data.history.map((record, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl font-mono text-gray-300">
                                            {new Date(record.date).toLocaleDateString()}
                                        </div>
                                        <div>
                                            {}
                                            <div className="text-sm text-gray-400">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${record.status === 'Present' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            record.status === 'Absent' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                        {record.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {}
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl h-fit">
                    <h3 className="text-xl font-bold mb-4">Insights</h3>
                    <p className="opacity-90 mb-6">
                        {Number(data.stats.percentage) >= 75
                            ? "Great job! Your attendance is above the required 75%. Keep it up!"
                            : "Warning: Your attendance is below 75%. Please ensure you attend remaining classes to avoid penalties."}
                    </p>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm opacity-80">
                            <span>Required</span>
                            <span>75%</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <div className="flex justify-between text-sm opacity-80">
                            <span>Current</span>
                            <span>{data.stats.percentage}%</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2">
                            <div className={`h-2 rounded-full ${Number(data.stats.percentage) >= 75 ? 'bg-green-400' : 'bg-red-400'}`} style={{ width: `${Math.min(data.stats.percentage, 100)}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendance;
