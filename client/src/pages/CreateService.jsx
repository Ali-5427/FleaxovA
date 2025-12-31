import { useState } from 'react';
import api from '../api/axios';
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
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (formData.title.length < 5) errors.title = 'Title must be at least 5 characters long.';
        if (formData.title.length > 100) errors.title = 'Title cannot exceed 100 characters.';
        if (formData.description.length < 20) errors.description = 'Description must be at least 20 characters long.';
        if (formData.description.length > 1000) errors.description = 'Description cannot exceed 1000 characters.';
        if (!formData.price || formData.price <= 0) errors.price = 'Price must be a positive number.';
        if (!formData.deliveryTime || formData.deliveryTime <= 0) errors.deliveryTime = 'Delivery time must be at least 1 day.';

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            await api.post('/api/services', formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create service. Please check your connection.');
            setLoading(false);
        }
    };

    const inputClasses = (fieldName) => `
        shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm 
        rounded-md p-2.5 border transition-colors duration-200
        ${fieldErrors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300'}
    `;

    return (
        <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Create a New Service</h2>
                <p className="mt-2 text-sm text-gray-600">Share your expertise and start earning as a student freelancer.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Service Title</label>
                        <input
                            type="text"
                            className={inputClasses('title')}
                            placeholder="e.g., I will build a full-stack React Website"
                            value={formData.title}
                            onChange={(e) => {
                                setFormData({ ...formData, title: e.target.value });
                                if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: null });
                            }}
                        />
                        {fieldErrors.title && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                        <select
                            className={inputClasses('category')}
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

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Description</label>
                        <textarea
                            rows={5}
                            className={inputClasses('description')}
                            placeholder="What exactly will you provide? Be specific to attract more clients..."
                            value={formData.description}
                            onChange={(e) => {
                                setFormData({ ...formData, description: e.target.value });
                                if (fieldErrors.description) setFieldErrors({ ...fieldErrors, description: null });
                            }}
                        />
                        <div className="flex justify-between mt-1">
                            {fieldErrors.description ? (
                                <p className="text-xs text-red-500 font-medium">{fieldErrors.description}</p>
                            ) : (
                                <p className="text-xs text-gray-400 font-medium italic">Min 20 characters</p>
                            )}
                            <p className="text-xs text-gray-400">{formData.description.length}/1000</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 text-left">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Price (INR)</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400 sm:text-sm font-bold">₹</span>
                                </div>
                                <input
                                    type="number"
                                    className={inputClasses('price') + ' pl-7'}
                                    placeholder="500"
                                    value={formData.price}
                                    onChange={(e) => {
                                        setFormData({ ...formData, price: e.target.value });
                                        if (fieldErrors.price) setFieldErrors({ ...fieldErrors, price: null });
                                    }}
                                />
                            </div>
                            {fieldErrors.price && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.price}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Time</label>
                            <div className="relative rounded-md shadow-sm">
                                <input
                                    type="number"
                                    className={inputClasses('deliveryTime') + ' pr-12'}
                                    placeholder="3"
                                    value={formData.deliveryTime}
                                    onChange={(e) => {
                                        setFormData({ ...formData, deliveryTime: e.target.value });
                                        if (fieldErrors.deliveryTime) setFieldErrors({ ...fieldErrors, deliveryTime: null });
                                    }}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400 sm:text-sm font-medium">Days</span>
                                </div>
                            </div>
                            {fieldErrors.deliveryTime && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.deliveryTime}</p>}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-400 italic">By clicking create, you agree to our platform terms.</p>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center py-3 px-8 border border-transparent shadow-md text-sm font-bold rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all transform hover:scale-105 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : 'Create Service'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateService;
