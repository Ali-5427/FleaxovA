import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link, useSearchParams } from 'react-router-dom';

const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="pt-4 flex justify-between items-center">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
            </div>
        </div>
    </div>
);

const getCategoryImage = (category) => {
    const images = {
        'Development': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
        'Design': 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=600&q=80',
        'Writing': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
        'Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
        'AI Services': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80',
        'Business': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
        'Video & Animation': 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=600&q=80'
    };
    return images[category] || 'https://images.unsplash.com/photo-1454165833762-02c50e899e53?auto=format&fit=crop&w=600&q=80';
};

const Services = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlKeyword = searchParams.get('keyword') || '';

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [keyword, setKeyword] = useState(urlKeyword);

    // Sync state with URL params
    useEffect(() => {
        setKeyword(urlKeyword);
    }, [urlKeyword]);

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                let url = '/api/services';
                const params = new URLSearchParams();
                if (category) params.append('category', category);
                if (keyword) params.append('keyword', keyword);

                const res = await api.get(`${url}?${params.toString()}`);
                setServices(res.data.data);
            } catch (error) {
                console.error('Error fetching services', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchServices();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [category, keyword]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Explore Services</h1>
                    <p className="text-gray-500 mt-1">Unlock professional student talent for your project.</p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
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
                </div>
            </div>

            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
                {loading ? (
                    [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
                ) : (
                    services.map((service) => (
                        <div key={service._id} className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-200 group-hover:opacity-90 transition-opacity">
                                <img
                                    src={getCategoryImage(service.category)}
                                    alt={service.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[10px] font-bold uppercase tracking-wider text-black shadow-sm">
                                    {service.category}
                                </div>
                            </div>
                            <div className="flex-1 p-4 space-y-2 flex flex-col">
                                <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                                    <Link to={`/services/${service._id}`}>
                                        <span aria-hidden="true" className="absolute inset-0" />
                                        {service.title}
                                    </Link>
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">{service.description}</p>
                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                                            {service.freelancer?.name?.[0]}
                                        </div>
                                        <p className="text-xs font-medium text-gray-600 truncate max-w-[100px]">{service.freelancer?.name}</p>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">₹{service.price.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {!loading && services.length === 0 && (
                <div className="text-center py-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="mx-auto h-12 w-12 text-gray-400 mb-4 flex items-center justify-center bg-white rounded-full shadow-sm">🔍</div>
                    <h3 className="text-sm font-medium text-gray-900">No services found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try changing your filters or searching for something else.</p>
                </div>
            )}
        </div>
    );
};

export default Services;
