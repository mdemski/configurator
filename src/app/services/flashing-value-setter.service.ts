import {Injectable, OnDestroy} from '@angular/core';
import {Flashing} from '../models/flashing';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FlashingValueSetterService implements OnDestroy {

  isDestroyed$;

  constructor(public translate: TranslateService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }


  setModelNameFromErpData(flashing: Flashing) {
    // tslint:disable-next-line:max-line-length
    flashing.flashingName = this.buildFlashingModel(flashing.model, flashing.szerokosc, flashing.wysokosc);
  }

  buildFlashingModel(model: string, szerokosc: number, wysokosc: number) {
    let flashingDesc = '';
    this.translate.get('FLASHINGS-DATA').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      const flashingDescElement = model.split(':')[0];
      flashingDesc = text[flashingDescElement];
    });
    const flashingType = model.split(':')[1];
    return String(flashingDesc + ' ' + flashingType + ' ' + szerokosc + 'x' + wysokosc);
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
  flashingsArrayOfModelsCreator(verticalNumber: number, horizontalNumber: number, lShaped: string, flashingType: string): string[] {
    const flashingsModelArray: string[] = [];
    const lShapedConnection = lShaped === 'Kołnierz:KK';
    if (flashingType === 'Kołnierz:RESET') {
      const numberOfFlashings = verticalNumber * horizontalNumber;
      for (let i = 0; i < numberOfFlashings; i++) {
        flashingsModelArray.push(flashingType);
      }
    } else {
      // FlashingType - BP, U, R, P, L, LH, D
      const splitFlashingType = flashingType.split(':')[1];
      // Kombinacja z kołnierzami wyłącznie w pionie wraz z kołnierzami kolankowymi
      if (verticalNumber === 1) {
        if (lShapedConnection) {
          flashingsModelArray.push(String('Kołnierz:KK1 ' + splitFlashingType));
        } else {
          flashingsModelArray.push(flashingType);
        }
        const flashingModel = String('Kołnierz:KYS ' + splitFlashingType);
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
        for (let j = 2; i < verticalNumber; j++) {
          flashingsModelArray.push(topMiddleFlashing);
        }
        flashingsModelArray.push(topRightFlashing);
      }
    }
    return flashingsModelArray;
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
