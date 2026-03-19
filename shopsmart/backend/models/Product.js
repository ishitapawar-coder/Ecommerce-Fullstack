const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  new_price: {
    type: Number,
    required: true
  },
  old_price: {
    type: Number,
    required: true
  },
  sizes: {
    type: [String],
    default: ['S', 'M', 'L', 'XL', 'XXL']
  },
  availableSizes: {
    type: [String],
    default: ['S', 'M', 'L', 'XL', 'XXL']
  },
  date: {
    type: Date,
    default: Date.now
  },
  available: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Product', productSchema);