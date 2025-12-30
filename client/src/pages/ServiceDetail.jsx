import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Check, Shield, Clock, DollarSign, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ServiceDetail = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServiceAndReviews = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/services?_id=${id}`);
                // The API returns an array, so we pick the first one matching the ID
                if (res.data.data && res.data.data.length > 0) {
                    setService(res.data.data[0]);

                    // Allow fetch reviews even if service load failed? No, load service first.
                    const reviewRes = await axios.get(`http://localhost:5000/api/reviews/service/${id}`);
                    setReviews(reviewRes.data.data);
                } else {
                    setError('Service not found');
                }
            } catch (error) {
                setError('Error loading service details');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceAndReviews();
    }, [id]);

    const handleOrder = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        // Create order then redirect to payment
        try {
            const res = await axios.post('http://localhost:5000/api/orders', {
                serviceId: service._id,
                requirements: "Standard requirements placeholder" // In a real app, prompt user for this
            });
            const orderId = res.data.data._id;
            navigate(`/payment/${orderId}`);
        } catch (err) {
            if (err.response?.data?.message === "You cannot order your own service") {
                alert("You are the owner of this service.");
            } else {
                alert('Failed to place order: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error || !service) return <div className="text-center py-10 text-red-500">{error || 'Service not found'}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                {/* Image / Gallery */}
                <div className="flex flex-col">
                    <div className="w-full aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden sm:aspect-w-16 sm:aspect-h-9">
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            <span className="text-6xl font-bold text-gray-300">{service.category}</span>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{service.title}</h1>
                    <div className="mt-3">
                        <h2 className="sr-only">Product information</h2>
                        <p className="text-3xl text-gray-900">₹{service.price}</p>
                    </div>

                    <div className="mt-6">
                        <h3 className="sr-only">Description</h3>
                        <div className="text-base text-gray-700 space-y-6">
                            <p>{service.description}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center text-sm text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <span>Delivery in {service.deliveryTime} days</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                            <Shield className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <span>Verified Student Freelancer: {service.freelancer?.name}</span>
                        </div>
                    </div>

                    <div className="mt-10 flex sm:flex-col1">
                        <button
                            onClick={handleOrder}
                            type="button"
                            className="max-w-xs flex-1 bg-black border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black sm:w-full"
                        >
                            Order Now
                        </button>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-medium text-gray-900">What's included</h3>
                        <ul className="mt-4 space-y-2">
                            <li className="flex items-center text-sm text-gray-500">
                                <Check className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" />
                                Source Code
                            </li>
                            <li className="flex items-center text-sm text-gray-500">
                                <Check className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" />
                                Revisions
                            </li>
                            <li className="flex items-center text-sm text-gray-500">
                                <Check className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" />
                                Secure Payment Release
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16 border-t border-gray-200 pt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Client Reviews ({reviews.length})</h2>

                {reviews.length === 0 ? (
                    <p className="text-gray-500 italic">No reviews yet. Be the first to order!</p>
                ) : (
                    <div className="space-y-8">
                        {reviews.map((review) => (
                            <div key={review._id} className="bg-gray-50 p-6 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <span className="font-bold text-gray-900 mr-4">{review.reviewer?.name || 'Client'}</span>
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-700">{review.comment}</p>
                                <span className="text-xs text-gray-400 mt-2 block">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceDetail;
