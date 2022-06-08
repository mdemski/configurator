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
    const glazingName = pakietSzybowy === null ? '' : pakietSzybowy.split(':')[1];
    return String(modelName + ' ' + glazingName + ' ' + szerokosc + 'x' + wysokosc);
  }

  getModelName(window: FlatRoofWindow) {
    return this.buildWindowModel(window.model, window.pakietSzybowy, window.szerokosc, window.wysokosc);
  }

  getNumberOfGlasses(window: FlatRoofWindow) {
    if (!window.pakietSzybowy) {
      return 2;
    } else {
      if (window.pakietSzybowy.split(':')[1].toLowerCase().startsWith('a')) {
        return 2;
      } else {
        return 3;
      }
    }
  }

  getUwAndUgValues(window: FlatRoofWindow) {
    let windowUG = 1.0;
    let windowUW = 0.99;
    const pakietTemp = window.pakietSzybowy === null ? '' : window.pakietSzybowy.split(':')[1];
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

  getWindowModel(openingType: string, option: string) {
    let flatRoofWindowModel = '';
    switch (openingType) {
      case 'NieotwieraneFIX':
        if (option) {
          flatRoofWindowModel = 'DachPłaski:PGX LED';
        } else {
          flatRoofWindowModel = 'DachPłaski:PGX';
        }
        break;
      case 'Manualne':
        flatRoofWindowModel = 'DachPłaski:PGM';
        break;
      case 'ElektryczneUchył':
        flatRoofWindowModel = 'DachPłaski:PGC';
        break;
    }
    return flatRoofWindowModel;
  }

  getWindowGroup(openingType: string) {
    let flatRoofWindowGroup = '';
    switch (openingType) {
      case 'NieotwieraneFIX':
        flatRoofWindowGroup = 'DachPłaski:PGX';
        break;
      case 'Manualne':
        flatRoofWindowGroup = 'DachPłaski:PGM';
        break;
      case 'ElektryczneUchył':
        flatRoofWindowGroup = 'DachPłaski:PGC';
        break;
    }
    return flatRoofWindowGroup;
  }

  generateWindowCode(otwieranie: string, option: string, pakietSzybowy: string, stolarkaKolor: string,
                     oblachowanieMaterial: string, oblachowanieKolor: string, oblachowanieFinisz: string, szerokosc: number, wysokosc: number) {
    let model = String(this.getWindowModel(otwieranie, option).split(':')[1] + '--');
    if (model === 'PGX LED--') {
      model = 'PGX-L';
    }

    const glazingCode = pakietSzybowy === null ? '' : pakietSzybowy.split(':')[1];

    let materialCode = '';
    if (stolarkaKolor === 'PVC:Biały9016') {
      materialCode = 'WSWS';
    } else {
      materialCode = 'WSWS';
    }

    let outerMaterialCode = '';
    switch (oblachowanieMaterial) {
      case 'Aluminium':
        outerMaterialCode = 'A';
        break;
      case 'Miedż':
        outerMaterialCode = 'C';
        break;
      case 'TytanCynk':
        outerMaterialCode = 'T';
        break;
    }

    let outerColorCode = '';
    if (oblachowanieKolor === 'Miedź:Natur' || oblachowanieKolor === 'TytanCynk:Natur') {
      outerColorCode = '0000';
    } else {
      if (oblachowanieKolor !== null) {
        outerColorCode = oblachowanieKolor.substring(oblachowanieKolor.length - 4);
      }
    }


    let outerFinishCode = '';
    switch (oblachowanieFinisz) {
      case 'Aluminium:Półmat':
        outerFinishCode = 'P';
        break;
      case 'Aluminium:Mat':
        outerFinishCode = 'M';
        break;
      case 'Aluminium:Połysk':
        outerFinishCode = 'B';
        break;
      case 'Aluminium:Natur':
        outerFinishCode = '0';
        break;
    }

    let widthCode;
    if (szerokosc < 100) {
      widthCode = '0' + szerokosc;
    } else {
      widthCode = szerokosc;
    }

    let heightCode;
    if (wysokosc < 100) {
      heightCode = '0' + wysokosc;
    } else {
      heightCode = wysokosc;
    }

    // '1P-PGX---A01-WSWS-A7022P-100100-OKPP01';
    return '1P-' + model + '-' + glazingCode + '-' + materialCode +
      '-' + outerMaterialCode + outerColorCode + outerFinishCode +
      '-' + widthCode + heightCode + '-OKPP01';
  }
}
