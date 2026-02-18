import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

const TeacherAttendance = () => {
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendanceRecord, setAttendanceRecord] = useState({}); 
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    
    useEffect(() => {
        const fetchSections = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:5000/api/teacher/sections', config);
                setSections(data);
                if (data.length > 0) setSelectedSection(data[0]._id);
            } catch (error) {
                console.error('Error fetching sections');
            }
        };
        fetchSections();
    }, []);

    
    useEffect(() => {
        if (!selectedSection) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                
                
                
                
                const currentSection = sections.find(s => s._id === selectedSection);
                if (!currentSection) return;

                const studentList = currentSection.students;
                setStudents(studentList);

                
                const initialStatus = {};
                studentList.forEach(s => initialStatus[s._id] = 'Present');

                
                const { data } = await axios.get(`http://localhost:5000/api/attendance?sectionId=${selectedSection}&date=${selectedDate}`, config);

                if (data) {
                    
                    data.records.forEach(r => {
                        initialStatus[r.student._id || r.student] = r.status;
                    });
                    setStatus({ type: 'info', message: 'Loaded existing attendance record.' });
                } else {
                    setStatus(null);
                }

                setAttendanceRecord(initialStatus);

            } catch (error) {
                console.error(error);
                setStatus({ type: 'error', message: 'Failed to load data.' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedSection, selectedDate, sections]); 

    const markStatus = (studentId, status) => {
        setAttendanceRecord(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const records = Object.keys(attendanceRecord).map(studentId => ({
                student: studentId,
                status: attendanceRecord[studentId]
            }));

            await axios.post('http://localhost:5000/api/attendance', {
                sectionId: selectedSection,
                date: selectedDate,
                records
            }, config);

            setStatus({ type: 'success', message: 'Attendance marked successfully!' });
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to save attendance.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                    Mark Attendance
                </h1>
                <p className="text-gray-400 mt-1">Daily class attendance log.</p>
            </div>

            {}
            <div className="bg-[#18181b] border border-white/10 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Select Class Section</label>
                    <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-green-500"
                    >
                        {sections.map(s => (
                            <option key={s._id} value={s._id}>{s.department} - {s.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-green-500 [color-scheme:dark]"
                    />
                </div>
            </div>

            {}
            {status && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                        status.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
                            <AlertCircle className="w-5 h-5" />}
                    {status.message}
                </div>
            )}

            {}
            <div className="bg-[#18181b] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-semibold text-white">Students ({students.length})</h3>
                    <div className="text-xs text-gray-400 flex gap-4">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Present</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Absent</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Late</span>
                    </div>
                </div>

                <div className="divide-y divide-white/5">
                    {students.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No students in this section.</div>
                    ) : (
                        students.map(student => (
                            <div key={student._id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${attendanceRecord[student._id] === 'Present' ? 'bg-green-500/20 text-green-400' :
                                        attendanceRecord[student._id] === 'Absent' ? 'bg-red-500/20 text-red-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{student.name}</div>
                                        <div className="text-xs text-gray-500">{student.universityId}</div>
                                    </div>
                                </div>

                                <div className="flex bg-black/20 rounded-lg p-1 border border-white/5">
                                    <button
                                        onClick={() => markStatus(student._id, 'Present')}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${attendanceRecord[student._id] === 'Present'
                                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        Present
                                    </button>
                                    <button
                                        onClick={() => markStatus(student._id, 'Absent')}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${attendanceRecord[student._id] === 'Absent'
                                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        Absent
                                    </button>
                                    <button
                                        onClick={() => markStatus(student._id, 'Late')}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${attendanceRecord[student._id] === 'Late'
                                                ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        Late
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={loading || students.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-600/20 rounded-xl text-white font-bold transition-all disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Attendance'}
                </button>
            </div>
        </div>
    );
};

export default TeacherAttendance;
