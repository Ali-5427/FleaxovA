import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateService = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Development',
        price: '',
        deliveryTime: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:5000/api/services', formData);
            navigate('/dashboard'); // Redirect to dashboard after creation
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create service');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Create a New Service
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                {error && <div className="text-red-500 text-sm">{error}</div>}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Service Title</label>
                    <div className="mt-1">
                        <input
                            type="text"
                            required
                            className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="e.g., I will build a React Website"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <div className="mt-1">
                        <select
                            className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="Development">Development</option>
                            <option value="Design">Design</option>
                            <option value="Writing">Writing</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Business">Business</option>
                            <option value="Video & Animation">Video & Animation</option>
                            <option value="AI Services">AI Services</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <div className="mt-1">
                        <textarea
                            rows={4}
                            required
                            className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="Describe what you will provide..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price (INR)</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">₹</span>
                            </div>
                            <input
                                type="number"
                                min="1"
                                required
                                className="focus:ring-black focus:border-black block w-full pl-7 sm:text-sm border-gray-300 rounded-md p-2 border"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Delivery Time (Days)</label>
                        <div className="mt-1">
                            <input
                                type="number"
                                min="1"
                                required
                                className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                placeholder="e.g. 3"
                                value={formData.deliveryTime}
                                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-5">
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Service'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateService;
