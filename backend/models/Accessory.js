const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Accessory = new Schema({
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
  dopasowanieRoletyDlugosc: {
    type: String
  },
  dopasowanieRoletySzerokosc: {
    type: String
  },
  typTkaniny: {
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
  kolorTkaniny: {
    type: String
  },
  kolorTworzywWew: {
    type: String
  },
  roletyKolorOsprzetu: {
    type: String
  },
  accessoryHorizontalSpacing: {
    type: Number
  },
  otwieranie: {
    type: String
  },
  tabliczka: {
    type: String
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

module.exports = mongoose.model('Accessory', Accessory)
