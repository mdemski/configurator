import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralDataService {

  constructor() {
  }

  getProductConfig(product) {
    if (product.grupaAsortymentowa === 'OknoDachowe' ||
      product.grupaAsortymentowa === 'OknoKolankowe' ||
      product.grupaAsortymentowa === 'DachPłaski' ||
      product.grupaAsortymentowa === 'WyłazReset' ||
      product.grupaAsortymentowa === 'OknoDachoweReset' ||
      product.grupaAsortymentowa === 'OknoZintegrowane' ||
      product.grupaAsortymentowa === 'WyłazDachowy') {
      return 'standardType';
    }
    if (product.grupaAsortymentowa === 'KołnierzUszczelniający') {
      return 'aluminiumType';
    }
    if (product.grupaAsortymentowa === 'Akcesorium') {
      return 'accessoryType';
    }
    if (product.grupaAsortymentowa === '' || product.grupaAsortymentowa === null || product.grupaAsortymentowa === undefined) {
      return null;
    }
  }

  isEmpty(value) {
    return value === '' || value === null || value === undefined;
  }
}
