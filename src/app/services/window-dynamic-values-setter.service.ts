import {Injectable} from '@angular/core';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {WindowModelBuilderService} from './window-model-builder.service';
import {ConfigurationDataService} from './configuration-data.service';
import {map} from 'rxjs/operators';
import {GlazingType} from '../models/glazing-type';
import * as _ from 'lodash';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowDynamicValuesSetterService {

  constructor(private modelNameBD: WindowModelBuilderService,
              private configData: ConfigurationDataService) {
  }

  private static isPrimitive(obj) {
    return (obj !== Object(obj));
  }

  // private deepEqual(obj1, obj2) {
  //
  //   if (obj1 === obj2) // it's just the same object. No need to compare.
  //   {
  //     return true;
  //   }
  //
  //   if (WindowDynamicValuesSetterService.isPrimitive(obj1) &&
  //       WindowDynamicValuesSetterService.isPrimitive(obj2)) // compare primitives
  //   {
  //     return obj1 === obj2;
  //   }
  //
  //   if (Object.keys(obj1).length !== Object.keys(obj2).length) {
  //     return false;
  //   }
  //
  //   // compare objects with same number of keys
  //   for (const key in obj1) {
  //     if (!(key in obj2)) {
  //       return false;
  //     } // other object doesn't have this prop
  //     if (!this.deepEqual(obj1[key], obj2[key])) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

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

  glazingTypeSetter(material, glazing, chosenCoats: string[], using: string): Observable<string> {
    let model = '';
    let DrewnoSosna = false;
    let PVC = false;
    let dwuszybowy = false;
    let trzyszybowy = false;
    let trzyszybowyKrypton = false;
    let zewnetrznaHartowana = false;
    let wewnetrznaHartowana = false;
    let sunGuard = false;
    let bioClean = false;
    let matowa = false;
    let redukcjaHalasu = false;
    let laminowanaP1 = false;
    let laminowanaP2 = false;
    let laminowanaP4 = false;
    let ug: number;
    let gazSzlachetny: string;

    if (glazing === 'dwuszybowy' && (material === 'DrewnoSosna' || material === 'PVC')) {
      DrewnoSosna = true;
      PVC = true;
    } else {
      if (material === 'DrewnoSosna') {
        DrewnoSosna = true;
      }
      if (material === 'PVC') {
        PVC = true;
      }
    }

    if (glazing === 'dwuszybowy') {
      dwuszybowy = true;
      gazSzlachetny = 'argon';
      ug = 1.0;
    }

    if (glazing === 'trzyszybowy') {
      trzyszybowy = true;
      gazSzlachetny = 'argon';
    }

    if (glazing === 'trzyszybowyKrypton') {
      trzyszybowyKrypton = true;
      gazSzlachetny = 'krypton';
      ug = 0.5;
    }

    if (glazing === 'trzyszybowy' && material === 'DrewnoSosna') {
      ug = 0.7;
    }

    if (glazing === 'trzyszybowy' && material === 'PVC') {
      ug = 0.5;
    }

    for (const coat of chosenCoats) {
      switch (coat) {
        case 'zewnetrznaHartowana':
          zewnetrznaHartowana = true;
          break;
        case 'wewnetrznaHartowana':
          wewnetrznaHartowana = true;
          break;
        case 'sunGuard':
          sunGuard = true;
          break;
        case 'bioClean':
          bioClean = true;
          break;
        case 'matowa':
          matowa = true;
          break;
        case 'redukcjaHalasu':
          redukcjaHalasu = true;
          break;
        case 'laminowanaP1':
          laminowanaP1 = true;
          break;
        case 'laminowanaP2':
          laminowanaP2 = true;
          break;
        case 'laminowanaP4':
          laminowanaP4 = true;
          break;
      }
    }
    const tempGlazingType = new GlazingType('', DrewnoSosna, PVC, dwuszybowy, trzyszybowy, trzyszybowyKrypton,
      zewnetrznaHartowana, wewnetrznaHartowana, sunGuard, bioClean, matowa, redukcjaHalasu, laminowanaP1, laminowanaP2, laminowanaP4,
      ug, gazSzlachetny, using);
    if (material === undefined || glazing === undefined) {
      model = '';
    }
    return this.configData.fetchAllGlazingConfigurations()
      .pipe(
        map((glazingTypesFromFile: GlazingType[]) => {
          for (const glazingType of glazingTypesFromFile) {
            const glazingModel = glazingType.model;
            const innerLoopGlazing = glazingType;
            innerLoopGlazing.model = '';
            const isEqual = _.isEqual(tempGlazingType, innerLoopGlazing);
            if (isEqual) {
              model = glazingModel;
            }
          }
          return model;
        })
      );
  }
}
