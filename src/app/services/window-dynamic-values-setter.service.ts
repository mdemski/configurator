import {Injectable} from '@angular/core';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {WindowModelBuilderService} from './window-model-builder.service';

@Injectable({
  providedIn: 'root'
})
export class WindowDynamicValuesSetterService {

  constructor(private modelNameBD: WindowModelBuilderService) {
  }

  setModelName(window: RoofWindowSkylight) {
    window.windowName = this.modelNameBD.buildWindowModel(window.model, window.pakietSzybowy, window.szerokosc, window.wysokosc);
  }

  setUwAndUgValues(window: RoofWindowSkylight) {
    window.windowUG = 0.7;
    window.windowUW = 1.06;
    const pakietTemp = window.pakietSzybowy.toLowerCase().split(':')[1];
    if (pakietTemp.startsWith('e')) {
      window.windowUG = 1.0;
      if (window.stolarkaMaterial === 'DrewnoSosna') {
        if (window.otwieranie === 'Okno:Uchylno-przesuwne') {
          window.windowUW = 1.3;
        } else {
          window.windowUW = 1.2;
        }
      }
      if (window.stolarkaMaterial === 'PVC') {
        if (window.model === 'Okno:BGOV') {
          window.windowUW = 1.3;
        } else {
          window.windowUW = 1.2;
        }
      }
    }
    if (pakietTemp.startsWith('n')) {
      window.windowUG = 0.5;
      window.windowUW = 0.83;
    }
    if (pakietTemp === 'i1' ||
      pakietTemp === 'i2' ||
      pakietTemp === 'i3' ||
      pakietTemp === 'i4') {
      window.windowUG = 0.5;
      window.windowUW = 0.91;
    }
  }

  setNumberOfGlasses(window: RoofWindowSkylight) {
    if (window.pakietSzybowy.split(':')[1].toLowerCase().startsWith('e')) {
      window.numberOfGlasses = 2;
    } else {
      window.numberOfGlasses = 3;
    }
  }
}
