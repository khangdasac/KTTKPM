const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  description: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for query optimization
productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema, 'product');
