const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Item = new Schema({
  itemId: {
    type: String
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accessory" || "Flashing" || "Flat" || "RoofWindowSkylight" || "Vertical"
  },
  quantity: {
    type: Number
  },
  created: {
    type: Date
  },
  isOrdered: {
    type: Boolean
  }
}, {
  collection: 'items'
});

module.exports = mongoose.model('Item', Item)
