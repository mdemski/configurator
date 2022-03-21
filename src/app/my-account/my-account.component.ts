import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Select, Store} from '@ngxs/store';
import {CartState} from '../store/cart/cart.state';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import exchange from '../../assets/json/echange.json';
import vatRates from '../../assets/json/vatRates.json';
import {UpdateCartCurrency, UpdateCartVatRate} from '../store/cart/cart.actions';
import {AppState} from '../store/app/app.state';
import {ConfigurationState} from '../store/configuration/configuration.state';
import {ComplaintState} from '../store/complaint/complaint.state';
import {Complaint} from '../models/complaint';
import {Order} from '../models/order';
import {OrderService} from '../services/order.service';
import {UserState} from '../store/user/user.state';
import {Task} from '../models/task';
import {TaskService} from '../services/task.service';
import {SingleConfiguration} from '../models/single-configuration';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit, OnDestroy {

  @Select(CartState) cart$: Observable<any>;
  @Select(AppState) currentUser$: Observable<{ currentUser }>;
  @Select(UserState) user$: Observable<any>;
  @Select(ConfigurationState) userConfigurations$: Observable<SingleConfiguration[]>;
  @Select(ComplaintState) userComplaints$: Observable<Complaint[]>;

  currency$ = new BehaviorSubject('PLN');
  vatRate$ = new BehaviorSubject(0.23);
  userOrders$: Observable<Order[]>;
  userTask$: Observable<Task[]>;
  currencies: string[] = [];
  rates: number[] = [];
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
              private store: Store,
              private taskService: TaskService,
              private orderService: OrderService) {
    this.currencies = Object.keys(exchange);
    this.rates = Object.values(vatRates);
    this.currentUser$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.currentUser = user.currentUser);
    this.userOrders$ = this.orderService.getUserOrders().pipe(takeUntil(this.isDestroyed$));
    this.userTask$ = this.taskService.getUserTasks().pipe(takeUntil(this.isDestroyed$), map((tasks: Task[]) => tasks.filter(task => task.status  === 'Aktywne')));
  }

  ngOnInit(): void {
    // this.store.dispatch()
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe((data) => {
      this.currency$.next(data.cart.currency);
      this.vatRate$.next(data.cart.vatRate);
      this.loading = false;
    });
  }
  // tslint:disable-next-line:component-selector
  // /* tslint:disable:template-use-track-by-function */
  /* tslint:disable: template-no-call-expression */
  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
  }

  logout() {
    this.authService.logout();
  }

  updateCurrency(updatedCurrency) {
    this.store.dispatch(new UpdateCartCurrency(updatedCurrency));
  }

  updateVATRate(rateOption: number) {
    this.store.dispatch(new UpdateCartVatRate(rateOption));
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
