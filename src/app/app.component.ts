import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Store} from '@ngxs/store';
import {GetCart} from './store/cart/cart.actions';
import {MdTranslateService} from './services/md-translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'window-configurator';

  constructor(private authService: AuthService, private translate: MdTranslateService, private store: Store) {
    translate.setLanguage();
  }

  ngOnInit() {
    this.authService.autoLogin();
    this.store.dispatch(GetCart);
  }
}
