const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Flashing = new Schema({
  kod: {
    type: String
  },
  nazwaPozycjiPL: {
    type: String
  },
  productName: {
    type: String
  },
  indeksAlgorytm: {
    type: String
  },
  nazwaPLAlgorytm: {
    type: String
  },
  status: {
    type: String
  },
  model: {
    type: String
  },
  szerokosc: {
    type: Number
  },
  wysokosc: {
    type: Number
  },
  grupaAsortymentowa: {
    type: String
  },
  typ: {
    type: String
  },
  geometria: {
    type: String
  },
  rodzaj: {
    type: String
  },
  rodzina: {
    type: String
  },
  oblachowanieMaterial: {
    type: String
  },
  oblachowanieKolor: {
    type: String
  },
  oblachowanieFinisz: {
    type: String
  },
  typKolnierza: {
    type: String
  },
  wiatrownicaDlugosc: {
    type: String
  },
  flashingApron: {
    type: String
  },
  flashingTileHeight: {
    type: Number
  },
  flashingCombination: {
    type: Boolean
  },
  flashingNumberOfConnections: {
    type: Number
  },
  flashingCombinationDirection: {
    type: String
  },
  rozstawPoziom: {
    type: Number
  },
  rozstawPion: {
    type: Number
  },
  flashingCombinationWidths: {
    type: [Number]
  },
  flashingCombinationHeights: {
    type: [Number]
  },
  CenaDetaliczna: {
    type: Number
  },
  dostepneRozmiary: {
    type: [Any]
  },
  linkiDoZdjec: {
    type: [String]
  },
  cennik: {
    type: String
  }
})

module.exports = mongoose.model('Flashing', Flashing)
