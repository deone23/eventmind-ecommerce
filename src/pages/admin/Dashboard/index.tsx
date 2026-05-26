import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { Card, Badge } from '~/components/ui';
import { formatCurrency } from '~/utils/helpers';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Orders', value: '1,234', icon: ShoppingCart, change: '+12%', color: 'blue' },
    { label: 'Revenue', value: formatCurrency(1234567), icon: TrendingUp, change: '+23%', color: 'green' },
    { label: 'Products', value: '456', icon: Package, change: '+5%', color: 'purple' },
    { label: 'Customers', value: '8,901', icon: Users, change: '+18%', color: 'orange' },
  ];

  const recentOrders = [
    { id: '1234', customer: 'John Doe', amount: 45999, status: 'delivered' },
    { id: '1235', customer: 'Jane Smith', amount: 12999, status: 'shipped' },
    { id: '1236', customer: 'Bob Johnson', amount: 8999, status: 'processing' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <Link
          to="/eventmind-ops"
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition-shadow"
        >
          <Activity className="h-5 w-5" />
          <span>EventMind AI Ops</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-lg`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-semibold">#{order.id}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(order.amount)}</p>
                  <Badge variant={order.status === 'delivered' ? 'success' : 'info'}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* EventMind AI Integration Placeholder */}
        <Card>
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h2 className="text-xl font-bold">System Health</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="font-medium">Product Service</span>
              <Badge variant="success">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="font-medium">Order Service</span>
              <Badge variant="success">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="font-medium">Payment Service</span>
              <Badge variant="warning">Degraded</Badge>
            </div>
          </div>
          <Link
            to="/eventmind-ops"
            className="mt-4 block text-center text-primary-600 hover:text-primary-700 font-medium"
          >
            View Detailed Monitoring →
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
