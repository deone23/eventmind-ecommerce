import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import { formatCurrency, formatDate } from '../../utils/helpers';

const OrdersPage: React.FC = () => {
  // Mock orders data
  const orders = [
    {
      id: '1',
      date: new Date().toISOString(),
      total: 45999,
      status: 'delivered',
      items: 3,
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      total: 12999,
      status: 'shipped',
      items: 1,
    },
    {
      id: '3',
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
      total: 8999,
      status: 'processing',
      items: 2,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      delivered: 'success',
      shipped: 'info',
      processing: 'warning',
      cancelled: 'error',
    };
    return <Badge variant={variants[status] || 'default'}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} hover>
            <Link to={`${order.id}`} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  <Package className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(order.date)} • {order.items} items
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(order.total)}
                  </p>
                  {getStatusBadge(order.status)}
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
