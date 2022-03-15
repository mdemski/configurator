const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let User = new Schema({
  email: {
    type: String
  },
  hash: {
    type: String
  },
  salt: {
    type: String
  },
  name: {
    type: String
  },
  role: {
    type: String
  },
  activated: {
    type: Boolean
  },
  uuid: {
    type: String
  },
  basicDiscount: {
    type: Number
  },
  roofWindowsDiscount: {
    type: Number
  },
  flashingsDiscount: {
    type: Number
  },
  accessoriesDiscount: {
    type: Number
  },
  skylightsDiscount: {
    type: Number
  },
  flatRoofWindowsDiscount: {
    type: Number
  },
  verticalWindowsDiscount: {
    type: Number
  },
  companyNip: {
    type: String
  },
  mainAddressId: {
    type: String
  },
  addressToSendId: {
    type: String
  },
  activationLink: {
    type: String
  },
  preferredLanguage: {
    type: String
  },
  created: {
    type: Date
  },
  lastUpdate: {
    type: Date
  },
}, {
  collection: 'users'
})

module.exports = mongoose.model('User', User)
