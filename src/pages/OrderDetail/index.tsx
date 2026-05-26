import React from 'react';
import { useParams } from 'react-router-dom';
import { Package, Truck, CheckCircle } from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams();

  const order = {
    id,
    date: new Date().toISOString(),
    total: 45999,
    status: 'delivered',
    trackingNumber: 'TRK123456789',
    items: [
      {
        id: '1',
        name: 'Premium Laptop Pro 15',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        quantity: 1,
        price: 89999,
      },
    ],
    timeline: [
      { status: 'Order Placed', date: new Date(Date.now() - 86400000 * 5).toISOString(), completed: true },
      { status: 'Processing', date: new Date(Date.now() - 86400000 * 4).toISOString(), completed: true },
      { status: 'Shipped', date: new Date(Date.now() - 86400000 * 2).toISOString(), completed: true },
      { status: 'Delivered', date: new Date().toISOString(), completed: true },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Order #{order.id}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Placed on {formatDateTime(order.date)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <Card>
            <h2 className="text-xl font-bold mb-6">Order Status</h2>
            <div className="space-y-4">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${
                    event.completed ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {event.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-400 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.status}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDateTime(event.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Order Items */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quantity: {item.quantity}
                    </p>
                    <p className="font-bold mt-1">{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium">FREE</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold text-primary-600">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
            {order.trackingNumber && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  Tracking: {order.trackingNumber}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
