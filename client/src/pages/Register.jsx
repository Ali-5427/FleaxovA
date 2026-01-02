import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'client'
    });
    const [step, setStep] = useState('register'); // 'register' or 'otp'
    const [otp, setOtp] = useState('');
    const [mockOtp, setMockOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { register, verifyEmail } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await register(formData.name, formData.email, formData.password, formData.role);
            if (res.token) {
                navigate('/');
            } else {
                setStep('otp');
                setMessage(res.message);
                if (res.otp_mock) setMockOtp(res.otp_mock);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await verifyEmail(formData.email, otp);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {step === 'register' ? 'Create your account' : 'Verify your email'}
                    </h2>
                    {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}
                    {mockOtp && <p className="mt-1 text-center text-xs text-gray-400">Mock OTP (for demo): {mockOtp}</p>}
                </div>

                {step === 'register' ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && <div className="text-red-500 text-center text-sm">{error}</div>}

                        <div className="flex justify-center space-x-4 mb-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'client' })}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${formData.role === 'client' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                I want to Hire
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'student' })}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${formData.role === 'student' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                I'm a Student (Freelancer)
                            </button>
                        </div>

                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <input
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                        {error && <div className="text-red-500 text-center text-sm">{error}</div>}
                        <div className="rounded-md shadow-sm -space-y-px">
                            <input
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                            >
                                Verify & Finish
                            </button>
                        </div>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setStep('register')}
                                className="text-sm text-gray-600 hover:text-black"
                            >
                                Back to Registration
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center text-sm">
                    <span className="text-gray-500">Already have an account? </span>
                    <Link to="/login" className="font-medium text-black hover:text-gray-900" onClick={() => setStep('register')}>
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
