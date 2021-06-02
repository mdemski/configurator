const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AccessoryConfig = new Schema({
  id: {
    type: Number
  },
  accessory: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Accessory"
  },
  quantity: {
    type: Number
  },
  accessoryFormName: {
    type: String
  },
  accessoryFormData: {
    type: Object
  }
})

module.exports = mongoose.model('AccessoryConfig', AccessoryConfig)
