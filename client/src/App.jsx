import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import CreateService from './pages/CreateService';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import EditProfile from './pages/EditProfile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import Jobs from './pages/Jobs';
import CreateJob from './pages/CreateJob';
import JobDetail from './pages/JobDetail';
import JobAdmin from './pages/JobAdmin';
import Messages from './pages/Messages';
import Wallet from './pages/Wallet';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-white">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/services/:id" element={<ServiceDetail />} />
                        <Route path="/jobs" element={<Jobs />} />
                        <Route path="/jobs/:id" element={<JobDetail />} />
                        <Route
                            path="/create-service"
                            element={
                                <ProtectedRoute allowedRoles={['student', 'admin']}>
                                    <CreateService />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/payment/:orderId"
                            element={
                                <ProtectedRoute>
                                    <Payment />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/edit-profile"
                            element={
                                <ProtectedRoute allowedRoles={['student']}>
                                    <EditProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/admin" element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        <Route
                            path="/create-job"
                            element={
                                <ProtectedRoute allowedRoles={['client', 'admin']}>
                                    <CreateJob />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/job-admin/:id"
                            element={
                                <ProtectedRoute allowedRoles={['client', 'admin']}>
                                    <JobAdmin />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/messages"
                            element={
                                <ProtectedRoute>
                                    <Messages />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/wallet"
                            element={
                                <ProtectedRoute>
                                    <Wallet />
                                </ProtectedRoute>
                            }
                        />
                        {/* Add more routes later */}
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
