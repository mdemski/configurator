import {Injectable} from '@angular/core';
import {PropertyValueTranslatorService} from './property-value-translator.service';

@Injectable({
  providedIn: 'root'
})
export class ErpNameTranslatorService {

  constructor(private valueTranslator: PropertyValueTranslatorService) {
  }

  translateWindowsPropertiesFromERPToApp(product) {
    // tslint:disable-next-line:forin
    for (const propertyName in product) {
      this.valueTranslator.translatePropertyValues('ROOF-WINDOWS-DATA', product[propertyName])
        .subscribe(translation => {
          product[propertyName] = translation;
        });
    }
  }
}
