import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, these would be dedicated admin endpoints
                // For now, we fetch users and filter for pending verifications
                const res = await api.get('/api/auth/users');
                const allUsers = res.data.data;

                setAllUsers(allUsers);
                setPendingVerifications(allUsers.filter(u => u.verificationStatus === 'pending'));
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

    const handleBanUser = async (userId) => {
        try {
            await api.put(`/api/auth/ban-user/${userId}`);
            setAllUsers(allUsers.map(u => u._id === userId ? { ...u, isBanned: true } : u));
            alert('User banned');
        } catch (err) {
            alert('Ban failed');
        }
    };

    if (user?.role !== 'admin') return <div className="p-10 text-center">Unauthorized</div>;
    if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

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

            <h2 className="text-xl font-bold mb-4 mt-10">User Management</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {allUsers.slice(0, 10).map(u => (
                        <li key={u._id} className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{u.name} ({u.role})</p>
                                <p className="text-sm text-gray-500">{u.email}</p>
                            </div>
                            <div className="flex space-x-2">
                                {!u.isBanned ? (
                                    <button
                                        onClick={() => handleBanUser(u._id)}
                                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                    >
                                        Ban
                                    </button>
                                ) : (
                                    <span className="text-xs text-red-600">Banned</span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
