import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check, X, Mail, User, Clock, IndianRupee, ArrowLeft, ShieldCheck, MessageSquare } from 'lucide-react';

const JobAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const jobRes = await api.get(`/api/jobs/${id}`);
                setJob(jobRes.data.data);

                const appsRes = await api.get(`/api/applications/job/${id}`);
                setApplications(appsRes.data.data);
            } catch (err) {
                console.error('Error fetching job admin data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobData();
    }, [id]);

    const handleAction = async (appId, status) => {
        try {
            await api.put(`/api/applications/${appId}`, { status });
            setApplications(applications.map(app =>
                app._id === appId ? { ...app, status } : app
            ));
            alert(`Application ${status === 'accepted' ? 'Accepted' : 'Rejected'}`);
        } catch (err) {
            alert('Action failed');
        }
    };

    const handleMessage = async (student) => {
        try {
            await api.post('/api/messages', {
                receiver: student._id,
                content: `Hi ${student.name}, I'm reviewing your application for "${job.title}".`
            });
            navigate('/messages', { state: { targetUser: student } });
        } catch (err) {
            alert('Could not start conversation');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading applications...</div>;
    if (!job) return <div className="p-10 text-center">Job not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-sm font-bold text-gray-500 hover:text-black mb-4 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Job
                        </button>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Manage Applications</h1>
                        <p className="text-lg text-gray-500 mt-1 font-medium">{job.title}</p>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 hidden sm:block">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Total Applicants</span>
                        <span className="text-2xl font-black text-black">{applications.length}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    {applications.map((app) => (
                        <div key={app._id} className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-gray-100 flex flex-col md:flex-row gap-8 transition-all hover:shadow-black/10">
                            <div className="flex-1">
                                <div className="flex items-center mb-6">
                                    <div className="h-14 w-14 rounded-2xl bg-black text-white flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-gray-50 mr-4">
                                        {app.freelancer?.name?.[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xl text-gray-900">{app.freelancer?.name}</h4>
                                        <div className="flex items-center text-xs text-gray-500 font-bold mt-1">
                                            <Mail className="h-3 w-3 mr-1" />
                                            {app.freelancer?.email}
                                        </div>
                                    </div>
                                    <div className="ml-auto">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Cover Letter</h5>
                                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                                        {app.coverLetter}
                                    </p>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">Student's Bid</span>
                                        <span className="text-xl font-black text-black">₹{app.bidAmount?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex flex-col border-l border-gray-100 pl-8">
                                        <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">Date Applied</span>
                                        <span className="text-sm font-bold text-gray-600">{new Date(app.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col justify-center gap-3">
                                <button
                                    onClick={() => handleMessage(app.freelancer)}
                                    className="px-6 py-4 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl font-black text-xs hover:border-black transition-all transform active:scale-95 flex items-center justify-center flex-1 md:flex-none"
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Message
                                </button>
                                {app.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleAction(app._id, 'accepted')}
                                            className="px-6 py-4 bg-black text-white rounded-2xl font-black text-xs hover:bg-gray-800 transition-all transform active:scale-95 flex items-center justify-center flex-1 md:flex-none shadow-lg shadow-black/20"
                                        >
                                            <Check className="h-4 w-4 mr-2" />
                                            Hire
                                        </button>
                                        <button
                                            onClick={() => handleAction(app._id, 'rejected')}
                                            className="px-6 py-4 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl font-black text-xs hover:border-red-200 hover:text-red-500 transition-all transform active:scale-95 flex items-center justify-center flex-1 md:flex-none"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Reject
                                        </button>
                                    </>
                                )}
                                {app.status === 'accepted' && (
                                    <div className="text-center p-4">
                                        <p className="text-xs font-black text-green-600 flex items-center justify-center">
                                            <ShieldCheck className="h-4 w-4 mr-2" />
                                            Hired
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {applications.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-gray-900">No applicants yet</h3>
                            <p className="text-gray-500 mt-2 font-medium">Wait for students to discover your job post.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobAdmin;
