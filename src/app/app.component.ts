import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from './services/auth.service';
import {Store} from '@ngxs/store';
import {GetCart} from './store/cart/cart.actions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'window-configurator';

  constructor(private authService: AuthService, public translate: TranslateService, private store: Store) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
    // TODO doblokować ten kod do ładowania odpowiedniego języka z przeglądarki
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang.match(/en|pl|de|fr/) ? browserLang : 'pl');
    translate.use('pl');
  }

  ngOnInit() {
    this.authService.autoLogin();
    this.store.dispatch(GetCart);
  }
}
