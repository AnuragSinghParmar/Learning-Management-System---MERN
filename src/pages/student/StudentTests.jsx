import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Clock, CheckCircle, AlertTriangle, Maximize, XCircle } from 'lucide-react';

const StudentTests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTest, setActiveTest] = useState(null);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5000/api/student/tests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTests(data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const startTest = async (test) => {
        if (window.confirm("Starting the test will enter Fullscreen mode. Switching tabs or exiting fullscreen will be recorded as violations. Ready?")) {
            try {
                await document.documentElement.requestFullscreen();
            } catch (err) {
                console.error("Could not enter fullscreen:", err);
            }
            setActiveTest(test);
        }
    };

    if (activeTest) {
        return <TestInterface test={activeTest} exitTest={() => { setActiveTest(null); fetchTests(); }} />;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Online Tests</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <p className="text-gray-500">Loading...</p> : tests.map(test => (
                    <div key={test._id} className="bg-[#18181b] p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all">
                        <h3 className="text-xl font-bold text-white mb-2">{test.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{test.description}</p>

                        <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {test.duration} mins</span>
                            <span>{test.questionCount} Questions</span>
                        </div>

                        {test.isSubmitted ? (
                            <button disabled className="w-full py-2 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                                <CheckCircle className="w-4 h-4" /> Completed
                            </button>
                        ) : (
                            <button onClick={() => startTest(test)} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                                <FileText className="w-4 h-4" /> Start Attempt
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {tests.length === 0 && !loading && <div className="text-center text-gray-500 mt-12">No active tests found.</div>}
        </div>
    );
};

const TestInterface = ({ test, exitTest }) => {
    const [timeLeft, setTimeLeft] = useState(test.duration * 60);
    const [answers, setAnswers] = useState([]);
    const [violations, setViolations] = useState(0);
    const [showWarning, setShowWarning] = useState(false);

    
    useEffect(() => {
        setAnswers(Array.from({ length: test.questionCount }, (_, i) => ({ question: i + 1, selectedOption: '' })));
    }, [test]);

    
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    submitTest(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    
    useEffect(() => {
        if (violations >= 7) {
            alert("You have exceeded the maximum number of violations (7). Your test will be submitted automatically.");
            submitTest(true);
        }
    }, [violations]);

    
    useEffect(() => {
        const handleVisibilityChange = () => {
            
            if (document.hidden) {
                recordViolation("Tab Switch / Minimized");
            }
        };

        const handleBlur = () => {
            
            recordViolation("Window Focus Lost");
        };

        
        
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                recordViolation("Exited Fullscreen");
            }
        };

        
        const handleContextMenu = (e) => e.preventDefault();

        
        const handleKeyDown = (e) => {
            if ((e.altKey && e.key === 'Tab') || (e.ctrlKey && e.key === 't')) {
                e.preventDefault();
                recordViolation("Restricted Key Combination");
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const recordViolation = (reason) => {
        
        setViolations(v => {
            const newVal = v + 1;
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
            return newVal;
        });
    };

    const handleOptionSelect = (qNum, option) => {
        setAnswers(prev => prev.map(a => a.question === qNum ? { ...a, selectedOption: option } : a));
    };

    const submitTest = async (auto = false) => {
        if (!auto && !window.confirm("Are you sure you want to submit?")) return;

        try {
            const token = localStorage.getItem('token');
            const payload = {
                testId: test._id,
                answers: answers.filter(a => a.selectedOption !== ''), 
                violations
            };

            await axios.post('http://localhost:5000/api/student/tests/submit', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(auto ? "Time's up! Test submitted automatically." : "Test submitted successfully!");
            if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
            exitTest();
        } catch (error) {
            console.error(error);
            alert("Error submitting test. Please try again.");
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-[#09090b] z-[9999] flex flex-col h-screen w-screen overflow-hidden">
            {}
            <div className="bg-[#18181b] p-4 border-b border-white/10 flex justify-between items-center text-white shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold">{test.title}</h2>
                    <span className="px-3 py-1 bg-white/10 rounded text-sm font-mono flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" /> {formatTime(timeLeft)}
                    </span>
                    <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded text-sm font-mono flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Violations: {violations}
                    </span>
                </div>
                <button onClick={() => submitTest()} className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-bold transition-colors">
                    Submit Test
                </button>
            </div>

            {}
            <AnimatePresence>
                {showWarning && (
                    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-xl z-[60] font-bold flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6" /> Warning! Do not switch tabs or exit fullscreen!
                    </motion.div>
                )}
            </AnimatePresence>

            {}
            <div className="flex-1 flex overflow-hidden">
                {}
                <div className="w-2/3 bg-gray-800 h-full border-r border-white/10 relative">
                    {}

                    <iframe
                        src={test.pdfUrl}
                        className="w-full h-full"
                        title="Question Paper"
                    />
                </div>

                {}
                <div className="w-1/3 bg-[#09090b] flex flex-col h-full">
                    <div className="p-4 bg-[#18181b] border-b border-white/10">
                        <h3 className="font-bold text-white">Answer Sheet</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {answers.map((ans, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors">
                                <span className="text-gray-400 font-mono w-8">{ans.question}.</span>
                                <div className="flex gap-2">
                                    {['A', 'B', 'C', 'D'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => handleOptionSelect(ans.question, opt)}
                                            className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${ans.selectedOption === opt
                                                ? 'bg-purple-600 text-white shadow-lg scale-110'
                                                : 'bg-black/40 text-gray-500 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default StudentTests;
