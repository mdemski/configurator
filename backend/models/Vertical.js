const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Vertical = new Schema({
  productName: {
    type: String
  },
  verticalSystem: {
    type: String
  },
  verticalConstructionType: {
    type: String
  },
  verticalQuantity: {
    type: Number
  },
  verticalWidth: {
    type: Number
  },
  verticalHeight: {
    type: Number
  },
  verticalColorCombination: {
    type: String
  },
  verticalNumberOfGlasses: {
    type: String
  },
  verticalSashCombination: {
    type: String
  },
  verticalGlassType: {
    type: String
  },
  verticalWindowSurface: {
    type: Number
  },
  verticalExtras: {
    type: [String]
  }
})

module.exports = mongoose.model('Vertical', Vertical)
