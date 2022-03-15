const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// let LocalizationSchema = new Schema({
//   coordinateA: {
//     type: Number
//   },
//   coordinateB: {
//     type: Number
//   }
// })

// Define collection and schema
let Address = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  street: {
    type: String
  },
  localNumber: {
    type: String
  },
  zipCode: {
    type: String
  },
  city: {
    type: String
  },
  country: {
    type: String
  }
}, {
  collection: 'addresses'
})

module.exports = mongoose.model('Address', Address)
