import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ShieldCheck, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import api from '../services/api';
import { Loader } from '../components/ui/Loader';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeWarranties: 0,
    expiringSoon: 0,
    expired: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const products = await api.get('/products');
        const warranties = await api.get('/warranties');

        // Calculate stats based on real data
        const totalProducts = products.data.length;
        const activeWarranties = warranties.data.filter(w => w.status === 'active').length;
        const expired = warranties.data.filter(w => w.status === 'expired').length;

        // Mock "Expiring Soon" logic (e.g. within 30 days)
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        const expiringSoon = warranties.data.filter(w => {
          const expiry = new Date(w.expiry_date);
          return w.status === 'active' && expiry <= thirtyDaysFromNow;
        }).length;

        setStats({
          totalProducts,
          activeWarranties,
          expiringSoon,
          expired
        });

        // Mock recent activity from products
        setRecentActivity(products.data.slice(0, 5));

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  const handleStatClick = (title) => {
    switch (title) {
      case 'Total Products':
        navigate('/products');
        break;
      case 'Active Warranties':
      case 'Expiring Soon':
      case 'Expired':
        navigate('/warranties');
        break;
      default:
        break;
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: ShoppingBag,
      color: 'bg-indigo-500',
      trend: '+12% from last month'
    },
    {
      title: 'Active Warranties',
      value: stats.activeWarranties,
      icon: ShieldCheck,
      color: 'bg-emerald-500',
      trend: '+5% new protections'
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringSoon,
      icon: AlertTriangle,
      color: 'bg-amber-500',
      trend: 'Action needed'
    },
    {
      title: 'Expired',
      value: stats.expired,
      icon: XCircle,
      color: 'bg-red-500',
      trend: 'Renewal overdue'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Overview of your warranty status.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleStatClick(stat.title)}
            className="cursor-pointer"
          >
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-4 w-4 ${stat.title === 'Total Products' ? 'text-indigo-600' : stat.title === 'Active Warranties' ? 'text-emerald-600' : stat.title === 'Expiring Soon' ? 'text-amber-600' : 'text-red-600'}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  {stat.trend.includes('+') ? <TrendingUp className="h-3 w-3 text-emerald-500" /> : null}
                  <span className={stat.trend.includes('overdue') ? 'text-red-500' : 'text-slate-500'}>
                    {stat.trend}
                  </span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity / Chart Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 items-start">
        <Card className="col-span-4 hover:shadow-md">
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-slate-500 text-sm">No recent activity.</p>
              ) : (
                recentActivity.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {product.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.brand}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(product.purchase_date).toLocaleDateString()}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 hover:shadow-md bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-none h-fit">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button
              onClick={() => navigate('/products', { state: { openAddModal: true } })}
              className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-3"
            >
              <ShoppingBag className="h-5 w-5" />
              <div>
                <p className="font-medium">Add New Product</p>
                <p className="text-xs text-indigo-200">Manually enter details</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/scan')}
              className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-3"
            >
              <ShieldCheck className="h-5 w-5" />
              <div>
                <p className="font-medium">Scan Receipt</p>
                <p className="text-xs text-indigo-200">Auto-detect details</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
