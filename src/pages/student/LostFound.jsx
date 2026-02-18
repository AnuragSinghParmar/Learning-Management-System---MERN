import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Tag, Phone, Plus, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LostFound = () => {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    
    const [formData, setFormData] = useState({
        type: 'Lost',
        title: '',
        description: '',
        location: '',
        date: '',
        contact: '',
        image: ''
    });

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/lost-found', config);
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/lost-found', formData, config);
            setShowModal(false);
            setFormData({ type: 'Lost', title: '', description: '', location: '', date: '', contact: '' });
            fetchItems();
        } catch (error) {
            console.error(error);
            alert('Failed to post item.');
        }
    };

    const handleResolve = async (id) => {
        if (!confirm('Mark this item as resolved?')) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/lost-found/${id}/resolve`, {}, config);
            fetchItems();
        } catch (error) {
            console.error(error);
            alert('Failed to update status.');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredItems = filter === 'All' ? items : items.filter(i => i.type === filter);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-400">
                        Lost & Found
                    </h1>
                    <p className="text-gray-400 mt-1">Report lost items or help return found ones.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                >
                    <Plus className="w-5 h-5" /> Report Item
                </button>
            </div>

            {}
            <div className="flex gap-2 p-1 bg-[#18181b] rounded-xl w-fit border border-white/10">
                {['All', 'Lost', 'Found'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {loading ? (
                        <div className="col-span-full text-center text-gray-500 py-20">Loading items...</div>
                    ) : filteredItems.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-20">No items found matching your filter.</div>
                    ) : (
                        filteredItems.map((item, i) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-6 rounded-2xl border transition-all relative overflow-hidden group ${item.status === 'Resolved' ? 'bg-[#18181b] border-green-500/20 opacity-70' :
                                    item.type === 'Lost'
                                        ? 'bg-[#18181b] border-red-500/20 hover:border-red-500/50'
                                        : 'bg-[#18181b] border-green-500/20 hover:border-green-500/50'
                                    }`}
                            >
                                {item.image && (
                                    <div className="w-full h-48 mb-4 overflow-hidden rounded-xl">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.type === 'Lost' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                                        }`}>
                                        {item.type}
                                    </span>
                                    {item.status === 'Resolved' && (
                                        <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold flex items-center gap-1">
                                            Resolved
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin className="w-4 h-4" />
                                        <span>{item.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Tag className="w-4 h-4" />
                                        <span>{new Date(item.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Phone className="w-4 h-4" />
                                        <span>{item.contact}</span>
                                    </div>
                                </div>

                                {item.status !== 'Resolved' && item.postedBy._id === user._id && (
                                    <button
                                        onClick={() => handleResolve(item._id)}
                                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-sm transition-colors"
                                    >
                                        Mark as Resolved
                                    </button>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[#18181b] border border-white/10 rounded-2xl p-8 max-w-lg w-full relative"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6">Report Item</h2>

                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-orange-500"
                                        >
                                            <option value="Lost">Lost</option>
                                            <option value="Found">Found</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-orange-500 [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Blue Wallet, Keys, etc."
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Library, Canteen, etc."
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Contact Info</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Phone or Email"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                    <textarea
                                        required
                                        placeholder="Details..."
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-orange-500 resize-none"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center justify-between">
                                        <span>Photo (Optional)</span>
                                        {formData.image && <span className="text-xs text-green-400">Image Selected</span>}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-black/20 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors text-gray-400"
                                        >
                                            <Upload className="w-5 h-5" />
                                            {formData.image ? 'Change Photo' : 'Upload Photo'}
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-orange-500/20 transition-all mt-4"
                                >
                                    Submit Report
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LostFound;
