import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

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
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-700">Hey, {user?.name}</span>
                                <button onClick={logout} className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
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
