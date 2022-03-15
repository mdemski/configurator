const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let VerticalConfig = new Schema({
  id: {
    type: Number
  },
  vertical: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Vertical"
  },
  quantity: {
    type: Number
  },
  verticalFormName: {
    type: String
  },
  verticalFormData: {
    type: Object
  }
})

module.exports = mongoose.model('VerticalConfig', VerticalConfig)
