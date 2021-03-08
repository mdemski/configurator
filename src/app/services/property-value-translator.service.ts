import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {filter, pluck} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyValueTranslatorService {

  constructor(public translate: TranslateService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  translatePropertyValues(prefix: string, propertyName: string): Observable<string> {
    return this.translate.get(prefix.toUpperCase()).pipe(
      pluck(propertyName),
      filter(value => value !== undefined)
    );
  }
}
