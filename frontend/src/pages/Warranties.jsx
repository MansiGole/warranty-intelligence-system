import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import api from '../services/api';
import { Loader } from '../components/ui/Loader';

const Warranties = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [warranties, setWarranties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWarranties = async () => {
            try {
                const data = await api.get('/warranties');
                setWarranties(data.data);
            } catch (error) {
                console.error("Failed to fetch warranties", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWarranties();
    }, []);

    const tabs = [
        { id: 'all', label: 'All Warranties' },
        { id: 'active', label: 'Active' },
        { id: 'expiring', label: 'Expiring Soon' },
        { id: 'expired', label: 'Expired' },
    ];

    const filteredWarranties = warranties.filter(w => {
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return w.status === 'active';
        if (activeTab === 'expired') return w.status === 'expired';
        // Logic for expiring soon (within 30 days)
        if (activeTab === 'expiring') {
            const expiry = new Date(w.expiry_date);
            const today = new Date();
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(today.getDate() + 30);
            return w.status === 'active' && expiry <= thirtyDaysFromNow;
        }
        return true;
    });

    const getStatusColor = (status, expiry) => {
        const isExpiringSoon = new Date(expiry) <= new Date(new Date().setDate(new Date().getDate() + 30));

        if (status === 'expired') return 'bg-red-50 text-red-700 border-red-200';
        if (isExpiringSoon) return 'bg-amber-50 text-amber-700 border-amber-200';
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    };

    const getStatusIcon = (status, expiry) => {
        const isExpiringSoon = new Date(expiry) <= new Date(new Date().setDate(new Date().getDate() + 30));

        if (status === 'expired') return <ShieldX className="h-5 w-5 text-red-500" />;
        if (isExpiringSoon) return <ShieldAlert className="h-5 w-5 text-amber-500" />;
        return <ShieldCheck className="h-5 w-5 text-emerald-500" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Warranty Status</h1>
                <p className="text-slate-500">Track expiry dates and coverage details.</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 rounded-xl bg-slate-100 p-1 w-full max-w-md">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2
              ${activeTab === tab.id
                                ? 'bg-white text-indigo-700 shadow'
                                : 'text-slate-600 hover:bg-white/[0.12] hover:text-slate-800'
                            }
              transition-all duration-200
            `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <Loader />
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode='wait'>
                        {filteredWarranties.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-12 text-center text-slate-400"
                            >
                                No warranties found in this category.
                            </motion.div>
                        ) : (
                            filteredWarranties.map((warranty) => (
                                <motion.div
                                    key={warranty.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="border-l-4 border-l-indigo-500 h-full flex flex-col justify-between">
                                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                            <div className="space-y-1">
                                                <CardTitle className="text-base font-semibold">
                                                    Product #{warranty.product_id}
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    Activated on {new Date(warranty.created_at).toLocaleDateString()}
                                                </CardDescription>
                                            </div>
                                            <div className={`p-2 rounded-full border ${getStatusColor(warranty.status, warranty.expiry_date)}`}>
                                                {getStatusIcon(warranty.status, warranty.expiry_date)}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="mt-4 space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Expires</span>
                                                <span className="font-medium text-slate-900 flex items-center gap-2">
                                                    <Clock className="h-3 w-3 text-slate-400" />
                                                    {new Date(warranty.expiry_date).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                                    <span>Progress</span>
                                                    <span>{warranty.status === 'expired' ? '100%' : 'Active'}</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: warranty.status === 'expired' ? '100%' : '65%' }}
                                                        transition={{ duration: 1, ease: 'easeOut' }}
                                                        className={`h-full rounded-full ${warranty.status === 'expired' ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default Warranties;
