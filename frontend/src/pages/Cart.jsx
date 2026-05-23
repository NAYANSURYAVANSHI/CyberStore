import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, X } from 'lucide-react';

const Cart = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    getCartCount,
    coupon,
    shippingPriority,
    setShippingPriority,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useCart();
  
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

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

  const handleApplyPromo = () => {
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponInput('');
      setCouponError('');
    } else {
      setCouponError(res.error);
    }
  };

  if (getCartCount() === 0) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md bg-base-200/50 p-8 rounded-3xl border border-base-200/40 shadow-xl"
        >
          <ShoppingBag className="mx-auto text-primary mb-4" size={56} />
          <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-base-content/60 mb-6">
            Looks like you haven't added anything to your cart yet. Head back to the store to find some premium tech gear!
          </p>
          <Link to="/" className="btn btn-primary btn-block rounded-xl font-bold shadow-md shadow-primary/25">
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content py-12">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="font-heading font-black text-3xl md:text-5xl tracking-tight">
            Shopping Cart
          </h1>
          {confirmClear ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-error/10 rounded-2xl border border-error/25">
              <span className="text-xs font-bold text-error animate-pulse">Are you sure?</span>
              <button 
                onClick={() => { clearCart(); setConfirmClear(false); }} 
                className="btn btn-error btn-xs rounded-xl font-bold px-3 py-1"
              >
                Yes, Clear
              </button>
              <button 
                onClick={() => setConfirmClear(false)} 
                className="btn btn-ghost btn-xs rounded-xl text-base-content/60 px-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              className="btn btn-ghost btn-sm text-error rounded-xl hover:bg-error/10 font-bold gap-2"
            >
              <Trash2 size={15} /> Clear All Items
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence>
              {cart.items?.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex flex-col sm:flex-row items-center justify-between p-4 bg-base-200/30 rounded-2xl border border-base-200/40 gap-4 shadow-sm"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 bg-base-200 border border-base-300 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.product?.image_url || 'https://via.placeholder.com/150'}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-base-content line-clamp-1">
                        {item.product?.name}
                      </h3>
                      <p className="text-xs text-base-content/60 capitalize mt-0.5">
                        Category: {item.product?.category}
                      </p>
                      <p className="text-sm font-bold text-primary mt-1">
                        ${item.product?.price?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Actions & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-base-200/60">
                    {/* Quantity Selector */}
                    <div className="join border border-base-300 rounded-xl bg-base-100">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="btn btn-ghost btn-square join-item btn-xs font-bold"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="flex items-center justify-center w-8 font-bold text-xs bg-transparent join-item">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="btn btn-ghost btn-square join-item btn-xs font-bold"
                        disabled={item.quantity >= (item.product?.stock_quantity || 99)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="text-base font-black text-base-content w-20 text-right">
                      {formatPrice(item.product?.price * item.quantity)}
                    </span>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/15"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Cart Summary Sidebar */}
          <div className="lg:col-span-4 bg-base-200/40 p-6 rounded-3xl border border-base-200/50 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-xl text-base-content pb-3 border-b border-base-200">
              Order Summary
            </h3>

            {/* Delivery Tier Options */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-base-content/50 block">Shipping Speed</span>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShippingPriority('standard')}
                  className={`p-3 rounded-2xl border text-left flex flex-col transition-all cursor-pointer ${
                    shippingPriority === 'standard'
                      ? 'border-primary bg-primary/10 text-primary shadow-sm shadow-primary/5'
                      : 'border-base-300/40 bg-base-100/60 hover:border-primary/20 text-base-content'
                  }`}
                >
                  <span className="font-bold text-xs">Standard Shipping</span>
                  <span className="text-[10px] opacity-60 mt-0.5">Estimated 4-6 business days</span>
                  <span className="text-[10px] font-semibold text-primary mt-1">
                    {discountedSubtotal > 150 ? 'FREE' : formatPrice(10)}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShippingPriority('express')}
                  className={`p-3 rounded-2xl border text-left flex flex-col transition-all cursor-pointer ${
                    shippingPriority === 'express'
                      ? 'border-primary bg-primary/10 text-primary shadow-sm shadow-primary/5'
                      : 'border-base-300/40 bg-base-100/60 hover:border-primary/20 text-base-content'
                  }`}
                >
                  <span className="font-bold text-xs">Express Priority Delivery</span>
                  <span className="text-[10px] opacity-60 mt-0.5">Estimated 1-2 business days</span>
                  <span className="text-[10px] font-semibold text-primary mt-1">{formatPrice(15)}</span>
                </button>
              </div>
            </div>

            {/* Promo / Coupon Box */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-base-content/50 block">Promo Code</span>
              {coupon ? (
                <div className="flex items-center justify-between p-3.5 bg-green-500/10 border border-green-500/25 rounded-2xl text-green-500">
                  <div className="flex flex-col">
                    <span className="text-xs font-black tracking-wide">{coupon.code}</span>
                    <span className="text-[10px] font-semibold">Active: {(coupon.discount * 100)}% Discount Applied</span>
                  </div>
                  <button onClick={removeCoupon} className="btn btn-ghost btn-circle btn-xs text-green-500 hover:bg-green-500/20">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="join w-full">
                    <input
                      type="text"
                      placeholder="Enter promo code (e.g. CYBER20)"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value); setCouponError(''); }}
                      className="input input-bordered join-item w-full bg-base-100/60 rounded-l-2xl text-xs focus:outline-none focus:border-primary placeholder:text-base-content/40"
                    />
                    <button 
                      onClick={handleApplyPromo} 
                      className="btn btn-primary join-item rounded-r-2xl text-xs font-bold px-4"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[10px] text-error font-bold mt-1.5 pl-1">⚠️ {couponError}</p>
                  )}
                  <p className="text-[9px] text-base-content/40 mt-1 pl-1">Try: CYBER20 (20% off) · WELCOME10 (10% off)</p>
                </div>
              )}
            </div>

            {/* Detailed Calculations */}
            <div className="space-y-3 text-sm font-medium border-t border-base-200 pt-4">
              <div className="flex justify-between">
                <span className="text-base-content/60">Subtotal</span>
                <span className="text-base-content font-bold">{formatPrice(subtotal)}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-green-500 font-semibold">
                  <span>Coupon Discount ({coupon.discount * 100}%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-base-content/60">Shipping</span>
                <span className="text-base-content font-semibold">
                  {shippingFee === 0 ? (
                    <span className="text-success">FREE</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              {shippingPriority === 'standard' && shippingFee > 0 && (
                <div className="text-xs text-base-content/50 bg-base-100/50 p-2 rounded-xl border border-base-300/30">
                  💡 Add <span className="font-semibold text-primary">{formatPrice(150 - discountedSubtotal)}</span> more for Free Shipping!
                </div>
              )}
            </div>

            <div className="border-t border-base-200 pt-4 flex justify-between items-end">
              <span className="font-bold text-base text-base-content">Total</span>
              <span className="font-black text-2xl text-primary">{formatPrice(total)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-block rounded-xl font-bold gap-2 shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 cursor-pointer"
            >
              Checkout Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
