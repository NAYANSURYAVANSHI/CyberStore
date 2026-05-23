const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, createOrder)
  .get(protect, getUserOrders);

router.get('/admin/all', protect, authorize('admin'), getAllOrders);

router.route('/:id')
  .get(protect, getOrder);

router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
