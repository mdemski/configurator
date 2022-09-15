import {Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Select, Store} from '@ngxs/store';
import {SetCurrentUser, SetPreferredLanguage} from '../store/app/app.actions';
import {CartState} from '../store/cart/cart.state';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {skip, takeUntil} from 'rxjs/operators';
import {AppState} from '../store/app/app.state';
import {MdTranslateService} from '../services/md-translate.service';
import {CrudService} from '../services/crud-service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  @Select(CartState) cart$: Observable<any>;
  @Select(AppState) currentUser$: Observable<{ currentUser }>;
  isDestroyed$ = new Subject();
  items$ = new BehaviorSubject(null);
  loaded = false;
  userId: string;
  searchInApp = '';
  shopSubMenu = {display: 'none'};
  configSubMenu = {display: 'none'};
  advicesSubMenu = {display: 'none'};
  onScroll = false;
  quantityInCart$ = new BehaviorSubject<number>(0);
  userEmail = '';

  constructor(private translate: MdTranslateService,
              private authService: AuthService,
              private store: Store,
              private crud: CrudService) {
    translate.setLanguage();
    this.currentUser$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.userEmail = user.currentUser.email);
  }

  // TODO usnąć po dodaniu komunikacji z eNova
  itemsTempList = [
    {
      productName: 'ISOV E2 78x118',
      grupaAsortymentowa: 'OknoDachowe',
      kod: '1O-ISO-V-E02-KL00-A7022P-078118-OKPO01'
    },
    {
      productName: 'ISOV E2 78x140',
      grupaAsortymentowa: 'OknoDachowe',
      kod: '1O-ISO-V-E02-KL00-A7022P-078140-OKPO01'
    },
    {
      productName: 'IGOV N22 78x140',
      grupaAsortymentowa: 'OknoDachowe',
      kod: '1O-IGO-V-N22-WSWS-A7022P-078118-OKPO01'
    },
    {
      productName: 'IGOV N22 78x118',
      grupaAsortymentowa: 'OknoDachowe',
      kod: '1O-IGO-V-N22-WSWS-A7022P-078118-OKPO01'
    },
    {
      productName: 'H9 78x118',
      grupaAsortymentowa: 'KołnierzUszczelniający',
      kod: '1K-1-U-UE------A7022P-078118-OKPK01'
    }
  ];

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

  loadData() {
    if (!this.loaded) {
      this.items$.next(this.itemsTempList);
      this.loaded = true;
    }
    // TODO odkomentować poniższą linię i usunąć kolejną po dodaniu komunikacji z eNova
    // this.crud.getProductNames((items: [{ productName: string, grupaAsortymentowa: string, kod: string }]) => this.items$.next(items));
  }

  logout() {
    this.authService.logout();
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
