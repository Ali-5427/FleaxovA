import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Synchronize localStorage when user state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get('/api/auth/me');
                setUser(res.data.data);
            } catch (error) {
                console.warn('Silent auth check failed');
                if (error.response?.status === 401) {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        const res = await api.post('/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user); // Set immediately
        return res.data;
    };

    const register = async (name, email, password, role) => {
        const res = await api.post('/api/auth/register', { name, email, password, role });
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user); // Set immediately
        }
        return res.data;
    };

    const verifyEmail = async (email, otp) => {
        const res = await api.post('/api/auth/verify-email', { email, otp });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user); // Set immediately
        return res.data;
    };

    const forgotPassword = async (email) => {
        const res = await api.post('/api/auth/forgot-password', { email });
        return res.data;
    };

    const resetPassword = async (token, password) => {
        const res = await api.put(`/api/auth/reset-password/${token}`, { password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            verifyEmail,
            forgotPassword,
            resetPassword,
            logout,
            loading,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};
