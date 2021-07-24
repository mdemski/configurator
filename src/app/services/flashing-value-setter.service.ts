import {Injectable} from '@angular/core';
import {Flashing} from '../models/flashing';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FlashingValueSetterService {

  isDestroyed$;

  constructor(public translate: TranslateService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  setModelName(flashing: Flashing) {
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
}
