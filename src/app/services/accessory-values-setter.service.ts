import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccessoryValuesSetterService {

  constructor() {
  }

  getAccessoryModel(kind, material, equipmentColor) {
    let model = '';
    let leftSide = '';
    let rawModel = '';
    let extraInfo1 = '';
    let extraInfo2 = '';
    rawModel = kind === null ? '' : kind.split(':')[1];
    leftSide = kind === null ? '' : kind.split(':')[0];
    switch (material) {
      case 'Zaciemniająca':
        extraInfo1 = 'Z';
        break;
      case 'Transparentna':
        extraInfo1 = 'T';
        break;
      case 'Zaciemniająca komórkowa':
        extraInfo1 = 'ZK';
        break;
      case 'Paroprzepuszczalna':
        extraInfo1 = '';
        break;
      default:
        extraInfo1 = '';
    }
    switch (equipmentColor) {
      case 'Srebrny':
        extraInfo2 = '';
        break;
      case 'Biały':
        extraInfo2 = 'W';
        break;
      case 'Beżowy':
        extraInfo2 = '';
        break;
      default:
        extraInfo2 = '';
    }
    switch (rawModel) {
      case 'D12':
      case 'D33':
      case 'D37':
      case 'P40':
      case 'P50':
        leftSide = 'AkcesoriumRoletaW';
        break;
      case 'ARZE':
      case 'ARZE1':
      case 'ARZS':
      case 'ARZS1':
      case 'RZE':
      case 'RZE1':
      case 'RZS1':
        leftSide = 'AkcesoriumRoletaZ';
        break;
      case 'ADK':
        leftSide = 'AkcesoriumKorba';
        break;
      case 'ACR230':
        leftSide = 'AkcesoriumACR';
        break;
      case 'AKP':
        leftSide = 'AkcesoriumAKP';
        break;
      case 'UTB':
        leftSide = 'AkcesoriumUTB';
        break;
      case 'ASE230':
        leftSide = 'AkcesoriumASE';
        break;
      case 'AWN':
        leftSide = 'AkcesoriumAWN';
        break;
      case 'BR':
        leftSide = 'AkcesoriumBlokada';
        break;
      case 'ADD':
        leftSide = 'AkcesoriumDetektor';
        break;
      case 'ADO':
        leftSide = 'AkcesoriumDrążek';
        break;
      case 'BL':
        leftSide = 'AkcesoriumListwa';
        break;
      case 'PGD':
        leftSide = 'AkcesoriumRamaDyst';
        break;
      case 'AMW':
      case 'AMZ':
      case 'AMZ1':
        leftSide = 'AkcesoriumMarkiza';
        break;
      case 'AMO':
        leftSide = 'AkcesoriumMoskitiera';
        break;
      case 'AP4':
      case 'ARZE1':
      case 'APR-1':
      case 'APR-6':
      case 'R1':
      case 'R5':
      case 'R60':
      case 'RS1':
      case 'RS5':
        leftSide = 'AkcesoriumPilot';
        break;
      default:
        leftSide = 'Akcesorium';
    }

    model = leftSide + ':' + rawModel + extraInfo1 + extraInfo2;
    return model;
  }

  getAccessoryFamily(rodzaj: string) {
    let family = 'Akcesorium:';
    const model = rodzaj === null ? '' : rodzaj.split(':')[1];
    switch (model) {
      case 'D37':
      case 'D33':
      case 'D12':
      case 'P40':
      case 'P50':
      case 'RZE':
      case 'RZS':
        family += 'Roleta';
        break;
      case 'AMZ':
      case 'AMW':
        family += 'Markiza';
        break;
      case 'AMO':
        family += 'Moskitiera';
        break;
      case 'BL':
        family += 'Listwa';
        break;
      case 'AKP':
        family += 'AKP';
        break;
      case 'UTB':
        family += 'UTB';
        break;
      case 'PF':
        family += 'RamaDyst';
        break;
      case 'ASE':
        family += 'Siłownik';
        break;
      case 'ACR':
        family += 'Centralka';
        break;
      case 'AWN':
        family += 'Włącznik';
        break;
      case 'Deszcz':
        family += 'Deszcz';
        break;
      case 'AP':
      case 'R':
      case 'APR':
        family += 'Pilot';
        break;
      case 'BR':
        family += 'Blokada';
        break;
      case 'ADK':
        family += 'Korba';
        break;
      case 'ADO':
        family += 'Drążek';
        break;
      default:
        family += 'Do uzupełnienia w eNova';
    }
    return family;
  }

  matchingSetter(framesMatching) {
    const matchingObject = {
      width: '0',
      height: '0'
    };
    framesMatching = framesMatching === null ? '' : framesMatching.split(':')[1];
    console.log(framesMatching);
    switch (framesMatching) {
      case 'BGOV':
      case 'BGOM':
      case 'IGC1V':
      case 'IGC2V':
      case 'IGC1M':
      case 'IGC2M':
      case 'IGHV':
      case 'IGHM':
      case 'IGOV':
      case 'IGOM':
        matchingObject.width = 'E';
        matchingObject.height = 'K';
        break;
      case 'IGK':
      case 'IGKV':
      case 'IGKM':
        matchingObject.width = 'D';
        matchingObject.height = 'E';
        break;
      case 'IGOX':
      case 'IGW':
      case 'IGW+':
      case 'IGWX':
      case 'IGWX+':
      case 'XGO':
      case 'XGK':
      case 'ING':
      case 'ING+':
        matchingObject.width = 'E';
        matchingObject.height = 'L';
        break;
      case 'IKDN':
      case 'IKDU':
      case 'ISOX':
      case 'ISW':
      case 'ISW+':
      case 'ISWX':
      case 'ISWX+':
      case 'XSO':
        matchingObject.width = 'E';
        matchingObject.height = 'H';
        break;
      case 'ISK':
      case 'ISKV':
      case 'ISKM':
        matchingObject.width = 'F';
        matchingObject.height = 'J';
        break;
      case 'ISO':
      case 'ISOV':
      case 'ISOM':
        matchingObject.width = 'E';
        matchingObject.height = 'F';
        break;
      case 'OT':
      case 'OTV':
      case 'OV':
        matchingObject.width = 'A';
        matchingObject.height = 'A';
        break;
      case 'OT PVC':
      case 'WHG':
      case 'WNG':
      case 'WZG':
        matchingObject.width = 'B';
        matchingObject.height = 'B';
        break;
      case 'VSC':
      case 'VSH':
      case 'VSO':
        matchingObject.width = 'C';
        matchingObject.height = 'D';
        break;
      case 'VSK':
      case 'VSKV':
      case 'VSKM':
        matchingObject.width = 'B';
        matchingObject.height = 'I';
        break;
      case 'VSOX':
      case 'VSW':
      case 'VSW+':
      case 'WNS':
      case 'WNS+':
      case 'WZS':
        matchingObject.width = 'C';
        matchingObject.height = 'G';
        break;
    }

    return matchingObject;
  }

  getAccessoryGeometry(kind: string, material: string, equipmentColor: string) {
    let geometry = '';
    let rawModel = '';
    let extraInfo1 = '';
    let extraInfo2 = '';
    rawModel = kind === null ? '' : kind.split(':')[1];
    switch (material) {
      case 'Zaciemniająca':
        extraInfo1 = 'Z';
        break;
      case 'Transparentna':
        extraInfo1 = 'T';
        break;
      case 'Zaciemniająca komórkowa':
        extraInfo1 = 'ZK';
        break;
      case 'Paroprzepuszczalna':
        extraInfo1 = '';
        break;
      default:
        extraInfo1 = '';
    }
    switch (equipmentColor) {
      case 'Srebrny':
        extraInfo2 = '';
        break;
      case 'Biały':
        extraInfo2 = 'W';
        break;
      case 'Beżowy':
        extraInfo2 = '';
        break;
      default:
        extraInfo2 = '';
    }
    geometry = rawModel + extraInfo1 + extraInfo2;
    return geometry;
  }

  getIndexAlgorithm(kind: string) {
    let indeksA = '';
    const rawModel = kind === null ? '' : kind.split(':')[1];
    switch (rawModel) {
      case 'D12':
      case 'D33':
      case 'D37':
        indeksA = 'I-ROLETAW';
        break;
      case 'ARZE':
      case 'ARZE1':
      case 'ARZS':
      case 'ARZS1':
      case 'RZE':
      case 'RZE1':
      case 'RZS1':
        indeksA = 'I-ROLETAZ';
        break;
      case 'P40':
      case 'P50':
        indeksA = 'I-PLISA';
        break;
      case 'PGD':
        indeksA = 'I-RAMAD';
        break;
      case 'ADK':
      case 'ACR230':
      case 'AKP':
      case 'UTB':
      case 'ASE230':
      case 'AWN':
      case 'BR':
      case 'ADD':
      case 'ADO':
      case 'BL':
      case 'AP4':
      case 'ARZE1':
      case 'APR-1':
      case 'APR-6':
      case 'R1':
      case 'R5':
      case 'R60':
      case 'RS1':
      case 'RS5':
      case 'AMW':
      case 'AMZ':
      case 'AMZ1':
      case 'AMO':
        indeksA = 'I-AKCESORIUM';
        break;
      default:
        indeksA = 'I-AKCESORIUM';
    }
    return indeksA;
  }

  getNameAlgorithm(kind) {
    let nameA = '';
    let nameE = '';
    const rawModel = kind === null ? '' : kind.split(':')[1];
    switch (rawModel) {
      case 'D12':
      case 'D33':
      case 'D37':
      case 'P40':
      case 'P50':
        nameA = 'NPL-ROLETAW';
        nameE = 'NEN-ROLETAW';
        break;
      case 'ARZE':
      case 'ARZE1':
      case 'ARZS':
      case 'ARZS1':
      case 'RZE':
      case 'RZE1':
      case 'RZS1':
        nameA = 'NPL-ROLETAZ';
        nameE = 'NEN-ROLETAZ';
        break;
      case 'PGD':
        nameA = 'NPL-RAMAD';
        nameE = 'NEN-RAMAD';
        break;
      case 'ADK':
      case 'ACR230':
      case 'AKP':
      case 'UTB':
      case 'ASE230':
      case 'AWN':
      case 'BR':
      case 'ADD':
      case 'ADO':
      case 'BL':
      case 'AP4':
      case 'ARZE1':
      case 'APR-1':
      case 'APR-6':
      case 'R1':
      case 'R5':
      case 'R60':
      case 'RS1':
      case 'RS5':
      case 'AMW':
      case 'AMZ':
      case 'AMZ1':
      case 'AMO':
        nameA = 'NPL-AKCESORIUM';
        nameE = 'NEN-AKCESORIUM';
        break;
      default:
        nameA = 'NPL-AKCESORIUM';
        nameE = 'NEN-AKCESORIUM';
    }
    return {nameA, nameE};
  }

  getAccessoryName(model: string, szerokosc: number, wysokosc: number, typTkaniny: string, kolorTkaniny: string, roletyKolorOsprzetu: string) {
    let accessoryName = ''; // D37TW Biały Transparentna A368 78 x 118
    const rawModel = model.split(':')[1];
    const rawFabric = model.split(':')[1];
    const rawColor = model.split(':')[1];
    accessoryName = rawModel + ' ' + roletyKolorOsprzetu + ' ' + rawFabric + ' ' + rawColor + ' ' + szerokosc + ' x ' + wysokosc;
    return accessoryName;
  }

  generateAccessoryCode(type: string, kind: string, szerokosc: number, wysokosc: number, typTkaniny: string, kolorTkaniny: string, roletyKolorOsprzetu: string,
                        dopasowanieRoletySzerokosc: string, dopasowanieRoletyDlugosc: string) {
    let accessoryCode = '';
    let modelCode = kind === null ? '' : kind.split(':')[1]; // D37
    const onlyWidth = !!(modelCode === 'D33' || modelCode ===  'D12' || (modelCode ===  'AMZ' && wysokosc < 141) || (modelCode ===  'AMW'  && wysokosc < 141));
    if (modelCode === 'ARZE') {
      modelCode = 'ARZE-';
    }

    if (modelCode === 'ARZS') {
      modelCode = 'ARZS-';
    }

    if (modelCode === 'RZE') {
      modelCode = 'RZE-';
    }

    if (modelCode === 'RZS') {
      modelCode = 'RZS-';
    }

    if (modelCode === 'AMW') {
      modelCode = 'AMW--';
    }

    if (modelCode === 'AMZ') {
      modelCode = 'AMZ-0';
    }

    let equipCode = '';
    if (modelCode.startsWith('D') || modelCode.startsWith('P4')) {
      switch (roletyKolorOsprzetu) {
        case 'Biały':
          equipCode = 'W';
          break;
        case 'Srebrny':
          equipCode = '-';
          break;
        case 'Beżowy':
          equipCode = 'B';
          break;
        default:
          equipCode = '';
      }
    }

    let materialCode = '';
    switch (typTkaniny) {
      case 'Transparentna':
        materialCode = '-T';
        break;
      case 'Zaciemniająca':
        materialCode = '-Z';
        break;
      case 'Zaciemniająca komórkowa':
        materialCode = '-K';
        break;
      case 'Paroprzepuszczalna':
        materialCode = '';
        break;
      default:
        materialCode = '';
    }

    let colorCode = '';
    if (!modelCode.startsWith('PGD')) {
      if (type === 'Akcesorium:Zewnętrzne' && !modelCode.startsWith('AM')) {
        const colorRAL = kolorTkaniny === null ? '' : kolorTkaniny.substring(kolorTkaniny.length - 4);
        colorCode = '-A' + colorRAL + 'P'; // A7022P
      } else {
        colorCode = kolorTkaniny === null ? '' : '-' + kolorTkaniny.split(':')[1];
      }
    } else {
      colorCode = '-WSWS';
    }

    let widthCode;
    if (szerokosc < 100) {
      widthCode = '0' + szerokosc;
    } else {
      widthCode = szerokosc;
    }
    let heightCode;
    if (onlyWidth) {
      heightCode = '---';
    } else {
      if (wysokosc < 100) {
        heightCode = '0' + wysokosc;
      } else {
        heightCode = wysokosc;
      }
    }

    let matchingWidthCode = '';
    let matchingHeightCode = '';
    if (modelCode.startsWith('D')) {
      matchingWidthCode = dopasowanieRoletySzerokosc.split(':')[1];
      matchingHeightCode = onlyWidth ? '-' : dopasowanieRoletyDlugosc.split(':')[1] + '-';
    }

    let prefix = '1A-';
    if (modelCode.startsWith('PGD')) {
      prefix = '1P-';
    }
    // 1A-D37W-Z-S005-078140-FJ-OKPA01 - ok, 1A-ARZS--A7022P-134098-OKPA01 - ok, 1A-P50K-Z-N734-220120-OKPA01 - ok, 1P-PGD15-WSWS-220120-OKPP01 - ok
    accessoryCode = prefix + modelCode + equipCode + materialCode + colorCode + '-' + widthCode + heightCode + '-' + matchingWidthCode + matchingHeightCode + 'OKPA01';

    return accessoryCode;
  }
}
