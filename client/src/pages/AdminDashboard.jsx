import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ users: 0, services: 0, orders: 0 });
    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, these would be dedicated admin endpoints
                // For now, we fetch users and filter for pending verifications
                const res = await api.get('/api/auth/users');
                const allUsers = res.data.data;

                setPendingVerifications(allUsers.filter(u => u.verificationStatus === 'pending'));
                setStats({
                    users: allUsers.length,
                    services: 0, // Mock
                    orders: 0    // Mock
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAction = async (userId, status) => {
        try {
            await api.put(`/api/auth/approve-verification/${userId}`, { status });
            setPendingVerifications(pendingVerifications.filter(u => u._id !== userId));
            alert(`User marked as ${status}`);
        } catch (err) {
            alert('Action failed');
        }
    };

    if (user?.role !== 'admin') return <div className="p-10 text-center">Unauthorized</div>;
    if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold">{stats.users}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <p className="text-sm text-gray-500">Pending Verifications</p>
                    <p className="text-2xl font-bold">{pendingVerifications.length}</p>
                </div>
                {/* More stats... */}
            </div>

            <h2 className="text-xl font-bold mb-4">Pending Student Verifications</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {pendingVerifications.map(u => (
                        <li key={u._id} className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{u.name}</p>
                                <p className="text-sm text-gray-500">{u.email}</p>
                                <a
                                    href={u.verificationDocument}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 underline"
                                >
                                    View Proof Document
                                </a>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleAction(u._id, 'verified')}
                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(u._id, 'rejected')}
                                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                >
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                    {pendingVerifications.length === 0 && (
                        <li className="p-4 text-center text-gray-500 text-sm">No pending requests</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
