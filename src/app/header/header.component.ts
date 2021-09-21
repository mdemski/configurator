import {Component, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../store/app/app.state';
import {SetCurrentUser} from '../store/app/app.actions';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  userId: string;
  searchInApp: string;
  shopSubMenu = {display: 'none'};
  configSubMenu = {display: 'none'};
  advicesSubMenu = {display: 'none'};
  onScroll = false;

  constructor(private renderer: Renderer2,
              private el: ElementRef,
              public translate: TranslateService,
              private authService: AuthService,
              private store: Store) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  ngOnInit() {
    this.store.dispatch(SetCurrentUser);
  }

  logout() {
    this.authService.logout();
  }

  // TODO przygotować proces wyszukiwania
  onKeyup(searchText: HTMLInputElement) {
    this.searchInApp = searchText.value;
  }

  showShopSubMenu() {
    this.shopSubMenu = {display: 'flex'};
  }

  hideShopSubMenu() {
    this.shopSubMenu = {display: 'none'};
  }

  showConfigSubMenu() {
    this.configSubMenu = {display: 'flex'};
  }

  hideConfigSubMenu() {
    this.configSubMenu = {display: 'none'};
  }

  showAdviceSubMenu() {
    this.advicesSubMenu = {display: 'flex'};
  }

  hideAdviceSubMenu() {
    this.advicesSubMenu = {display: 'none'};
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.onScroll = window.scrollY > 350;
  }
}
