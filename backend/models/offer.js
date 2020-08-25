const mongoose = require('mongoose');

const { Schema } = mongoose;

const offerSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  hasProjectBudget: {
    type: Boolean,
  },
  hasHourlyRate: {
    type: Boolean,
  },
  budget: {
    type: String,
    default: 'Цена договорная',
  },
  publishedAt: {
    type: String,
  },
  publishedAtTS: {
    type: String,
  },
  tags: {
    type: Array,
  },
  url: {
    type: String,
  },
  from: {
    type: String,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
