import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Store} from '@ngxs/store';
import {BehaviorSubject} from 'rxjs';
import {UserState} from '../store/user/user.state';

@Injectable({
  providedIn: 'root'
})
export class MdTranslateService {
  private availableLang = ['pl', 'en', 'fr', 'de'];
  private defaultLang = 'en';
  private actualLang = '';
  user$ = new BehaviorSubject<any>(null);

  constructor(private translate: TranslateService,
              private store: Store) {
    this.store.select(UserState).subscribe(user => this.user$.next(user));
  }

  setLanguage() {
    this.translate.addLangs(this.availableLang);
    if (this.translate.getBrowserLang() === null || this.translate.getBrowserLang() === undefined || this.translate.getBrowserLang() === ''){
      this.translate.setDefaultLang(this.defaultLang);
    } else {
      this.translate.setDefaultLang(this.translate.getBrowserLang());
    }
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|pl|de|fr/) ? browserLang : this.defaultLang);
    this.user$.subscribe(user => this.translate.use(user.preferredLanguage));
  }

  get(value: string) {
    return this.translate.get(value);
  }

  getLanguages() {
    return this.availableLang;
  }

  getBrowserLang() {
    return this.translate.getBrowserLang();
  }
}
