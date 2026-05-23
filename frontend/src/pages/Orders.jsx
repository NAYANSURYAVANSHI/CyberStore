import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { motion } from 'framer-motion';
import { ShoppingBag, Calendar, MapPin, ClipboardList, Package } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getUserOrders();
      // wait, res.data.data has the array of orders. Let's make sure it is assigned correctly!
      setOrders(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'badge-success';
      case 'Shipped':
        return 'badge-info';
      case 'Processing':
        return 'badge-warning';
      case 'Pending':
        return 'badge-neutral';
      case 'Cancelled':
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md bg-base-200/50 p-8 rounded-3xl border border-base-200/40 shadow-xl"
        >
          <ClipboardList className="mx-auto text-primary mb-4" size={56} />
          <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
          <p className="text-sm text-base-content/60 mb-6">
            You haven't placed any orders yet. Visit the catalog to make your first purchase.
          </p>
          <Link to="/" className="btn btn-primary btn-block rounded-xl font-bold shadow-md shadow-primary/25">
            Browse Catalog
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content py-12">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 xl:px-12">
        <h1 className="font-heading font-black text-3xl md:text-5xl tracking-tight mb-8">
          Order History
        </h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-base-200/30 border border-base-200/50 rounded-3xl overflow-hidden shadow-sm hover:border-base-300/80 transition-all duration-300"
            >
              {/* Header block */}
              <div className="p-6 bg-base-200/50 border-b border-base-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-base-content/50 uppercase tracking-widest font-bold">Order ID</span>
                  <p className="font-bold text-sm text-base-content truncate max-w-[240px] sm:max-w-none">{order._id}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-base-content/75">
                    <Calendar size={14} />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`badge ${getStatusBadge(order.status)} font-bold text-xs py-2 px-3`}>
                    {order.status}
                  </div>
                </div>
              </div>

              {/* Items Block */}
              <div className="p-6 divide-y divide-base-200/40">
                {order.items?.map((item) => (
                  <div key={item._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-base-200 border border-base-300 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.product?.image_url || 'https://via.placeholder.com/100'}
                          alt={item.product?.name || 'Deleted Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-base-content line-clamp-1">
                          {item.product?.name || 'Product Details Unavailable'}
                        </h4>
                        <p className="text-xs text-base-content/50 mt-0.5">
                          Qty: {item.quantity} @ ${item.price_at_purchase?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-base-content">
                      ${(item.price_at_purchase * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer details: Address & Total Amount */}
              <div className="p-6 bg-base-100 border-t border-base-200/40 flex flex-col sm:flex-row justify-between gap-4 text-sm">
                {order.shipping_address && (
                  <div className="space-y-1">
                    <span className="text-xs text-base-content/50 font-bold uppercase flex items-center gap-1.5">
                      <MapPin size={12} /> Shipping Destination
                    </span>
                    <p className="text-xs text-base-content/75 leading-relaxed">
                      {order.shipping_address.street}, {order.shipping_address.city},{' '}
                      {order.shipping_address.state} {order.shipping_address.zip_code},{' '}
                      {order.shipping_address.country}
                    </p>
                  </div>
                )}
                <div className="flex items-end justify-between sm:justify-start sm:flex-col sm:items-end gap-1.5 self-end">
                  <span className="text-xs text-base-content/50 font-bold uppercase">Total Amount</span>
                  <span className="font-black text-xl text-primary">${order.total_amount?.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
