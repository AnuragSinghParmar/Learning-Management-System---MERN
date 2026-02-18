import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Download } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardLayout = ({ title, links, children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-900 text-white">
            {}
            <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col z-20">
                <div className="p-6">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Nexus<span className="text-white">Edu</span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{title} Portal</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;

                        return (
                            <div key={link.path} onClick={() => navigate(link.path)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`} />
                                <span className="font-medium">{link.label}</span>
                                {isActive && <motion.div layoutId="active-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    {deferredPrompt && (
                        <button
                            onClick={handleInstallClick}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-green-400 hover:bg-green-500/10 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            <span className="font-medium">Install App</span>
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {}
            <main className="flex-1 overflow-y-auto relative z-10">
                <header className="sticky top-0 z-10 px-8 py-4 bg-slate-900/50 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-white">{links.find(l => l.path === location.pathname)?.label || 'Dashboard'}</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                            {title[0]}
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
