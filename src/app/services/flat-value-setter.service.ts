import {Injectable} from '@angular/core';
import {FlatRoofWindow} from '../models/flat-roof-window';

@Injectable({
  providedIn: 'root'
})
export class FlatValueSetterService {

  constructor() {
  }

  buildWindowModel(model: string, pakietSzybowy: string, szerokosc: number, wysokosc: number) {
    const modelName = model.split(':')[1];
    const glazingName = pakietSzybowy.split(':')[1];
    return String(modelName + ' ' + glazingName + ' ' + szerokosc + 'x' + wysokosc);
  }

  getModelName(window: FlatRoofWindow) {
    return this.buildWindowModel(window.model, window.pakietSzybowy, window.szerokosc, window.wysokosc);
  }

  getNumberOfGlasses(window: FlatRoofWindow) {
    if (window.pakietSzybowy.split(':')[1].toLowerCase().startsWith('a')) {
      return 2;
    } else {
      return 3;
    }
  }

  getUwAndUgValues(window: FlatRoofWindow) {
    let windowUG = 1.0;
    let windowUW = 0.99;
    const pakietTemp = window.pakietSzybowy.toLowerCase().split(':')[1];
    if (pakietTemp.startsWith('a')) {
      windowUG = 1.0;
      if (window.model.split(':')[1] === 'PGX' || window.model.split(':')[1] === 'PGX LED') {
        windowUW = 0.99;
      } else {
        windowUW = 1.2;
      }
    } else {
      windowUG = 0.5;
      if (window.model.split(':')[1] === 'PGX' || window.model.split(':')[1] === 'PGX LED') {
        windowUW = 0.64;
      } else {
        windowUW = 0.92;
      }
    }
    return {windowUG, windowUW};
  }
}
