import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, IndianRupee, Briefcase, User, Calendar, ShieldCheck, Mail, ArrowLeft } from 'lucide-react';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [applicationData, setApplicationData] = useState({ coverLetter: '', bidAmount: '' });
    const [applied, setApplied] = useState(false);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const fetchJobAndApplication = async () => {
            try {
                const res = await api.get(`/api/jobs/${id}`);
                setJob(res.data.data);

                if (user?.role === 'student') {
                    const appsRes = await api.get('/api/applications');
                    const hasApplied = appsRes.data.data.some(app => app.job?._id === id);
                    setApplied(hasApplied);
                }
            } catch (error) {
                console.error('Error fetching job details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobAndApplication();
    }, [id, user]);

    const handleApply = async (e) => {
        e.preventDefault();
        setApplying(true);
        try {
            await api.post('/api/applications', {
                job: id,
                ...applicationData
            });
            alert('Application submitted successfully!');
            setApplied(true);
            setShowApplyForm(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Error submitting application');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
    );

    if (!job) return <div className="p-10 text-center">Job not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Bar Navigation */}
            <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-16 z-30">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to browsing
                    </button>
                    <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">Post ID</span>
                        <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">#{job._id.substring(0, 8)}</span>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Column: Job Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-black/5 border border-gray-100">
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    {job.category}
                                </span>
                                <span className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    {job.status}
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
                                {job.title}
                            </h1>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-8 border-y border-gray-100 mb-8">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center">
                                        <Briefcase className="h-3 w-3 mr-1" />
                                        Work Type
                                    </span>
                                    <span className="text-lg font-black text-gray-900">Fixed Budget</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center">
                                        <IndianRupee className="h-3 w-3 mr-1" />
                                        Budget
                                    </span>
                                    <span className="text-lg font-black text-gray-900">₹{job.budget?.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Timeline
                                    </span>
                                    <span className="text-lg font-black text-gray-900">{job.deadline} Days</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-gray-900 mb-4">Project Description</h3>
                            <div className="text-gray-600 leading-loose text-lg whitespace-pre-line">
                                {job.description}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Client Info & Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-gray-100 sticky top-32">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">About the Client</h3>

                            <div className="flex items-center mb-6">
                                <div className="h-14 w-14 rounded-2xl bg-black text-white flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-gray-50 mr-4">
                                    {job.client?.name?.[0]}
                                </div>
                                <div>
                                    <h4 className="font-black text-lg text-gray-900">{job.client?.name}</h4>
                                    <div className="flex items-center text-xs text-gray-500 font-bold mt-0.5">
                                        <ShieldCheck className="h-3 w-3 text-blue-500 mr-1" />
                                        Verified Employer
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400 font-bold flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Member since
                                    </span>
                                    <span className="text-gray-900 font-black">Dec 2023</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400 font-bold flex items-center">
                                        <Mail className="h-4 w-4 mr-2" />
                                        Email
                                    </span>
                                    <span className="text-gray-900 font-black">Verified</span>
                                </div>
                            </div>

                            {user?.role === 'student' && job.status === 'open' && !applied && !showApplyForm && (
                                <button
                                    onClick={() => setShowApplyForm(true)}
                                    className="w-full py-4 bg-black text-white font-black rounded-2xl shadow-xl shadow-black/20 hover:bg-gray-800 transition-all transform active:scale-95 flex items-center justify-center"
                                >
                                    Apply Now
                                </button>
                            )}

                            {applied && (
                                <div className="w-full py-4 bg-green-50 text-green-700 font-black rounded-2xl border border-green-200 flex items-center justify-center">
                                    <ShieldCheck className="h-5 w-5 mr-2" />
                                    Application Sent
                                </div>
                            )}

                            {showApplyForm && (
                                <form onSubmit={handleApply} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Your Bid (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none bg-gray-50 transition-all"
                                            placeholder={job.budget}
                                            value={applicationData.bidAmount}
                                            onChange={(e) => setApplicationData({ ...applicationData, bidAmount: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Cover Letter</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none bg-gray-50 transition-all resize-none text-sm"
                                            placeholder="Why are you a good fit?"
                                            value={applicationData.coverLetter}
                                            onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowApplyForm(false)}
                                            className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={applying}
                                            className="flex-[2] py-3 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition-all transform active:scale-95 disabled:opacity-50"
                                        >
                                            {applying ? 'Sending...' : 'Submit Application'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {user?.id === job.client?._id && (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate(`/job-admin/${id}`)}
                                        className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all transform active:scale-95 flex items-center justify-center shadow-lg"
                                    >
                                        Manage Applications
                                    </button>
                                </div>
                            )}

                            {!user && (
                                <div className="text-center p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-xs font-bold text-gray-500 mb-4">Log in as a student to apply for this work.</p>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="text-xs font-black text-black underline hover:text-gray-600"
                                    >
                                        Go to Login
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="bg-black text-white rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Safety Tip</h3>
                            <p className="text-sm font-medium text-gray-300 leading-relaxed italic">
                                "Never share personal contact info or pay outside FleaxovA until a project is started."
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default JobDetail;
