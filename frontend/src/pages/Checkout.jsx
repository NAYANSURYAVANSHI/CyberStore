import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { ordersAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, ShoppingBag, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { cart, fetchCart, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
  });

  const [payment, setPayment] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [error, setError] = useState('');

  const { coupon, shippingPriority } = useCart();

  const subtotal = cart?.totalPrice || 0;
  const discount = coupon ? subtotal * coupon.discount : 0;
  const discountedSubtotal = subtotal - discount;

  // Shipping Priority fee calculation
  let shippingFee = 0;
  if (shippingPriority === 'express') {
    shippingFee = 15;
  } else if (shippingPriority === 'standard') {
    shippingFee = discountedSubtotal > 150 || subtotal === 0 ? 0 : 10;
  }

  const total = discountedSubtotal + shippingFee;

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.zip_code || !address.country) {
      setError('Please fill in all shipping address fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await ordersAPI.create({
        shippingAddress: address,
        couponCode: coupon?.code || '',
        shippingPriority: shippingPriority
      });

      if (res.data?.success) {
        setSuccessOrder(res.data.data);
        await clearCart(); // Clear cart state locally
        await fetchCart(); // Re-sync
      } else {
        setError(res.data?.message || 'Checkout failed.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Error processing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If order was successfully created, show confirmation page
  if (successOrder) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-base-200/40 p-8 md:p-12 rounded-3xl border border-base-200/50 shadow-2xl text-center space-y-6"
        >
          <div className="avatar placeholder mx-auto">
            <div className="bg-success text-success-content rounded-full w-20 h-20 flex items-center justify-center ring-8 ring-success/15">
              <CheckCircle2 size={40} />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tight text-base-content">
            Order Confirmed!
          </h2>
          <p className="text-sm text-base-content/60 max-w-md mx-auto">
            Thank you for shopping with CyberStore. Your order has been placed and is currently being processed.
          </p>

          {/* Order Details box */}
          <div className="bg-base-100 rounded-2xl p-6 text-left border border-base-200/60 max-w-md mx-auto space-y-3 text-sm">
            <div className="flex justify-between border-b border-base-200/40 pb-2">
              <span className="text-base-content/50">Order ID:</span>
              <span className="font-bold text-xs truncate max-w-[200px]">{successOrder._id}</span>
            </div>
            <div className="flex justify-between border-b border-base-200/40 pb-2">
              <span className="text-base-content/50">Status:</span>
              <span className="badge badge-success badge-sm font-bold">{successOrder.status}</span>
            </div>
            <div className="flex justify-between border-b border-base-200/40 pb-2">
              <span className="text-base-content/50">Date:</span>
              <span>{new Date(successOrder.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-base-content/50 font-bold">Total Paid:</span>
              <span className="text-primary font-black text-base">${successOrder.total_amount?.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 max-w-md mx-auto">
            <Link to="/orders" className="btn btn-outline rounded-xl font-bold flex-1">
              View My Orders
            </Link>
            <Link to="/" className="btn btn-primary rounded-xl font-bold flex-1 shadow-md shadow-primary/20">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content py-12">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm gap-2 rounded-full mb-8 text-base-content/70 hover:text-base-content"
        >
          <ArrowLeft size={16} /> Back to Cart
        </button>

        <h1 className="font-heading font-black text-3xl md:text-5xl tracking-tight mb-8">
          Checkout
        </h1>

        {error && (
          <div className="alert alert-error rounded-xl mb-6 shadow-md max-w-4xl border border-error/15">
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Box */}
              <div className="bg-base-200/30 p-6 md:p-8 rounded-3xl border border-base-200/50 shadow-sm space-y-6">
                <h3 className="font-heading font-bold text-xl flex items-center gap-2">
                  <Truck className="text-primary" size={22} /> Shipping Address
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control md:col-span-2">
                    <label className="label text-xs font-bold text-base-content/60 uppercase">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                      required
                      placeholder="123 Cyber Way"
                      className="input input-bordered bg-base-100 rounded-xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label text-xs font-bold text-base-content/60 uppercase">City</label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      required
                      placeholder="Neo City"
                      className="input input-bordered bg-base-100 rounded-xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label text-xs font-bold text-base-content/60 uppercase">State / Province</label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      required
                      placeholder="Silicon"
                      className="input input-bordered bg-base-100 rounded-xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label text-xs font-bold text-base-content/60 uppercase">Zip / Postal Code</label>
                    <input
                      type="text"
                      name="zip_code"
                      value={address.zip_code}
                      onChange={handleAddressChange}
                      required
                      placeholder="94016"
                      className="input input-bordered bg-base-100 rounded-xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label text-xs font-bold text-base-content/60 uppercase">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      required
                      placeholder="United States"
                      className="input input-bordered bg-base-100 rounded-xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Box */}
              <div className="bg-base-200/30 p-6 md:p-8 rounded-3xl border border-base-200/50 shadow-sm space-y-6">
                <h3 className="font-heading font-bold text-xl flex items-center gap-2">
                  <CreditCard className="text-primary" size={22} /> Payment Method (Demo)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control md:col-span-2">
                    <label className="label text-xs font-bold text-base-content/60 uppercase">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={payment.cardName}
                      onChange={handlePaymentChange}
                      placeholder="John Doe"
                      className="input input-bordered bg-base-100 rounded-xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label text-xs font-bold text-base-content/60 uppercase">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={payment.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="•••• •••• •••• ••••"
                      className="input input-bordered bg-base-100 rounded-xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label text-xs font-bold text-base-content/60 uppercase">Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      value={payment.expiry}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                      className="input input-bordered bg-base-100 rounded-xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label text-xs font-bold text-base-content/60 uppercase">CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      value={payment.cvv}
                      onChange={handlePaymentChange}
                      placeholder="•••"
                      maxLength={4}
                      className="input input-bordered bg-base-100 rounded-xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Checkout Summary Sidebar */}
          <div className="lg:col-span-4 bg-base-200/40 p-6 rounded-3xl border border-base-200/50 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-xl text-base-content pb-3 border-b border-base-200">
              Your Order
            </h3>

            {/* Simple list of items */}
            <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
              {cart.items?.map((item) => (
                <div key={item._id} className="flex justify-between items-center text-xs font-semibold gap-4">
                  <span className="text-base-content/80 truncate flex-1">{item.product?.name}</span>
                  <span className="text-base-content/50">x{item.quantity}</span>
                  <span className="text-base-content">${(item.product?.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-base-200/60 pt-4 space-y-3 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-base-content/60">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-green-500 font-semibold">
                  <span>Promo Discount ({coupon.discount * 100}%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-base-content/60">Shipping ({shippingPriority === 'express' ? 'Express' : 'Standard'})</span>
                <span>
                  {shippingFee === 0 ? <span className="text-success font-semibold">FREE</span> : formatPrice(shippingFee)}
                </span>
              </div>
            </div>

            <div className="border-t border-base-200/60 pt-4 flex justify-between items-end">
              <span className="font-bold text-base text-base-content">Total Due</span>
              <span className="font-black text-2xl text-primary">{formatPrice(total)}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-base-content/50 bg-base-100 p-3 rounded-xl border border-base-300/30">
              <ShieldCheck size={16} className="text-success" />
              <span>Secure checkout. Payments are mock encrypted.</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !cart.items || cart.items.length === 0}
              className="btn btn-primary btn-block rounded-xl font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
