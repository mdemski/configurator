import {Injectable} from '@angular/core';
import {PropertyValueTranslatorService} from './property-value-translator.service';
import {isString} from 'util';

@Injectable({
  providedIn: 'root'
})
export class ErpNameTranslatorService {

  constructor(private valueTranslator: PropertyValueTranslatorService) {
  }

  translateNamesFromERPToApp(product) {
    // tslint:disable-next-line:forin
    for (const propertyName in product) {
      this.valueTranslator.translatePropertyValues('ROOF-WINDOWS-DATA', product[propertyName])
        .subscribe(translation => {
          product[propertyName] = translation;
        });
    }
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


  // Flashings
  // End Flashings
}
