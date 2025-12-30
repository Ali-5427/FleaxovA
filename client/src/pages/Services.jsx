import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                let url = 'http://localhost:5000/api/services';
                if (category) {
                    url += `?category=${category}`;
                }
                const res = await axios.get(url);
                setServices(res.data.data);
            } catch (error) {
                console.error('Error fetching services', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [category]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Explore Services</h1>
                <div className="mt-4 md:mt-0">
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

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
                    {services.map((service) => (
                        <div key={service._id} className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-w-3 aspect-h-2 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-48">
                                {/* Placeholder for service image since we don't handle file upload yet */}
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                    <span className="text-4xl font-bold text-gray-300">{service.category[0]}</span>
                                </div>
                            </div>
                            <div className="flex-1 p-4 space-y-2 flex flex-col">
                                <h3 className="text-sm font-medium text-gray-900">
                                    <Link to={`/services/${service._id}`}>
                                        <span aria-hidden="true" className="absolute inset-0" />
                                        {service.title}
                                    </Link>
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-3">{service.description}</p>
                                <div className="flex-1 flex flex-col justify-end">
                                    <p className="text-sm italic text-gray-500">by {service.freelancer?.name}</p>
                                    <p className="text-base font-medium text-gray-900 mt-2">₹{service.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && services.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No services found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default Services;
