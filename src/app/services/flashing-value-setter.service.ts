import {Injectable, OnDestroy} from '@angular/core';
import {Flashing} from '../models/flashing';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlashingValueSetterService implements OnDestroy {

  isDestroyed$ = new Subject();

  constructor(public translate: TranslateService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
  }


  setModelNameFromErpData(flashing: Flashing) {
    // tslint:disable-next-line:max-line-length
    flashing.productName = this.buildFlashingName(flashing.model, flashing.szerokosc, flashing.wysokosc);
  }

  buildFlashingName(model: string, szerokosc: number, wysokosc: number) {
    let flashingDesc = '';
    this.translate.get('FLASHINGS-DATA').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      flashingDesc = text[model];
    });
    const flashingType = model.split(':')[1];
    return String(flashingDesc + ' ' + flashingType + ' ' + szerokosc + 'x' + wysokosc);
  }

  singleFlashingModelCreator(flashingType: string, apronType: string) {
    let singleFlashingModel = '';
    switch (flashingType) {
      case ('Kołnierz:D'):
        singleFlashingModel = 'Kołnierz:D';
        break;
      case ('Kołnierz:P'):
        singleFlashingModel = 'Kołnierz:P';
        break;
      case ('Kołnierz:L'):
        singleFlashingModel = 'Kołnierz:L';
        break;
      case ('Kołnierz:LH'):
        singleFlashingModel = 'Kołnierz:LH';
        break;
      case ('Kołnierz:R'):
        singleFlashingModel = 'Kołnierz:R';
        break;
      default:
        singleFlashingModel = '';
        break;
    }
    singleFlashingModel = String('Kołnierz:' + this.flashingTypeSetter(flashingType, apronType));
    return singleFlashingModel;
  }

  setTileHeight(flashing: Flashing) {
    const apronType = flashing.typFartucha;
    switch (apronType) {
      case ('U'):
        flashing.flashingTileHeight = 5;
        break;
      case ('H'):
        flashing.flashingTileHeight = 9;
        break;
      case ('H5'):
        flashing.flashingTileHeight = 5;
        break;
      case ('H9'):
        flashing.flashingTileHeight = 9;
        break;
      case ('H12'):
        flashing.flashingTileHeight = 12;
        break;
      case ('K'):
        flashing.flashingTileHeight = 5;
        break;
      case ('A'):
        flashing.flashingTileHeight = 5;
        break;
      case ('BRAK'):
        flashing.flashingTileHeight = 0;
        break;
      default:
        flashing.flashingTileHeight = 5;
        break;
    }
  }

  // Flashing models in combinations setter - return list of flashing models (Kołnierz:KXP H9, Kołnierz:KXL H9, Kołnierz:KYS H12, ...)
  flashingsArrayOfModelsCreator(verticalNumber: number, horizontalNumber: number, lShaped: string, flashingType: string, apronType: string): string[] {
    const flashingsModelArray: string[] = [];
    const lShapedConnection = lShaped === 'Kołnierz:KK';
    if (flashingType === 'Kołnierz:RESET') {
      const numberOfFlashings = verticalNumber * horizontalNumber;
      for (let i = 0; i < numberOfFlashings; i++) {
        flashingsModelArray.push(flashingType);
      }
    } else {
      // ApronType - Kołnierz:UE, Kołnierz:UO
      // FlashingType - BP, U, R, P, L, LH, D
      const splitFlashingType = this.flashingTypeSetter(flashingType, apronType);
      const flashingModel = String('Kołnierz:KYS ' + splitFlashingType);
      // Kombinacja z kołnierzami wyłącznie w pionie wraz z kołnierzami kolankowymi
      if (verticalNumber === 1) {
        if (lShapedConnection) {
          flashingsModelArray.push(String('Kołnierz:KK1 ' + splitFlashingType));
        } else {
          flashingsModelArray.push(flashingModel);
        }
        for (let i = 1; i < horizontalNumber; i++) {
          flashingsModelArray.push(flashingModel);
        }
      }
      // Kombinacja z kołnierzami w pinie i pozimie wraz z kołnierzami kolankowymi
      // Normalne dolne
      const bottomLeftFlashing = String('Kołnierz:KXP ' + splitFlashingType);
      const bottomRightFlashing = String('Kołnierz:KXL ' + splitFlashingType);
      const bottomMiddleFlashing = String('Kołnierz:KXS ' + splitFlashingType);
      // Kolankowe dolne
      const bottomLeftLShaped = String('Kołnierz:KKP ' + splitFlashingType);
      const bottomRightLShaped = String('Kołnierz:KKL ' + splitFlashingType);
      const bottomMiddleLShaped = String('Kołnierz:KKS ' + splitFlashingType);
      // Normalne górne
      const topLeftFlashing = String('Kołnierz:KZP ' + splitFlashingType);
      const topRightFlashing = String('Kołnierz:KZL ' + splitFlashingType);
      const topMiddleFlashing = String('Kołnierz:KZS ' + splitFlashingType);
      if (lShapedConnection) {
        flashingsModelArray.push(bottomLeftLShaped);
        for (let i = 2; i < verticalNumber; i++) {
          flashingsModelArray.push(bottomMiddleLShaped);
        }
        flashingsModelArray.push(bottomRightLShaped);
      } else {
        flashingsModelArray.push(bottomLeftFlashing);
        for (let i = 2; i < verticalNumber; i++) {
          flashingsModelArray.push(bottomMiddleFlashing);
        }
        flashingsModelArray.push(bottomRightFlashing);
      }
      for (let i = 1; i < horizontalNumber; i++) {
        flashingsModelArray.push(topLeftFlashing);
        for (let j = 2; j < verticalNumber; j++) {
          flashingsModelArray.push(topMiddleFlashing);
        }
        flashingsModelArray.push(topRightFlashing);
      }
    }
    return flashingsModelArray;
  }

  private flashingTypeSetter(flashingType: string, apronType: string): string {
    let splitFlashingType = '';
    if (flashingType === 'Kołnierz:BP' && apronType === 'Kołnierz:KE') {
      splitFlashingType = 'BP/H5';
    }
    if (flashingType === 'Kołnierz:BP' && apronType === 'Kołnierz:UE') {
      splitFlashingType = 'BP/H9';
    }
    if (flashingType === 'Kołnierz:BP' && apronType === 'Kołnierz:HE') {
      splitFlashingType = 'BP/H12';
    }
    if (flashingType === 'Kołnierz:BP' && apronType === 'Kołnierz:KO') {
      splitFlashingType = 'BP/KO';
    }
    if (flashingType === 'Kołnierz:BP' && apronType === 'Kołnierz:UO') {
      splitFlashingType = 'BP/UO';
    }
    if (flashingType === 'Kołnierz:BP' && apronType === 'Kołnierz:HO') {
      splitFlashingType = 'BP/HO';
    }
    if (flashingType === 'Kołnierz:BP' && apronType === 'Kołnierz:KA') {
      splitFlashingType = 'BP/KA';
    }
    if (flashingType === 'Kołnierz:BP' && apronType === 'Kołnierz:A') {
      splitFlashingType = 'BP/A';
    }
    if (flashingType === 'Kołnierz:BP' && apronType === 'Kołnierz:HA') {
      splitFlashingType = 'BP/HA';
    }
    if (flashingType === 'Kołnierz:BP' && apronType === 'Kołnierz:UB') {
      splitFlashingType = 'BP/UB';
    }
    if (flashingType === 'Kołnierz:U' && apronType === 'Kołnierz:KE') {
      splitFlashingType = 'H5';
    }
    if (flashingType === 'Kołnierz:U' && apronType === 'Kołnierz:UE') {
      splitFlashingType = 'H9';
    }
    if (flashingType === 'Kołnierz:U' && apronType === 'Kołnierz:HE') {
      splitFlashingType = 'H12';
    }
    if (flashingType === 'Kołnierz:U' && apronType === 'Kołnierz:KO') {
      splitFlashingType = 'K';
    }
    if (flashingType === 'Kołnierz:U' && apronType === 'Kołnierz:UO') {
      splitFlashingType = 'U';
    }
    if (flashingType === 'Kołnierz:U' && apronType === 'Kołnierz:HO') {
      splitFlashingType = 'H';
    }
    if (flashingType === 'Kołnierz:U' && apronType === 'Kołnierz:KA') {
      splitFlashingType = 'KA';
    }
    if (flashingType === 'Kołnierz:U' && apronType === 'Kołnierz:A') {
      splitFlashingType = 'A';
    }
    if (flashingType === 'Kołnierz:U' && apronType === 'Kołnierz:HA') {
      splitFlashingType = 'HA';
    }
    if (flashingType === 'Kołnierz:U' && apronType === 'Kołnierz:UB') {
      splitFlashingType = 'UB';
    }
    return splitFlashingType;
  }

  setFlashingApronType(flashingFamily: string, apronType: string) {
    // Setter dla kołnierzy kombi - przestawia typ fatrucha na Kołnierz:BRAK jeśli rodzina kołnierza kombi jest równa KZ, KY lub KK
    let flashingApronType = '';
    const familyValue = flashingFamily.split(':')[1];
    switch (familyValue) {
      case ('KY'):
        flashingApronType = 'Kołnierz:BRAK';
        break;
      case ('KZ'):
        flashingApronType = 'Kołnierz:BRAK';
        break;
      case ('KK'):
        flashingApronType = 'Kołnierz:BRAK';
        break;
      default:
        flashingApronType = apronType;
        break;
    }
    return flashingApronType;
  }

  setFlashingFamily(flashingModel: string) {
    // Ustawia rodzinę kołnierza w zależności od modelu - np. KołnierzUszczelniający:KZ
    let flashingFamilyName = '';
    const temp = flashingModel.split(':')[1].substring(0, 2);
    flashingFamilyName = String('KołnierzUszczelniający:' + temp);
    return flashingFamilyName;
  }

  setFlashingType(flashingModel: string) {
    // Ustawia rodzaj kołnierza w zależności od modelu - np. KołnierzUszczelniający:KZP
    let flashingTypeName = '';
    const temp = flashingModel.split(':')[1].substring(0, 3);
    flashingTypeName = String('KołnierzUszczelniający:' + temp);
    return flashingTypeName;
  }

  // Model = Null dla pojedynczych, dla kombi idzie w pętli z tablicy modeli
  generateFlashingCode(model: string | null, flashingType: string, flashingApron: string | null,
                       verticalSpacing: number, horizontalSpacing: number, outerMaterial: string,
                       outerColor: string, outerFinish: string, width: number, height: number) {
    let flashingCode = '';
    let flashingModel = '';
    let flashingApronCode = '';
    let verticalSpacingCode = '';
    let horizontalSpacingCode = '';
    if (flashingApron === null || flashingApron === 'Kołnierz:BRAK') {
      flashingApronCode = '--';
    } else {
      flashingApronCode = flashingApron.split(':')[1];
    }
    verticalSpacingCode = verticalSpacing === 0 ? '--' : String(verticalSpacing);
    horizontalSpacingCode = horizontalSpacing === 0 ? '--' : String(horizontalSpacing);
    if (model) {
      // Przykładowy model = Kołnierz:KZP U
      const secondPart = model.split(':')[1]; // KZP U
      const thirdPart = secondPart.split(' ')[1]; // U
      const partOfIndex = secondPart.substring(1, 3); // ZP
      if (thirdPart.length === 1) {
        flashingModel = String(partOfIndex + thirdPart + '-');
      } else {
        flashingModel = String(partOfIndex + thirdPart);
      }
    } else {
      // Przykładowo 1-U;
      const partOfFlashingType = flashingType.split(':')[1]; // U;
      if (partOfFlashingType.length === 1) {
        flashingModel = String('1-' + partOfFlashingType + '-');
      } else {
        flashingModel = String('1-' + partOfFlashingType);
      }
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

    flashingCode = '1K-' + flashingModel + flashingApronCode + '-' + verticalSpacingCode + horizontalSpacingCode + '-'
      + outerMaterialCode + outerColorCode + outerFinishCode + '-' + widthCode + heightCode + '-OKPK01';

    return flashingCode;
  }

  generateFlashingCombinationCode(verticalNumber: number, horizontalNumber: number, flashingType: string, apronType: string) {
    // H9
    const flashingModelValue = this.singleFlashingModelCreator(flashingType, apronType);
    let flashingCombinationCode = '';
    const numberOfFlashings = horizontalNumber * verticalNumber;
    if (horizontalNumber > verticalNumber) {
      flashingCombinationCode = String('KY' + numberOfFlashings + flashingModelValue);
    } else if (horizontalNumber === 1) {
      flashingCombinationCode = String('KX' + numberOfFlashings + flashingModelValue);
    } else {
      flashingCombinationCode = String('KZ' + numberOfFlashings + flashingModelValue);
    }
    return flashingCombinationCode;
  }

  // setNumberOfConnections(flashing: Flashing) {
  //   const flashingType = flashing.rodzaj.split(':')[1];
  //   switch (flashingType) {
  //     case ('K-1'):
  //       flashing.flashingCombination = false;
  //       flashing.flashingCombinationCode = null;
  //       break;
  //     case ('KYS'):
  //       flashing.flashingCombination = true;
  //       flashing.flashingNumberOfConnections = 2;
  //       break;
  //     case ('KXL'):
  //       flashing.flashingCombination = true;
  //       flashing.flashingNumberOfConnections = 2;
  //       break;
  //     case ('KXP'):
  //       flashing.flashingCombination = true;
  //       flashing.flashingNumberOfConnections = 2;
  //       break;
  //     case ('KXS'):
  //       flashing.flashingCombination = true;
  //       flashing.flashingNumberOfConnections = 6;
  //       break;
  //     case ('KZL'):
  //       flashing.flashingCombination = true;
  //       flashing.flashingNumberOfConnections = 4;
  //       break;
  //     case ('KZP'):
  //       flashing.flashingCombination = true;
  //       flashing.flashingNumberOfConnections = 4;
  //       break;
  //     case ('KZS'):
  //       flashing.flashingCombination = true;
  //       flashing.flashingNumberOfConnections = 6;
  //       break;
  //     case ('KK1'):
  //       flashing.flashingCombination = true;
  //       flashing.flashingNumberOfConnections = 2;
  //       break;
  //     case ('KKL'):
  //       flashing.flashingCombination = true;
  //       flashing.flashingNumberOfConnections = 4;
  //       break;
  //     case ('KKP'):
  //       flashing.flashingCombination = true;
  //       flashing.flashingNumberOfConnections = 4;
  //       break;
  //     case ('KKS'):
  //       flashing.flashingCombination = true;
  //       flashing.flashingNumberOfConnections = 6;
  //       break;
  //     default:
  //       flashing.flashingCombination = false;
  //       flashing.flashingNumberOfConnections = 1;
  //       break;
  //   }
  // }
}
