import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Select, Store} from '@ngxs/store';
import {CartState} from '../store/cart/cart.state';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import exchange from '../../assets/json/echange.json';
import {UpdateCartCurrency} from '../store/cart/cart.actions';
import {AppState} from '../store/app/app.state';
import {ConfigurationState} from '../store/configuration/configuration.state';
import {CrudService} from '../services/crud-service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit, OnDestroy {

  @Select(CartState) cart$: Observable<any>;
  @Select(AppState) user$: Observable<{ currentUser }>;
  @Select(ConfigurationState) userConfigurations$;

  currency$ = new BehaviorSubject('PLN');
  currencies: string[] = [];
  isDestroyed$ = new Subject();
  loading = true;
  updatedCurrency: string;
  activeTab: string;
  activeOrders = true;
  activeConfigurations = false;
  activeTasks = false;
  activeNews = false;
  activeComplaints = false;
  currentUser: {email: string, userName: string, isLogged: boolean};

  constructor(private authService: AuthService,
              private store: Store) {
    this.currencies = Object.keys(exchange);
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.currentUser = user.currentUser);
  }

  ngOnInit(): void {
    // this.store.dispatch()
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe((data) => {
      this.currency$.next(data.cart.currency);
      this.loading = false;
    });
  }
  /* tslint:disable: template-no-call-expression */
  // /* tslint:disable:template-use-track-by-function */
  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }

  logout() {
    this.authService.logout();
  }

  updateCurrency(updatedCurrency) {
    this.store.dispatch(new UpdateCartCurrency(updatedCurrency));
  }

  selectTab() {
    if (this.activeTab === 'activeOrders') {
      this.activeOrders = true;
      this.activeConfigurations = false;
      this.activeTasks = false;
      this.activeNews = false;
      this.activeComplaints = false;
    }
    if (this.activeTab === 'activeConfigurations') {
      this.activeOrders = false;
      this.activeConfigurations = true;
      this.activeTasks = false;
      this.activeNews = false;
      this.activeComplaints = false;
    }
    if (this.activeTab === 'activeTasks') {
      this.activeOrders = false;
      this.activeConfigurations = false;
      this.activeTasks = true;
      this.activeNews = false;
      this.activeComplaints = false;
    }
    if (this.activeTab === 'activeNews') {
      this.activeOrders = false;
      this.activeConfigurations = false;
      this.activeTasks = false;
      this.activeNews = true;
      this.activeComplaints = false;
    }
    if (this.activeTab === 'activeComplaints') {
      this.activeOrders = false;
      this.activeConfigurations = false;
      this.activeTasks = false;
      this.activeNews = false;
      this.activeComplaints = true;
    }
  }
}
