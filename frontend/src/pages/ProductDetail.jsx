import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { productsAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Shield, Truck, RefreshCcw, CheckCircle2, ChevronRight } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '' });

  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await productsAPI.getById(id);
      setProduct(res.data?.data || null);
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (val) => {
    const newQty = Math.max(1, Math.min(product?.stock_quantity || 1, quantity + val));
    setQuantity(newQty);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const res = await addToCart(product._id, quantity);
    if (res.success) {
      showToast(`Added ${quantity} ${product.name} to cart!`);
    } else {
      showToast(res.error || 'Failed to add to cart.');
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/" className="btn btn-primary rounded-xl">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

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

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-8">
        {/* Breadcrumbs */}
        <div className="text-sm breadcrumbs mb-8 text-base-content/60">
          <ul>
            <li>
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/" className="hover:text-primary transition-colors">Catalog</Link>
            </li>
            <li>
              <span className="text-base-content/40">{product.category}</span>
            </li>
            <li className="font-semibold text-base-content truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </li>
          </ul>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm gap-2 rounded-full mb-8 text-base-content/70 hover:text-base-content"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column: Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-6 flex flex-col items-center"
          >
            <div className="card overflow-hidden bg-base-200 border border-base-200 w-full aspect-square rounded-3xl relative shadow-md shadow-base-300">
              <img
                src={product.image_url || 'https://via.placeholder.com/600'}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <span className="absolute top-4 left-4 badge badge-primary font-bold text-sm px-4 py-3 shadow-md shadow-primary/20">
                {product.category}
              </span>
            </div>
          </motion.div>

          {/* Right Column: Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-6 flex flex-col justify-between"
          >
            <div>
              <h1 className="font-heading font-extrabold text-3xl md:text-5xl tracking-tight text-base-content mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Price & Rating Display */}
              <div className="flex items-center gap-6 mb-6">
                <span className="text-3xl md:text-4xl font-black text-primary">
                  {formatPrice(product.price)}
                </span>
                <div
                  className={`badge ${
                    product.stock_quantity > 0 ? 'badge-success' : 'badge-error'
                  } badge-outline font-bold py-3 px-4`}
                >
                  {product.stock_quantity > 0
                    ? `${product.stock_quantity} available`
                    : 'Out of Stock'}
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none text-base-content/80 mb-8 border-t border-base-200/50 pt-6">
                <h3 className="font-bold text-sm text-base-content/50 uppercase tracking-wider mb-2">Description</h3>
                <p className="leading-relaxed text-base">{product.description}</p>
              </div>

              {/* Specs */}
              {product.specs && product.specs.length > 0 && (
                <div className="mb-8 border-t border-base-200/50 pt-6">
                  <h3 className="font-bold text-sm text-base-content/50 uppercase tracking-wider mb-3">Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.specs.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm bg-base-200/30 border border-base-300/35 px-4 py-3 rounded-2xl font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Picker & Add to Cart (Only if in stock) */}
              {product.stock_quantity > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 items-center mb-10 border-t border-base-200/50 pt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-base-content/60 mr-2">Qty:</span>
                    <div className="join border border-base-300 rounded-xl bg-base-200/40">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="btn btn-ghost btn-square join-item btn-sm font-bold"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="flex items-center justify-center w-12 font-bold text-sm bg-transparent join-item">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="btn btn-ghost btn-square join-item btn-sm font-bold"
                        disabled={quantity >= product.stock_quantity}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="btn btn-primary btn-block sm:w-auto sm:flex-1 rounded-xl font-bold gap-3 shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>
              )}
            </div>

            {/* Quality Selling Points Accordion */}
            <div className="border-t border-base-200/50 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-base-content/70">
                <Shield size={18} className="text-primary" />
                <span className="font-medium">1-Year store warranty protection included</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-base-content/70">
                <Truck size={18} className="text-primary" />
                <span className="font-medium">Fast insured express courier tracking</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-base-content/70">
                <RefreshCcw size={18} className="text-primary" />
                <span className="font-medium">Free returns within 30 days of receipt</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
