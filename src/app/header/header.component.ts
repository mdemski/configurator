import {Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  isAuthenticated = false;
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
              private userService: UserService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      if (user) {
        this.userId = this.userService.getUserByEmail(user.email).localId;
        console.log(this.userId);
      }
    });
    // TODO znaleźć użytkownika z bazy używając email żeby zwrócić ID do routingu www.moja-aplikacja.pl/moje-konto/id
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
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
