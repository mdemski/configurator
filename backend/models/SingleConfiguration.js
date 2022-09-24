const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let SingleConfiguration = new Schema({
  globalId: {
    type: String
  },
  created: {
    type: Date
  },
  lastUpdate: {
    type: Date
  },
  user: {
    type: String
  },
  userId: {
    type: Number
  },
  name: {
    type: String
  },
  installationAddress: {
    type: mongoose.Schema.Types.Mixed,
    ref: "Address"
  },
  emailToSend: {
    type: String
  },
  active: {
    type: Boolean
  },
  products: {
    windows: {
      type: mongoose.Schema.Types.Array,
      ref: "WindowConfig"
    },
    flashings: {
      type: mongoose.Schema.Types.Array,
      ref: "FlashingConfig"
    },
    accessories: {
      type: mongoose.Schema.Types.Array,
      ref: "AccessoryConfig"
    },
    verticals: {
      type: mongoose.Schema.Types.Array,
      ref: "VerticalConfig"
    },
    flats: {
      type: mongoose.Schema.Types.Array,
      ref: "FlatConfig"
    },
  },
  comments: {
    type: String
  }
}, {
  collection: 'configurations'
})

module.exports = mongoose.model('SingleConfiguration', SingleConfiguration)
