const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FlatConfig = new Schema({
  id: {
    type: Number
  },
  flat: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Flat"
  },
  quantity: {
    type: Number
  },
  flatFormName: {
    type: String
  },
  flatFormData: {
    type: Object
  }
})

module.exports = mongoose.model('FlatConfig', FlatConfig)
