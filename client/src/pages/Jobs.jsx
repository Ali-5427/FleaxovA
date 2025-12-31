import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, IndianRupee, Search, Filter } from 'lucide-react';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                let url = '/api/jobs';
                const params = new URLSearchParams();
                if (category) params.append('category', category);
                if (keyword) params.append('keyword', keyword);

                const res = await api.get(`${url}?${params.toString()}`);
                setJobs(res.data.data);
            } catch (error) {
                console.error('Error fetching jobs', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchJobs();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [category, keyword]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
                <div className="flex-1">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Available Work</h1>
                    <p className="text-lg text-gray-500 mt-2 font-medium">Find tasks posted by clients and start earning.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm group-hover:shadow-md"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>

                    <div className="relative flex-1 sm:w-48">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm appearance-none hover:shadow-md cursor-pointer"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="Development">Development</option>
                            <option value="Design">Design</option>
                            <option value="Writing">Writing</option>
                            <option value="Marketing">Marketing</option>
                            <option value="AI Services">AI Services</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse shadow-sm">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                            <div className="flex justify-between items-center">
                                <div className="h-8 bg-gray-200 rounded w-24"></div>
                                <div className="h-10 bg-gray-200 rounded w-32"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {jobs.map((job) => (
                        <div key={job._id} className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-black hover:shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 h-1 w-0 bg-black group-hover:w-full transition-all duration-500"></div>

                            <div className="flex justify-between items-start mb-6">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black text-white">
                                    {job.category}
                                </span>
                                <span className="flex items-center text-xs text-gray-400 font-medium whitespace-nowrap">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-black transition-colors mb-3">
                                {job.title}
                            </h3>

                            <p className="text-gray-600 line-clamp-3 mb-8 flex-grow leading-relaxed">
                                {job.description}
                            </p>

                            <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 mt-auto">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Budget</span>
                                        <span className="text-lg font-black text-gray-900">₹{job.budget?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex flex-col border-l border-gray-100 pl-6">
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Duration</span>
                                        <span className="text-sm font-bold text-gray-700">{job.deadline} Days</span>
                                    </div>
                                </div>

                                <Link
                                    to={`/jobs/${job._id}`}
                                    className="px-6 py-3 bg-gray-50 text-black text-sm font-bold rounded-xl hover:bg-black hover:text-white transition-all transform active:scale-95 group-hover:shadow-lg"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && jobs.length === 0 && (
                <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="mx-auto h-20 w-20 text-gray-300 mb-6 flex items-center justify-center bg-white rounded-full shadow-inner">
                        <Briefcase className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">No jobs found</h3>
                    <p className="mt-2 text-gray-500 max-w-sm mx-auto">Try adjusting your filters or search keywords to find more opportunities.</p>
                </div>
            )}
        </div>
    );
};

export default Jobs;
