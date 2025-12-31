import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { IndianRupee, ArrowUpRight, Clock, CheckCircle, XCircle, CreditCard, Landmark } from 'lucide-react';

const Wallet = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);
    const [withdrawals, setWithdrawals] = useState([]);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('UPI');
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [balanceRes, withdrawalRes] = await Promise.all([
                api.get('/api/wallet/balance'),
                api.get('/api/wallet/withdrawals')
            ]);
            setBalance(balanceRes.data.data.balance);
            setWithdrawals(withdrawalRes.data.data);
        } catch (err) {
            console.error('Error fetching wallet data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        if (amount < 100) return alert('Minimum withdrawal is ₹100');
        if (amount > balance) return alert('Insufficient balance');

        try {
            await api.post('/api/wallet/withdraw', {
                amount: Number(amount),
                paymentMethod: method,
                paymentDetails: details
            });
            alert('Withdrawal request submitted!');
            setAmount('');
            setDetails('');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Withdrawal failed');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Wallet...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Financial Wallet</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Balance Card */}
                <div className="lg:col-span-1">
                    <div className="bg-black rounded-[32px] p-8 text-white shadow-2xl shadow-black/20 relative overflow-hidden h-full">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <IndianRupee className="h-32 w-32" />
                        </div>
                        <h3 className="text-gray-400 text-sm font-black uppercase tracking-widest mb-2">Available Balance</h3>
                        <div className="flex items-baseline">
                            <span className="text-5xl font-black">₹{balance.toLocaleString()}</span>
                        </div>

                        <div className="mt-10 pt-10 border-t border-white/10 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-white/60 text-xs font-bold">Account Holder</span>
                                <span className="text-sm font-black">{user?.name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white/60 text-xs font-bold">Status</span>
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-black uppercase">Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Withdrawal Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-black/5 h-full">
                        <h3 className="text-xl font-black text-gray-900 mb-6">Request Payout</h3>
                        <form onSubmit={handleWithdraw} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Amount to Withdraw (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        min="100"
                                        placeholder="Min. 100"
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black transition-all"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Withdrawal Method</label>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setMethod('UPI')}
                                            className={`flex-1 py-4 px-4 rounded-2xl text-xs font-black border-2 transition-all flex items-center justify-center gap-2 ${method === 'UPI' ? 'border-black bg-black text-white' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-black/10'
                                                }`}
                                        >
                                            <CreditCard className="h-4 w-4" />
                                            UPI
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMethod('Bank')}
                                            className={`flex-1 py-4 px-4 rounded-2xl text-xs font-black border-2 transition-all flex items-center justify-center gap-2 ${method === 'Bank' ? 'border-black bg-black text-white' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-black/10'
                                                }`}
                                        >
                                            <Landmark className="h-4 w-4" />
                                            Bank
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                    {method === 'UPI' ? 'UPI ID' : 'Account No / IFSC Details'}
                                </label>
                                <textarea
                                    required
                                    rows="2"
                                    placeholder={method === 'UPI' ? "e.g. name@upi" : "e.g. A/C: 123456789, IFSC: SBIN0001"}
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black transition-all"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-5 bg-black text-white rounded-[20px] font-black text-sm uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-gray-800 transition-all transform active:scale-[0.98]"
                            >
                                Initiate Withdrawal
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="mt-10">
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-black/5">
                    <h3 className="text-xl font-black text-gray-900 mb-8">Withdrawal History</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Method</th>
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Reference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {withdrawals.map((w) => (
                                    <tr key={w._id} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="py-6 text-sm font-bold text-gray-600">{new Date(w.createdAt).toLocaleDateString()}</td>
                                        <td className="py-6 text-sm font-black text-gray-900">₹{w.amount.toLocaleString()}</td>
                                        <td className="py-6">
                                            <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase text-gray-600">{w.paymentMethod}</span>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex items-center gap-2">
                                                {w.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                                {w.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                                                {w.status === 'rejected' && <XCircle className="h-4 w-4 text-red-500" />}
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${w.status === 'approved' ? 'text-green-600' :
                                                        w.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                    {w.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-6 text-right text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors uppercase">
                                            {w._id.substring(w._id.length - 8)}
                                        </td>
                                    </tr>
                                ))}
                                {withdrawals.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center text-gray-400 font-bold">No withdrawals requested yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
