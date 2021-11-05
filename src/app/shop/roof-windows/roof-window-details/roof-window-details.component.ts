import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoofWindowSkylight} from '../../../models/roof-window-skylight';
import {User} from '../../../models/user';
import {Accessory} from '../../../models/accessory';
import {Select, Store} from '@ngxs/store';
import {map, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {RouterState} from '@ngxs/router-plugin';
import {RoofWindowState} from '../../../store/roof-window/roof-window.state';
import {AppState} from '../../../store/app/app.state';
import {CrudService} from '../../../services/crud-service';

@Component({
  selector: 'app-roof-window-details',
  templateUrl: './roof-window-details.component.html',
  styleUrls: ['./roof-window-details.component.scss']
})
export class RoofWindowDetailsComponent implements OnInit, OnDestroy {
  window$: Observable<RoofWindowSkylight>;
  @Select(AppState) user$: Observable<{ currentUser }>;
  logInUser: {
    email: string;
    user: string;
    loggedIn: boolean
  };
  routerData;
  windowToShow: RoofWindowSkylight;
  isDestroyed$ = new Subject();
  picturesOfWindow = [];
  windowMaterial: string;
  windowVent: string;
  windowHandle: string;
  priceAfterDisc$ = new Subject<number>();
  glazing: string;
  availableSizes = ['55x78', '55x98', '66x98', '66x118', '66x140', '78x98', '78x118', '78x140', '78x160', '94x118', '94x140', '94x160', '114x118', '114x140', '134x98'];
  quantity = 1;
  availableExtras: Accessory[] = [];

  constructor(private store: Store, private crud: CrudService) {
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.logInUser = user.currentUser);
    this.store.select(RouterState.state).pipe(takeUntil(this.isDestroyed$)).subscribe(state => {
      this.window$ = this.store.select(RoofWindowState.roofWindowByCode)
        .pipe(map(filterFn => filterFn(state['params'].windowId.toString())));
    });
  }

  ngOnInit(): void {
    this.window$.subscribe(window => {
      this.windowToShow = window;
      this.windowMaterial = window.stolarkaMaterial;
      this.windowVent = window.wentylacja;
      this.windowHandle = window.zamkniecieTyp;
      // TODO odkomentować po wczytaniu danych z eNova i zakomnetować kolejną linię
      // this.glazing = window.pakietSzybowy.split(':')[1];
      this.glazing = window.pakietSzybowy;
    });
    // TODO wczytać zdjęcia z bazy przypisane do danego indeksu
    this.picturesOfWindow.push('assets/img/products/ISO-I22.png');
    this.picturesOfWindow.push('assets/img/products/ISO-arrangement-1.png');
    this.picturesOfWindow.push('assets/img/products/ISO-arrangement-2.png');
    this.getDiscountPrice();
    // TODO napisać obsługę tej metody z wykorzystaniem store'a
    // this.availableExtras.push(this.db.getAccessoryById(1), this.db.getAccessoryById(2));
  }

  ngOnDestroy() {
    this.isDestroyed$.next();
  }

  getDiscountPrice() {
    if (this.logInUser.loggedIn) {
      return this.crud.readUserByEmail(this.logInUser.email).pipe(takeUntil(this.isDestroyed$)).subscribe(user => {
        this.priceAfterDisc$.next(this.windowToShow.CenaDetaliczna / (1 + user.discount));
      });
    }
  }

  resize(delta: number) {
    this.quantity = this.quantity + delta;
  }

  decreaseQuantity() {
    if (this.quantity === 1) {
      this.quantity = 1;
    } else {
      this.resize(-1);
    }
  }

  increaseQuantity() {
    this.resize(+1);
  }

  addToCart(quantity: number) {
    // TODO napisać obsługę tej metody z wykorzystaniem store'a
    // this.db.addToCart(this.windowToShow, quantity);
  }

  order(quantity: number) {
    // TODO napisać obsługę tej metody z wykorzystaniem store'a
    // this.db.order(this.windowToShow, quantity);
  }
}
