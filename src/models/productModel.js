const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['draft', 'trash', 'published'],
    default: 'draft',
  },
  imported_t: {
    type: Date,
    required: true,
    default: Date.now,
  },
  url: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  created_t: {
    type: Date,
    required: true,
    default: Date.now,
  },
  last_modified_t: {
    type: Date,
    required: true,
    default: Date.now,
  },
  product_name: {
    type: String,
    required: true,
  },
  quantity: String,
  brands: String,
  categories: {
    type: [String],
    required: true,
  },
  labels: String,
  cities: String,
  purchase_places: String,
  stores: String,
  ingredients_text: String,
  traces: String,
  serving_size: String,
  serving_quantity: Number,
  nutriscore_score: Number,
  nutriscore_grade: String,
  main_category: String,
  image_url: String,
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
