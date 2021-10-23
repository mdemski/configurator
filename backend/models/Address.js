const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LocalizationSchema = new Schema({
  coordinateA: {
    type: Number
  },
  coordinateB: {
    type: Number
  }
})

// Define collection and schema
let Address = new Schema({
  street: {
    type: String
  },
  address: {
    type: String
  },
  zipCode: {
    type: String
  },
  country: {
    type: String
  },
  localization: {
    type: LocalizationSchema
  }
}, {
  collection: 'addresses'
})

module.exports = mongoose.model('Address', Address)
