const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative'],
  },
  stock_quantity: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
    enum: [
      'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other',
      // Hardware-specific categories
      'Smartphones', 'Laptops', 'Tablets', 'Accessories',
    ],
  },
  image_url: {
    type: String,
    default: 'https://via.placeholder.com/300',
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  specs: {
    type: [String],
    default: [],
  },
  specs_text: {
    type: String,
    default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
