import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../services/database.service';
import {MdTranslateService} from '../services/md-translate.service';
import {Select, Store} from '@ngxs/store';
import {CartState} from '../store/cart/cart.state';
import {Observable} from 'rxjs';
import {AddProductToCart} from '../store/cart/cart.actions';
import {SetAvailableSellers, SetMostRecentProducts} from '../store/app/app.actions';
import {take} from 'rxjs/operators';
import {AppState} from '../store/app/app.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Select(CartState) cart$: Observable<any>;
  @Select(AppState.mostRecentProducts) recentProducts$: Observable<any[]>;
  @Select(AppState.availableSellers) availableSellers$: Observable<any[]>;
  activeClass1 = '';
  activeClass2 = '';
  activeClass3 = '';
  activeClass4 = '';

  constructor(private translate: MdTranslateService,
              private store: Store) {
    translate.setLanguage();
    this.store.dispatch(new SetMostRecentProducts()).pipe(take(1)).subscribe(console.log);
    this.store.dispatch(new SetAvailableSellers()).pipe(take(1)).subscribe(console.log);
  }

  ngOnInit(): void {
  }

  addToCart(product: any) {
    this.store.dispatch(new AddProductToCart(product, 1));
  }

  setActive1() {
    this.activeClass1 = 'active';
    this.activeClass2 = '';
    this.activeClass3 = '';
    this.activeClass4 = '';
  }

  setActive2() {
    this.activeClass1 = '';
    this.activeClass2 = 'active';
    this.activeClass3 = '';
    this.activeClass4 = '';
  }

  setActive3() {
    this.activeClass1 = '';
    this.activeClass2 = '';
    this.activeClass3 = 'active';
    this.activeClass4 = '';
  }

  setActive4() {
    this.activeClass1 = '';
    this.activeClass2 = '';
    this.activeClass3 = '';
    this.activeClass4 = 'active';
  }
}
