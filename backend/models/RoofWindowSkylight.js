const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RoofWindowSkylight = new Schema({
  kod: {
    type: String
  },
  nazwaPozycjiPL: {
    type: String
  },
  windowName: {
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
  wentylacja: {
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
  windowHardware: {
    type: Boolean
  },
  uszczelki: {
    type: Number
  },
  dostepneRozmiary: {
    type: [Object]
  },
  windowCoats: {
    type: [Object]
  },
  linkiDoZdjec: {
    type: [String]
  },
  listaDodatkow: {
    type: [Object]
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
  okucia: {
    type: String
  },
  numberOfGlasses: {
    type: Number
  },
  cennik: {
    type: String
  }
})

module.exports = mongoose.model('RoofWindowSkylight', RoofWindowSkylight)
