import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { UserCog, Users, ArrowLeft, Search, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const SectionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [section, setSection] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]); 
    const [loading, setLoading] = useState(true);

    
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [studentSearch, setStudentSearch] = useState('');

    const fetchDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            
            
            
            

            
            const sectionsRes = await axios.get('http://localhost:5000/api/sections', config);
            const currentSection = sectionsRes.data.find(s => s._id === id);
            setSection(currentSection);

            
            const teachersRes = await axios.get('http://localhost:5000/api/admin/teachers', config);
            setTeachers(teachersRes.data);

            
            
            const studentsRes = await axios.get('http://localhost:5000/api/admin/users', config);
            setStudents(studentsRes.data);

            if (currentSection?.teacher) setSelectedTeacher(currentSection.teacher._id);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleAssignTeacher = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/sections/${id}`, { teacherId: selectedTeacher }, config);
            alert('Teacher Assigned Successfully');
            fetchDetails();
        } catch (error) {
            alert('Error assigning teacher');
        }
    };

    const handleAddStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`http://localhost:5000/api/sections/${id}/assign`, { studentIds: selectedStudents }, config);
            alert('Students Added Successfully');
            setSelectedStudents([]);
            fetchDetails();
        } catch (error) {
            alert('Error adding students');
        }
    };

    const toggleStudentSelection = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(selectedStudents.filter(id => id !== studentId));
        } else {
            setSelectedStudents([...selectedStudents, studentId]);
        }
    };

    if (loading) return <div className="text-white text-center py-20">Loading...</div>;
    if (!section) return <div className="text-white text-center py-20">Section Not Found</div>;

    const filteredAvailableStudents = students.filter(s =>
        !section.students.some(existing => existing._id === s._id) && 
        (s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase()))
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <button onClick={() => navigate('/admin/sections')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Sections
            </button>

            <div className="bg-[#18181b] border border-white/10 p-8 rounded-2xl">
                <h1 className="text-3xl font-bold text-white mb-2">{section.department} - Section {section.name}</h1>
                <p className="text-gray-400">Manage teacher and student allotments.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {}
                <div className="bg-[#18181b] border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                            <UserCog className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Class Teacher</h2>
                    </div>

                    <div className="space-y-4">
                        <select
                            value={selectedTeacher}
                            onChange={(e) => setSelectedTeacher(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-purple-500"
                        >
                            <option value="">Select a Teacher</option>
                            {teachers.map(t => (
                                <option key={t._id} value={t._id}>{t.name} ({t.department})</option>
                            ))}
                        </select>
                        <button
                            onClick={handleAssignTeacher}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
                        >
                            Update Teacher
                        </button>
                    </div>
                </div>

                {}
                <div className="bg-[#18181b] border border-white/10 p-6 rounded-2xl flex flex-col h-[32rem]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Enrolled Students ({section.students.length})</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                        {section.students.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">No students enrolled yet.</div>
                        ) : (
                            section.students.map(student => (
                                <div key={student._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg group">
                                    <div>
                                        <div className="font-medium text-white">{student.name}</div>
                                        <div className="text-xs text-gray-500">{student.universityId}</div>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (!window.confirm('Remove from section?')) return;
                                            try {
                                                const token = localStorage.getItem('token');
                                                const config = { headers: { Authorization: `Bearer ${token}` } };
                                                await axios.delete(`http://localhost:5000/api/sections/${id}/students/${student._id}`, config);
                                                fetchDetails();
                                            } catch (e) {
                                                alert('Failed to remove student');
                                            }
                                        }}
                                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                        title="Remove from Class"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {}
            <div className="bg-[#18181b] border border-white/10 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Add Students</h2>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search available students..."
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="h-64 overflow-y-auto border border-white/5 rounded-xl mb-4 pr-2">
                    {filteredAvailableStudents.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No students found available to add.</div>
                    ) : (
                        <div className="space-y-1 p-2">
                            {filteredAvailableStudents.map(student => (
                                <div
                                    key={student._id}
                                    onClick={() => toggleStudentSelection(student._id)}
                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border ${selectedStudents.includes(student._id)
                                        ? 'bg-indigo-500/20 border-indigo-500/50'
                                        : 'hover:bg-white/5 border-transparent'
                                        }`}
                                >
                                    <div>
                                        <div className="text-white font-medium">{student.name}</div>
                                        <div className="text-xs text-gray-500">{student.universityId} | {student.department}</div>
                                    </div>
                                    {selectedStudents.includes(student._id) && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{selectedStudents.length} students selected</span>
                    <button
                        onClick={handleAddStudents}
                        disabled={selectedStudents.length === 0}
                        className={`px-6 py-2 rounded-xl font-medium transition-colors ${selectedStudents.length > 0
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Success Add Selected
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SectionDetails;
