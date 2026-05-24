const roundMoney = (value) => Number((value || 0).toFixed(2));

export const calculateCartPricing = (cart, coupon, shippingPriority = 'standard') => {
  const items = cart?.items || [];

  const subtotal = roundMoney(
    items.reduce((sum, item) => {
      const price = Number(item.product?.price || 0);
      const quantity = Number(item.quantity || 0);
      return sum + (price * quantity);
    }, 0)
  );

  const couponRate = Number(coupon?.discount || 0);
  const discount = roundMoney(subtotal * couponRate);
  const discountedSubtotal = roundMoney(subtotal - discount);

  let shippingFee = 0;
  if (shippingPriority === 'express') {
    shippingFee = subtotal === 0 ? 0 : 15;
  } else if (subtotal > 0 && subtotal < 150) {
    shippingFee = 10;
  }

  const total = roundMoney(discountedSubtotal + shippingFee);
  const freeShippingRemaining = roundMoney(Math.max(0, 150 - subtotal));

  return {
    subtotal,
    discount,
    discountedSubtotal,
    shippingFee,
    total,
    freeShippingRemaining,
  };
};
