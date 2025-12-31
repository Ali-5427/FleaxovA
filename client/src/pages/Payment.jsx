import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Check, CreditCard, Lock } from 'lucide-react';

const Payment = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // In a real app, we would fetch order details to show amount
        // For now we assume we can fetch it (requires endpoint update or just relying on ID)
        // Let's implement a simpler flow where we simulate fetching
        const fetchOrder = async () => {
            // We are using a hack here: fetching all orders and finding the one matching API.
            // Ideally we should have a getOrderById endpoint.
            const res = await api.get(`/api/orders/${orderId}`);
            setOrder(res.data.data);
            setLoading(false);
        };
        fetchOrder();
    }, [orderId]);

    const handlePayment = async () => {
        setProcessing(true);
        // Simulate UPI / Gateway delay
        setTimeout(async () => {
            try {
                await api.put(`/api/orders/${orderId}/status`, {
                    status: 'In_Progress',
                    paymentStatus: 'completed'
                });
                navigate('/dashboard');
            } catch (err) {
                alert('Payment failed');
                setProcessing(false);
            }
        }, 2000);
    };

    if (loading) return <div>Loading payment details...</div>;
    if (!order) return <div>Order not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Secure Payment
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Complete your purchase for <strong>{order.service?.title}</strong>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="mb-6 border-b border-gray-200 pb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500">Service Fee</span>
                            <span className="font-medium">₹{order.amount}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500">Platform Fee (5%)</span>
                            <span className="font-medium">₹{(order.amount * 0.05).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold mt-4">
                            <span>Total</span>
                            <span>₹{(order.amount * 1.05).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Mock Payment Options */}
                        <div className="flex items-center border p-3 rounded-md cursor-pointer bg-gray-50 border-gray-300">
                            <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="flex-1 font-medium">Credit / Debit Card</span>
                            <input type="radio" name="payment" checked readOnly className="h-4 w-4 text-black focus:ring-black border-gray-300" />
                        </div>
                        <div className="flex items-center border p-3 rounded-md cursor-pointer hover:bg-gray-50">
                            <span className="h-5 w-5 flex items-center justify-center bg-green-500 text-white text-xs font-bold rounded-full mr-3">₹</span>
                            <span className="flex-1 font-medium">UPI (GPay, PhonePe)</span>
                            <input type="radio" name="payment" disabled className="h-4 w-4 text-black focus:ring-black border-gray-300" />
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handlePayment}
                            disabled={processing}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-75"
                        >
                            {processing ? 'Processing Secure Payment...' : `Pay ₹${(order.amount * 1.05).toFixed(2)}`}
                        </button>
                    </div>

                    <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                        <Lock className="h-3 w-3 mr-1" />
                        Encrypted & Secured by FleaxovA Payments
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
