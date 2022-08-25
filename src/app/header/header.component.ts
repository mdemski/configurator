import {Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Select, Store} from '@ngxs/store';
import {SetCurrentUser, SetPreferredLanguage} from '../store/app/app.actions';
import {CartState} from '../store/cart/cart.state';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {skip, takeUntil} from 'rxjs/operators';
import {AppState} from '../store/app/app.state';
import {MdTranslateService} from '../services/md-translate.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  @Select(CartState) cart$: Observable<any>;
  @Select(AppState) currentUser$: Observable<{ currentUser }>;
  isDestroyed$ = new Subject();
  userId: string;
  searchInApp: string;
  shopSubMenu = {display: 'none'};
  configSubMenu = {display: 'none'};
  advicesSubMenu = {display: 'none'};
  onScroll = false;
  quantityInCart$ = new BehaviorSubject<number>(0);
  userEmail = '';

  constructor(private renderer: Renderer2,
              private el: ElementRef,
              private translate: MdTranslateService,
              private authService: AuthService,
              private store: Store) {
    translate.setLanguage();
    this.currentUser$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.userEmail = user.currentUser.email);
  }

  ngOnInit() {
    this.cart$.pipe(takeUntil(this.isDestroyed$), skip(1)).subscribe((data: { cart }) => {
      let quantityInCart = 0;
      if (data.cart.cartItems !== null) {
        for (const item of data.cart.cartItems) {
          // @ts-ignore
          quantityInCart += item._quantity;
        }
      }
      this.quantityInCart$.next(quantityInCart);
    });
    this.store.dispatch([SetCurrentUser, new SetPreferredLanguage(this.userEmail)]);
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
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
