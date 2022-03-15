const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FlashingConfig = new Schema({
  id: {
    type: Number
  },
  flashing: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Flashing"
  },
  quantity: {
    type: Number
  },
  flashingFormName: {
    type: String
  },
  flashingFormData: {
    type: Object
  }
})

module.exports = mongoose.model('FlashingConfig', FlashingConfig)
