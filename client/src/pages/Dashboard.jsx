import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const ordersRes = await api.get('/api/orders');
                setOrders(ordersRes.data.data);

                if (user?.role === 'client') {
                    const jobsRes = await api.get('/api/jobs');
                    // Filter jobs where user is the client (API might need adjustment or we filter here)
                    setJobs(jobsRes.data.data.filter(j => j.client?._id === user.id));
                }

                if (user?.role === 'student') {
                    const appsRes = await api.get('/api/applications');
                    setApplications(appsRes.data.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Dashboard
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Welcome back, {user?.name} ({user?.role})
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 gap-3">
                    {user?.role === 'student' && (
                        <Link
                            to="/create-service"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
                        >
                            Create New Service
                        </Link>
                    )}
                    {user?.role === 'client' && (
                        <Link
                            to="/create-job"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
                        >
                            Post a Job
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 mb-10">
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-5">
                    <dt className="text-sm font-medium text-gray-500 truncate">Recent Orders</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{orders.length}</dd>
                </div>
                {user?.role === 'client' && (
                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-5">
                        <dt className="text-sm font-medium text-gray-500 truncate">Posted Jobs</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{jobs.length}</dd>
                    </div>
                )}
                {user?.role === 'student' && (
                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-5">
                        <dt className="text-sm font-medium text-gray-500 truncate">Applications</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{applications.length}</dd>
                    </div>
                )}
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <dt className="text-sm font-medium text-gray-500 truncate">Wallet Balance</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">₹{user?.wallet?.balance || 0}</dd>
                        </div>
                        {user?.role === 'student' && (
                            <Link to="/wallet" className="text-xs font-black text-gray-400 hover:text-black uppercase tracking-widest border-b border-transparent hover:border-black transition-all">
                                Manage Funds
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Orders</h3>

            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Service
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {user?.role === 'student' ? 'Client' : 'Freelancer'}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">View</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{order.service?.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {user?.role === 'student' ? order.client?.name : order.freelancer?.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">₹{order.amount}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="#" className="text-indigo-600 hover:text-indigo-900">View</a>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                No orders found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {user?.role === 'client' && (
                <div className="mt-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Your Posted Jobs</h3>
                    <div className="bg-white shadow overflow-hidden sm:rounded-xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Job Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jobs.map(job => (
                                    <tr key={job._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{job.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-widest ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/job-admin/${job._id}`} className="text-black hover:underline font-black">Manage</Link>
                                        </td>
                                    </tr>
                                ))}
                                {jobs.length === 0 && (
                                    <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400 font-medium">No jobs posted yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {user?.role === 'student' && (
                <div className="mt-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Your Applications</h3>
                    <div className="bg-white shadow overflow-hidden sm:rounded-xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Project</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Bid</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applications.map(app => (
                                    <tr key={app._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            <Link to={`/jobs/${app.job?._id}`} className="hover:underline">{app.job?.title}</Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">₹{app.bidAmount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-widest ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-gray-500 font-bold">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {applications.length === 0 && (
                                    <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400 font-medium">You haven't applied to any jobs yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
