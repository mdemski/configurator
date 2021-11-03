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
  role: {
    type: String
  },
  activated: {
    type: Boolean
  },
  uuid: {
    type: String
  },
  discount: {
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
  }
}, {
  collection: 'users'
})

module.exports = mongoose.model('User', User)
