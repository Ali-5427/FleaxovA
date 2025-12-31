import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Search, MessageSquare, Briefcase, PlusCircle, Bell, Check } from 'lucide-react';
import api from '../api/axios';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            const fetchNotifications = async () => {
                try {
                    const res = await api.get('/api/notifications');
                    setNotifications(res.data.data);
                } catch (err) {
                    console.error('Error fetching notifications', err);
                }
            };
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/api/notifications/${id}`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Error marking as read', err);
        }
    };

    const markAllRead = async () => {
        try {
            await api.put('/api/notifications/readall');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Error marking all read', err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/services?keyword=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const navLinkClass = ({ isActive }) =>
        `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${isActive
            ? 'border-black text-gray-900'
            : 'border-transparent text-gray-500 hover:border-black hover:text-gray-900'
        }`;

    return (
        <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold tracking-tight text-black">FleaxovA</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <NavLink to="/services" className={navLinkClass}>
                                Find Services
                            </NavLink>
                            <NavLink to="/jobs" className={navLinkClass}>
                                Find Work
                            </NavLink>
                            {isAuthenticated && (
                                <NavLink to="/messages" className={navLinkClass}>
                                    Messages
                                </NavLink>
                            )}
                            {isAuthenticated && user?.role === 'student' && (
                                <NavLink to="/wallet" className={navLinkClass}>
                                    Wallet
                                </NavLink>
                            )}
                            {isAuthenticated && user?.role === 'student' && (
                                <NavLink to="/dashboard" className={navLinkClass}>
                                    My Services
                                </NavLink>
                            )}
                            {isAuthenticated && user?.role === 'student' && (
                                <NavLink to="/edit-profile" className={navLinkClass}>
                                    My Profile
                                </NavLink>
                            )}
                            {isAuthenticated && user?.role === 'client' && (
                                <NavLink to="/create-job" className={navLinkClass}>
                                    Post a Job
                                </NavLink>
                            )}
                        </div>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden flex-1 sm:flex items-center justify-center px-6">
                        <form onSubmit={handleSearch} className="w-full max-w-lg relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-all duration-200"
                                placeholder="Search for any service..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-700">Hey, {user?.name}</span>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="p-2 rounded-full text-gray-400 hover:text-black hover:bg-gray-50 transition-all relative"
                                    >
                                        <Bell className="h-5 w-5" />
                                        {notifications.filter(n => !n.isRead).length > 0 && (
                                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-left">
                                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                                <h3 className="font-black text-sm text-gray-900">Notifications</h3>
                                                <button onClick={markAllRead} className="text-[10px] font-black uppercase text-gray-400 hover:text-black tracking-widest">Mark all read</button>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map(n => (
                                                        <div
                                                            key={n._id}
                                                            onClick={async () => {
                                                                await markAsRead(n._id);
                                                                setShowNotifications(false);
                                                                if (n.link) navigate(n.link);
                                                            }}
                                                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-all ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                                                        >
                                                            <p className="text-xs text-gray-800 font-medium leading-relaxed">{n.content}</p>
                                                            <span className="text-[10px] text-gray-400 font-bold mt-1 block">{new Date(n.createdAt).toLocaleTimeString()}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-10 text-center text-gray-400 text-sm font-bold">No notifications</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button onClick={logout} className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login" className="text-gray-500 hover:text-gray-900 text-sm font-medium">Log in</Link>
                                <Link to="/register" className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Sign up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="sm:hidden">
                    <div className="px-4 pt-2 pb-3">
                        <form onSubmit={handleSearch} className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm"
                                placeholder="Search services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink
                            to="/services"
                            className={({ isActive }) =>
                                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${isActive
                                    ? 'bg-gray-50 border-black text-gray-900'
                                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                }`
                            }
                        >
                            Find Services
                        </NavLink>
                        <NavLink
                            to="/jobs"
                            className={({ isActive }) =>
                                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${isActive
                                    ? 'bg-gray-50 border-black text-gray-900'
                                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                }`
                            }
                        >
                            Find Work
                        </NavLink>
                        {isAuthenticated && (
                            <NavLink
                                to="/messages"
                                className={({ isActive }) =>
                                    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${isActive
                                        ? 'bg-gray-50 border-black text-gray-900'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                    }`
                                }
                            >
                                Messages
                            </NavLink>
                        )}
                        {isAuthenticated && user?.role === 'student' && (
                            <NavLink
                                to="/wallet"
                                className={({ isActive }) =>
                                    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${isActive
                                        ? 'bg-gray-50 border-black text-gray-900'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                    }`
                                }
                            >
                                Wallet
                            </NavLink>
                        )}
                        {isAuthenticated && user?.role === 'student' && (
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${isActive
                                        ? 'bg-gray-50 border-black text-gray-900'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                    }`
                                }
                            >
                                My Services
                            </NavLink>
                        )}
                        {isAuthenticated && user?.role === 'student' && (
                            <NavLink
                                to="/edit-profile"
                                className={({ isActive }) =>
                                    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${isActive
                                        ? 'bg-gray-50 border-black text-gray-900'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                    }`
                                }
                            >
                                My Profile
                            </NavLink>
                        )}
                        {isAuthenticated && user?.role === 'client' && (
                            <NavLink
                                to="/create-job"
                                className={({ isActive }) =>
                                    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${isActive
                                        ? 'bg-gray-50 border-black text-gray-900'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                    }`
                                }
                            >
                                Post a Job
                            </NavLink>
                        )}
                        {!isAuthenticated && (
                            <>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${isActive
                                            ? 'bg-gray-50 border-black text-gray-900'
                                            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                        }`
                                    }
                                >
                                    Log in
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className={({ isActive }) =>
                                        `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${isActive
                                            ? 'bg-gray-50 border-black text-gray-900'
                                            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                        }`
                                    }
                                >
                                    Sign up
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
