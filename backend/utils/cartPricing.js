const roundMoney = (value) => Number((value || 0).toFixed(2));

const COUPONS = {
  CYBER20: 0.2,
  WELCOME10: 0.1,
  HARDWARE5: 0.05,
};

const calculateCartPricing = (items, couponCode, shippingPriority = 'standard') => {
  const subtotal = roundMoney(
    (items || []).reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0)
  );

  const normalizedCoupon = (couponCode || '').toUpperCase().trim();
  const couponRate = COUPONS[normalizedCoupon] || 0;
  const discount = roundMoney(subtotal * couponRate);
  const discountedSubtotal = roundMoney(subtotal - discount);

  let shippingFee = 0;
  if (shippingPriority === 'express') {
    shippingFee = subtotal === 0 ? 0 : 15;
  } else if (subtotal > 0 && subtotal < 150) {
    shippingFee = 10;
  }

  return {
    subtotal,
    couponRate,
    discount,
    discountedSubtotal,
    shippingFee: roundMoney(shippingFee),
    totalAmount: roundMoney(discountedSubtotal + shippingFee),
  };
};

module.exports = {
  COUPONS,
  calculateCartPricing,
};
