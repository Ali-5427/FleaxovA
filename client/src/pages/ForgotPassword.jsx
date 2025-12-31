import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [mockToken, setMockToken] = useState('');
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await forgotPassword(email);
            setMessage(res.message);
            if (res.reset_token_mock) setMockToken(res.reset_token_mock);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-center text-sm">{error}</div>}
                    {message && <div className="text-green-600 text-center text-sm">{message}</div>}

                    <div className="rounded-md shadow-sm -space-y-px">
                        <input
                            type="email"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        >
                            Send Reset Link
                        </button>
                    </div>

                    {mockToken && (
                        <div className="mt-4 p-3 bg-gray-100 rounded-md text-center">
                            <p className="text-xs text-gray-500 mb-2">Mock Reset Link (for demo):</p>
                            <Link
                                to={`/reset-password/${mockToken}`}
                                className="text-sm text-black underline font-medium"
                            >
                                Click here to reset password
                            </Link>
                        </div>
                    )}
                </form>
                <div className="text-center text-sm">
                    <Link to="/login" className="font-medium text-black hover:text-gray-900">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
