import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Send, AlertCircle, Clock, IndianRupee, Layers } from 'lucide-react';

const CreateJob = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        budget: '',
        deadline: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/api/jobs', formData);
            alert('Job posted successfully!');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating job');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'client' && user?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100">
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-500 font-medium">Only clients can post new work opportunities.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-16 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Post a Job</h1>
                        <p className="mt-2 text-lg text-gray-500 font-medium whitespace-nowrap">Hire top student talent for your project today.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="px-8 py-10 space-y-8">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center shadow-sm animate-pulse">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                                <p className="text-sm text-red-700 font-bold">{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-8">
                            <div className="relative group">
                                <label className="flex items-center text-sm font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-black">
                                    <Briefcase className="h-4 w-4 mr-2" />
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="block w-full px-5 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50/50 text-gray-900 font-medium focus:outline-none focus:ring-0 focus:border-black focus:bg-white transition-all transition-duration-300 placeholder-gray-300"
                                    placeholder="e.g. Need help with React Website"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="relative group">
                                <label className="flex items-center text-sm font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-black">
                                    <Layers className="h-4 w-4 mr-2" />
                                    Category
                                </label>
                                <select
                                    required
                                    className="block w-full px-5 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50/50 text-gray-900 font-medium focus:outline-none focus:ring-0 focus:border-black focus:bg-white transition-all appearance-none cursor-pointer"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="">Select a Category</option>
                                    <option value="Development">Development</option>
                                    <option value="Design">Design</option>
                                    <option value="Writing">Writing</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="AI Services">AI Services</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="relative group">
                                    <label className="flex items-center text-sm font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-black">
                                        <IndianRupee className="h-4 w-4 mr-2" />
                                        Budget (₹)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        className="block w-full px-5 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50/50 text-gray-900 font-medium focus:outline-none focus:ring-0 focus:border-black focus:bg-white transition-all"
                                        placeholder="5000"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="relative group">
                                    <label className="flex items-center text-sm font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-black">
                                        <Clock className="h-4 w-4 mr-2" />
                                        Expected Delivery (Days)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        className="block w-full px-5 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50/50 text-gray-900 font-medium focus:outline-none focus:ring-0 focus:border-black focus:bg-white transition-all"
                                        placeholder="7"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="flex items-center text-sm font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-black">
                                    Description
                                </label>
                                <textarea
                                    rows={6}
                                    required
                                    className="block w-full px-5 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50/50 text-gray-900 font-medium focus:outline-none focus:ring-0 focus:border-black focus:bg-white transition-all resize-none placeholder-gray-300"
                                    placeholder="Explain the project details, requirements and expectations clearly..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-6 bg-gray-50 flex items-center justify-end gap-x-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 border-2 border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-100 hover:text-black transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-10 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-black/20"
                        >
                            {loading ? 'Posting...' : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Post Job
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateJob;
