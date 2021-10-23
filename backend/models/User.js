const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let User = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
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
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address"
  }
}, {
  collection: 'users'
})

module.exports = mongoose.model('User', User)
