const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let WindowConfig = new Schema({
  id: {
    type: Number
  },
  window: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "RoofWindowSkylight"
  },
  quantity: {
    type: Number
  },
  windowFormName: {
    type: String
  },
  windowFormData: {
    type: Object
  }
})

module.exports = mongoose.model('WindowConfig', WindowConfig)
