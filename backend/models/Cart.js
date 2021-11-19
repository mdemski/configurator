const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Cart = new Schema({
  cartItems: {
    type: mongoose.Schema.Types.Array,
    ref: "Item"
  },
  timestamp: {
    type: Number
  },
  totalAmount: {
    type: Number
  },
  totalAmountAfterDiscount: {
    type: Number
  },
  currency: {
    type: String
  },
  active: {
    type: Boolean
  },
  ordered: {
    type: Boolean
  }
}, {
  collection: 'carts'
});

module.exports = mongoose.model('Cart', Cart)
