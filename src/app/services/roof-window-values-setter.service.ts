import {Injectable} from '@angular/core';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {ConfigurationDataService} from './configuration-data.service';
import {map} from 'rxjs/operators';
import {GlazingType} from '../models/glazing-type';
import * as _ from 'lodash';
import {Observable} from 'rxjs';
import {ErpNameTranslatorService} from './erp-name-translator.service';
import {isString} from 'util';

@Injectable({
  providedIn: 'root'
})
export class RoofWindowValuesSetterService {

  constructor(private erpNames: ErpNameTranslatorService,
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
  //   if (RoofWindowValuesSetterService.isPrimitive(obj1) &&
  //       RoofWindowValuesSetterService.isPrimitive(obj2)) // compare primitives
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

  buildWindowModel(model: string, pakietSzybowy: string, szerokosc: number, wysokosc: number) {
    const modelName = model.split(':')[1];
    const glazingName = pakietSzybowy.split(':')[1];
    return String(modelName + ' ' + glazingName + ' ' + szerokosc + 'x' + wysokosc);
  }

  setModelName(window: RoofWindowSkylight) {
    window.windowName = this.buildWindowModel(window.model, window.pakietSzybowy, window.szerokosc, window.wysokosc);
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
      ug, gazSzlachetny, using.toLowerCase());
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
              model = using.concat(':', glazingModel);
            }
          }
          if (model === '') {
            if (glazing === 'dwuszybowy') {
              model = using.concat(':', 'E02');
            }
            if (glazing === 'trzyszybowy' && material === 'DrewnoSosna') {
              model = using.concat(':', 'I22');
            }

            if (glazing === 'trzyszybowy' && material === 'PVC') {
              model = using.concat(':', 'N22');
            }
          }
          return model;
        })
      );
  }

  // Roof Windows
  generateWindowCode(material: string, openingType: string, ventilation: string,
                     glazingType: string, innerColor: string, outerMaterial: string,
                     outerColor: string, outerFinish: string, width: number, height: number) {
    let model = '';
    switch (material) {
      case 'DrewnoSosna':
        model = 'IS';
        break;
      case 'PVC':
        model = 'IG';
        break;
    }
    switch (openingType) {
      case 'Okno:Obrotowe':
        model += 'O';
        break;
      case 'Okno:Uchylno-przesuwne':
        model += 'K';
        break;
      case 'Okno:NieotwieraneFIP':
        model += 'X';
        break;
      case 'Okno:ElektrycznePilot':
        model += 'C1';
        break;
      case 'Okno:ElektrycznePrzełącznik':
        model += 'C2';
        break;
      case 'Okno:Wysokoosiowe':
        model += 'W';
        break;
      case 'KolankoDrewno:NieotwieraneFIP':
        model = 'IKDN';
        break;
      case 'KolankoDrewno:Uchylne':
        model = 'IKDU';
        break;
      case 'KolankoPVC:UchylnoRozwierneLewe':
        model = 'KPVCL';
        break;
      case 'KolankoPVC:UchylnoRozwiernePrawe':
        model = 'KPVCP';
        break;
      case 'KolankoPVC:Uchylne':
        model = 'KPVCU';
        break;
      case 'KolankoPVC:NieotwieraneFIX':
        model = 'KPVCN';
        break;
    }

    if (openingType === 'KolankoPVC:UchylnoRozwierneLewe' ||
      openingType === 'KolankoPVC:UchylnoRozwiernePrawe' ||
      openingType === 'KolankoPVC:Uchylne' ||
      openingType === 'KolankoPVC:NieotwieraneFIX') {
      model += '';
    } else {
      switch (ventilation) {
        case 'NawiewnikNeoVent':
          if (openingType === 'Okno:ElektrycznePilot' ||
            openingType === 'KolankoDrewno:Uchylne' ||
            openingType === 'KolankoDrewno:NieotwieraneFIP' ||
            openingType === 'Okno:ElektrycznePrzełącznik') {
            model += 'V';
          } else {
            model += '-V';
          }
          break;
        case 'MaskownicaNeoVent':
          if (openingType === 'Okno:ElektrycznePilot' ||
            openingType === 'KolankoDrewno:Uchylne' ||
            openingType === 'KolankoDrewno:NieotwieraneFIP' ||
            openingType === 'Okno:ElektrycznePrzełącznik') {
            model += 'M';
          } else {
            model += '-M';
          }
          break;
        case 'Brak':
          if (openingType === 'Okno:ElektrycznePilot' ||
            openingType === 'KolankoDrewno:Uchylne' ||
            openingType === 'KolankoDrewno:NieotwieraneFIP' ||
            openingType === 'Okno:ElektrycznePrzełącznik') {
            model += 'X';
          } else {
            model += '-X';
          }
          break;
      }
    }

    let materialCode = '';
    if (material === 'DrewnoSosna') {
      materialCode = 'KL00';
    } else {
      materialCode = 'WSWS';
    }

    let outerMaterialCode = '';
    switch (outerMaterial) {
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
    switch (outerColor) {
      case 'Aluminium:RAL7022':
        outerColorCode = '7022';
        break;
      case 'Aluminium:RAL7016':
        outerColorCode = '7016';
        break;
      case 'Miedź:Natur':
        outerColorCode = '0000';
        break;
      case 'TytanCynk:Natur':
        outerColorCode = '0000';
        break;
    }

    let outerFinishCode = '';
    switch (outerFinish) {
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
    if (width < 100) {
      widthCode = '0' + width;
    } else {
      widthCode = width;
    }

    let heightCode;
    if (height < 100) {
      heightCode = '0' + height;
    } else {
      heightCode = height;
    }

    const glazingCode = glazingType.split(':')[1];

    // '1O-ISO-V-E02-KL00-A7022P-078118-OKPO01';
    return '1O-' + model + '-' + glazingCode + '-' + materialCode +
      '-' + outerMaterialCode + outerColorCode + outerFinishCode +
      '-' + widthCode + heightCode + '-OKPO01';
  }

  setWindowModel(material: string, openingType: string, ventilation: string) {
    let model = '';
    switch (material) {
      case 'DrewnoSosna':
        model = 'Okno:IS';
        break;
      case 'PVC':
        model = 'Okno:IG';
        break;
    }
    switch (openingType) {
      case 'Okno:Obrotowe':
        model += 'O';
        break;
      case 'Okno:Uchylno-przesuwne':
        model += 'K';
        break;
      case 'Okno:NieotwieraneFIP':
        model += 'X';
        break;
      case 'Okno:ElektrycznePilot':
        model += 'C1';
        break;
      case 'Okno:ElektrycznePrzełącznik':
        model += 'C2';
        break;
      case 'Okno:Wysokoosiowe':
        model += 'W';
        break;
      case 'KolankoDrewno:NieotwieraneFIP':
        model = 'Kolanko:IKDN';
        break;
      case 'KolankoDrewno:Uchylne':
        model = 'Kolanko:IKDU';
        break;
      case 'KolankoPVC:UchylnoRozwierneLewe':
        model = 'Kolanko:KPVCL';
        break;
      case 'KolankoPVC:UchylnoRozwiernePrawe':
        model = 'Kolanko:KPVCP';
        break;
      case 'KolankoPVC:Uchylne':
        model = 'Kolanko:KPVCU';
        break;
      case 'KolankoPVC:NieotwieraneFIX':
        model = 'Kolanko:KPVCN';
        break;
    }

    if (openingType === 'KolankoPVC:UchylnoRozwierneLewe' ||
      openingType === 'KolankoPVC:UchylnoRozwiernePrawe' ||
      openingType === 'KolankoPVC:Uchylne' ||
      openingType === 'KolankoPVC:NieotwieraneFIX') {
      model += '';
    } else {
      switch (ventilation) {
        case 'NawiewnikNeoVent':
          model += 'V';
          break;
        case 'MaskownicaNeoVent':
          model += 'M';
          break;
        case 'Brak':
          model += 'X';
          break;
      }
    }
    return model;
  }

  setWindowAssortmentGroup(openingType: string) {
    let assortmentGroup = '';
    switch (openingType) {
      case 'Okno:Obrotowe':
        assortmentGroup = 'OknoDachowe';
        break;
      case 'Okno:Uchylno-przesuwne':
        assortmentGroup = 'OknoDachowe';
        break;
      case 'Okno:Wysokoosiowe':
        assortmentGroup = 'OknoDachowe';
        break;
      case 'Okno:ElektrycznePilot':
        assortmentGroup = 'OknoDachowe';
        break;
      case 'Okno:ElektrycznePrzełącznik':
        assortmentGroup = 'OknoKolankowe';
        break;
      case 'KolankoDrewno:Uchylne':
        assortmentGroup = 'OknoKolankowe';
        break;
      case 'KolankoDrewno:NieotwieraneFIP':
        assortmentGroup = 'OknoKolankowe';
        break;
      case 'KolankoPVC:UchylnoRozwierneLewe':
        assortmentGroup = 'OknoKolankowe';
        break;
      case 'KolankoPVC:UchylnoRozwiernePrawe':
        assortmentGroup = 'OknoKolankowe';
        break;
      case 'KolankoPVC:Uchylne':
        assortmentGroup = 'OknoKolankowe';
        break;
      case 'KolankoPVC:NieotwieraneFIX':
        assortmentGroup = 'OknoKolankowe';
        break;
      case 'Okno:NieotwieraneFIP':
        assortmentGroup = 'OknoKolankowe';
        break;
    }
    return assortmentGroup;
  }

  setWindowType(openingType: string) {
    return String(this.setWindowAssortmentGroup(openingType) + ':Okno');
  }

  setWindowGeometry(material: string) {
    let geometry = 'Okno:';
    switch (material) {
      case 'DrewnoSosna':
        geometry += 'IS1';
        break;
      case 'PVC':
        geometry += 'IG2';
        break;
    }
    return geometry;
  }

  setWindowFamily(material: string, openingType: string) {
    const assortmentGroup = String(this.setWindowAssortmentGroup(openingType) + ':');
    let tempMaterial = '';
    let family = '';
    switch (material) {
      case 'DrewnoSosna':
        tempMaterial = 'IS';
        break;
      case 'PVC':
        tempMaterial = 'IG';
        break;
    }

    switch (openingType) {
      case 'Okno:Obrotowe':
        family = assortmentGroup + tempMaterial;
        break;
      case 'Okno:Uchylno-przesuwne':
        family = assortmentGroup + tempMaterial;
        break;
      case 'Okno:NieotwieraneFIP':
        family = assortmentGroup + tempMaterial;
        break;
      case 'Okno:ElektrycznePilot':
        family = assortmentGroup + tempMaterial;
        break;
      case 'Okno:ElektrycznePrzełącznik':
        family = assortmentGroup + tempMaterial;
        break;
      case 'Okno:Wysokoosiowe':
        family = assortmentGroup + tempMaterial;
        break;
      case 'KolankoDrewno:NieotwieraneFIP':
        family = assortmentGroup + tempMaterial;
        break;
      case 'KolankoDrewno:Uchylne':
        family = assortmentGroup + tempMaterial;
        break;
      case 'KolankoPVC:UchylnoRozwierneLewe':
        family = assortmentGroup + '88MD';
        break;
      case 'KolankoPVC:UchylnoRozwiernePrawe':
        family = assortmentGroup + '88MD';
        break;
      case 'KolankoPVC:Uchylne':
        family = assortmentGroup + '88MD';
        break;
      case 'KolankoPVC:NieotwieraneFIX':
        family = assortmentGroup + '88MD';
        break;
    }
    return family;
  }

  setWindowGroup(material: string, openingType: string) {
    const family = this.setWindowFamily(material, openingType);
    let type = '';

    switch (openingType) {
      case 'Okno:Obrotowe':
        type = family + 'O';
        break;
      case 'Okno:Uchylno-przesuwne':
        type = family + 'K';
        break;
      case 'Okno:NieotwieraneFIP':
        type = family + 'X';
        break;
      case 'Okno:ElektrycznePilot':
        type = family + 'C';
        break;
      case 'Okno:ElektrycznePrzełącznik':
        type = family + 'C';
        break;
      case 'Okno:Wysokoosiowe':
        type = family + 'W';
        break;
      case 'KolankoDrewno:NieotwieraneFIP':
        type = String(this.setWindowAssortmentGroup(openingType) + ':IKD');
        break;
      case 'KolankoDrewno:Uchylne':
        type = String(this.setWindowAssortmentGroup(openingType) + ':IKD');
        break;
      case 'KolankoPVC:UchylnoRozwierneLewe':
        type = String(this.setWindowAssortmentGroup(openingType) + ':KPVC');
        break;
      case 'KolankoPVC:UchylnoRozwiernePrawe':
        type = String(this.setWindowAssortmentGroup(openingType) + ':KPVC');
        break;
      case 'KolankoPVC:Uchylne':
        type = String(this.setWindowAssortmentGroup(openingType) + ':KPVC');
        break;
      case 'KolankoPVC:NieotwieraneFIX':
        type = String(this.setWindowAssortmentGroup(openingType) + ':KPVC');
        break;
    }
    return type;
  }

  translatePropertyNamesERP(toTranslate: string) {
    // if (isNumber(toTranslate) || isObject(toTranslate) || isBoolean(toTranslate)) {
    //   return toTranslate;
    // }
    if (toTranslate && isString(toTranslate)) {
      toTranslate = toTranslate.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\u0142/g, 'l');
      const firstPart = toTranslate.split(':')[0];
      let secondPart = toTranslate.split(':')[1];
      if (secondPart === 'Uchylno-przesuwne') {
        secondPart = 'UchylnoPrzesuwne';
      }
      if (secondPart === undefined) {
        secondPart = '';
      }
      return {firstPart, secondPart};
    }
  }
  // End Roof Windows
}
