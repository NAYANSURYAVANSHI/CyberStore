import React, { useState, useEffect } from 'react';
import { productsAPI, ordersAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Modals / forms state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: 'Electronics',
    image_url: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        productsAPI.getAll({ limit: 100 }),
        ordersAPI.getAllOrders()
      ]);
      setProducts(prodRes.data?.data || []);
      setOrders(ordRes.data?.data || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('Error loading dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  // Product Form handlers
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
        category: product.category,
        image_url: product.image_url || ''
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category: 'Electronics',
        image_url: ''
      });
    }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      price: parseFloat(productForm.price),
      stock_quantity: parseInt(productForm.stock_quantity)
    };

    try {
      if (editingProduct) {
        // Update product
        const res = await productsAPI.update(editingProduct._id, payload);
        if (res.data?.success) {
          showToast('Product updated successfully!');
        }
      } else {
        // Create product
        const res = await productsAPI.create(payload);
        if (res.data?.success) {
          showToast('Product created successfully!');
        }
      }
      setIsProductModalOpen(false);
      fetchData(); // Reload
    } catch (err) {
      console.error('Product submit error:', err);
      showToast(err.response?.data?.message || 'Error processing product.');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await productsAPI.delete(id);
        showToast('Product deleted successfully.');
        fetchData();
      } catch (err) {
        console.error('Delete error:', err);
        showToast('Failed to delete product.');
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await ordersAPI.updateStatus(orderId, newStatus);
      if (res.data?.success) {
        showToast(`Order status updated to ${newStatus}`);
        fetchData(); // Reload
      }
    } catch (err) {
      console.error('Status update error:', err);
      showToast('Failed to update status.');
    }
  };

  // Stats Calculations
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const lowStockCount = products.filter((p) => p.stock_quantity < 5).length;

  return (
    <div className="min-h-screen bg-base-100 text-base-content pb-20 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="toast toast-bottom toast-center z-50 min-w-[280px]"
          >
            <div className="alert alert-success shadow-2xl rounded-2xl flex items-center gap-3 border border-success/20">
              <CheckCircle2 className="text-success-content" size={20} />
              <span className="font-semibold text-sm">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-heading font-black text-3xl md:text-5xl tracking-tight">
              Admin Board
            </h1>
            <p className="text-sm text-base-content/60 mt-1">Manage products, stocks, and fulfill orders.</p>
          </div>
          <button onClick={fetchData} className="btn btn-outline btn-sm rounded-xl gap-2 font-bold">
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {/* Revenue */}
          <div className="stats bg-base-200/40 border border-base-200/50 shadow-sm rounded-3xl p-2">
            <div className="stat">
              <div className="stat-figure text-primary">
                <TrendingUp size={28} />
              </div>
              <div className="stat-title text-xs font-bold uppercase text-base-content/50">Total Revenue</div>
              <div className="stat-value text-2xl text-base-content mt-1">${totalRevenue.toFixed(2)}</div>
              <div className="stat-desc text-xs mt-1 text-success">Fulfillments active</div>
            </div>
          </div>

          {/* Orders */}
          <div className="stats bg-base-200/40 border border-base-200/50 shadow-sm rounded-3xl p-2">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <ShoppingBag size={28} />
              </div>
              <div className="stat-title text-xs font-bold uppercase text-base-content/50">Total Orders</div>
              <div className="stat-value text-2xl text-base-content mt-1">{orders.length}</div>
              <div className="stat-desc text-xs mt-1 text-base-content/60">Placed by users</div>
            </div>
          </div>

          {/* Products */}
          <div className="stats bg-base-200/40 border border-base-200/50 shadow-sm rounded-3xl p-2">
            <div className="stat">
              <div className="stat-figure text-accent">
                <Package size={28} />
              </div>
              <div className="stat-title text-xs font-bold uppercase text-base-content/50">Products Catalog</div>
              <div className="stat-value text-2xl text-base-content mt-1">{products.length}</div>
              <div className="stat-desc text-xs mt-1 text-base-content/60">Active inventory types</div>
            </div>
          </div>

          {/* Warnings */}
          <div className="stats bg-base-200/40 border border-base-200/50 shadow-sm rounded-3xl p-2">
            <div className="stat">
              <div className="stat-figure text-warning">
                <AlertTriangle size={28} />
              </div>
              <div className="stat-title text-xs font-bold uppercase text-base-content/50">Low Stock Warning</div>
              <div className="stat-value text-2xl text-base-content mt-1">{lowStockCount}</div>
              <div className="stat-desc text-xs mt-1 text-warning font-semibold">
                {lowStockCount > 0 ? 'Needs immediate restock' : 'Stock levels healthy'}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="tabs tabs-boxed bg-base-200/40 border border-base-200/60 p-1.5 rounded-2xl mb-8 max-w-sm flex">
          <button
            onClick={() => setActiveTab('products')}
            className={`tab flex-1 font-bold text-sm rounded-xl py-2 transition-all ${
              activeTab === 'products' ? 'tab-active bg-primary text-primary-content' : 'text-base-content/60'
            }`}
          >
            Manage Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`tab flex-1 font-bold text-sm rounded-xl py-2 transition-all ${
              activeTab === 'orders' ? 'tab-active bg-primary text-primary-content' : 'text-base-content/60'
            }`}
          >
            Manage Orders ({orders.length})
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'products' ? (
              /* PRODUCTS MANAGEMENT PANEL */
              <motion.div
                key="products-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center bg-base-200/30 p-4 rounded-2xl border border-base-200/40">
                  <h3 className="font-heading font-bold text-lg">Product Inventory</h3>
                  <button
                    onClick={() => handleOpenProductModal()}
                    className="btn btn-primary btn-sm rounded-xl gap-1.5 font-bold shadow-md shadow-primary/20"
                  >
                    <Plus size={16} /> Add Product
                  </button>
                </div>

                <div className="overflow-x-auto bg-base-200/20 border border-base-200/40 rounded-3xl shadow-sm">
                  <table className="table table-zebra w-full text-sm">
                    <thead>
                      <tr className="bg-base-200/80 font-bold border-b border-base-200">
                        <th>Image</th>
                        <th>Product Details</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock Level</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => (
                        <tr key={prod._id} className="hover:bg-base-200/10 border-b border-base-200/30">
                          <td>
                            <div className="w-10 h-10 rounded-lg bg-base-200 border border-base-300 overflow-hidden">
                              <img src={prod.image_url || 'https://via.placeholder.com/80'} alt={prod.name} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="font-semibold text-base-content max-w-xs truncate">
                            <div>
                              <p className="font-bold text-sm truncate">{prod.name}</p>
                              <p className="text-xs text-base-content/50 font-normal truncate mt-0.5">{prod.description}</p>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-sm badge-ghost font-semibold">{prod.category}</span>
                          </td>
                          <td className="font-bold">${prod.price?.toFixed(2)}</td>
                          <td>
                            <span
                              className={`font-semibold ${
                                prod.stock_quantity < 5 ? 'text-error font-bold animate-pulse' : 'text-base-content/80'
                              }`}
                            >
                              {prod.stock_quantity} units
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenProductModal(prod)}
                                className="btn btn-ghost btn-circle btn-xs text-primary"
                                title="Edit Product"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod._id, prod.name)}
                                className="btn btn-ghost btn-circle btn-xs text-error"
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              /* ORDERS MANAGEMENT PANEL */
              <motion.div
                key="orders-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="overflow-x-auto bg-base-200/20 border border-base-200/40 rounded-3xl shadow-sm"
              >
                <table className="table table-zebra w-full text-sm">
                  <thead>
                    <tr className="bg-base-200/80 font-bold border-b border-base-200">
                      <th>Order ID</th>
                      <th>Customer Details</th>
                      <th>Items Count</th>
                      <th>Total Paid</th>
                      <th>Date</th>
                      <th>Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-base-200/10 border-b border-base-200/30">
                        <td className="font-mono font-bold text-xs truncate max-w-[120px]" title={ord._id}>
                          {ord._id}
                        </td>
                        <td>
                          {ord.user ? (
                            <div>
                              <p className="font-bold text-xs">{ord.user.username}</p>
                              <p className="text-xs text-base-content/60 truncate">{ord.user.email}</p>
                            </div>
                          ) : (
                            <span className="text-base-content/40 italic">Guest / Deleted</span>
                          )}
                        </td>
                        <td className="font-semibold text-center">
                          {ord.items?.reduce((c, i) => c + i.quantity, 0) || 0}
                        </td>
                        <td className="font-bold text-primary">${ord.total_amount?.toFixed(2)}</td>
                        <td className="text-xs">{new Date(ord.createdAt).toLocaleDateString()}</td>
                        <td>
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                            className="select select-bordered select-xs rounded-lg focus:outline-none focus:border-primary font-bold text-xs bg-base-100/90"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Product Form Modal */}
      {isProductModalOpen && (
        <div className="modal modal-open z-50">
          <div className="modal-box rounded-3xl bg-base-100 border border-base-200 shadow-2xl p-6 md:p-8 max-w-lg">
            <div className="flex justify-between items-center border-b border-base-200/40 pb-4 mb-6">
              <h3 className="font-heading font-black text-xl md:text-2xl text-base-content">
                {editingProduct ? 'Edit Product Details' : 'Add New Catalog Item'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="btn btn-ghost btn-circle btn-sm text-base-content/75 hover:bg-base-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label text-xs font-bold text-base-content/60 uppercase">Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Mechanical Gaming Keyboard"
                  className="input input-bordered bg-base-200/30 rounded-xl focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div className="form-control">
                <label className="label text-xs font-bold text-base-content/60 uppercase">Description</label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe your catalog item details..."
                  className="textarea textarea-bordered bg-base-200/30 rounded-xl focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-xs font-bold text-base-content/60 uppercase">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="79.99"
                    className="input input-bordered bg-base-200/30 rounded-xl focus:outline-none focus:border-primary text-sm"
                  />
                </div>

                <div className="form-control">
                  <label className="label text-xs font-bold text-base-content/60 uppercase">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock_quantity}
                    onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })}
                    placeholder="25"
                    className="input input-bordered bg-base-200/30 rounded-xl focus:outline-none focus:border-primary text-sm"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label text-xs font-bold text-base-content/60 uppercase">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="select select-bordered bg-base-200/30 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Home">Home</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label text-xs font-bold text-base-content/60 uppercase">Image URL</label>
                <input
                  type="url"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="https://example.com/image.png"
                  className="input input-bordered bg-base-200/30 rounded-xl focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div className="modal-actions pt-4 border-t border-base-200/40 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="btn btn-outline rounded-xl font-bold btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded-xl font-bold btn-sm shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
