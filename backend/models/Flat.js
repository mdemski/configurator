const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Flat = new Schema({
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
  pakietSzybowy: {
    type: String
  },
  glazingToCalculation: {
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
  otwieranie: {
    type: String
  },
  stolarkaMaterial: {
    type: String
  },
  stolarkaKolor: {
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
  zamkniecieTyp: {
    type: String
  },
  zamkniecieKolor: {
    type: String
  },
  uszczelki: {
    type: Number
  },
  dostepneRozmiary: {
    type: [Any]
  },
  windowCoats: {
    type: [Any]
  },
  linkiDoZdjec: {
    type: [String]
  },
  listaDodatkow: {
    type: [Any]
  },
  CenaDetaliczna: {
    type: Number
  },
  windowUW: {
    type: Number
  },
  windowUG: {
    type: Number
  },
  iloscSprzedanychRok: {
    type: Number
  },
  kolorTworzywWew: {
    type: String
  },
  kolorTworzywZew: {
    type: String
  },
  numberOfGlasses: {
    type: Number
  },
  cennik: {
    type: String
  }
})

module.exports = mongoose.model('Flat', Flat)
