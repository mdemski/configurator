import {AfterContentChecked, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Select, Store} from '@ngxs/store';
import {CartState} from '../store/cart/cart.state';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter, map, take, takeUntil} from 'rxjs/operators';
import exchange from '../../assets/json/echange.json';
import vatRates from '../../assets/json/vatRates.json';
import {AddProductToCart, UpdateCartCurrency, UpdateCartVatRate} from '../store/cart/cart.actions';
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
import {DatabaseService} from '../services/database.service';
import {User} from '../models/user';
import {CrudService} from '../services/crud-service';
// import Swiper core and required components
import SwiperCore, {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  SwiperOptions,
  Thumbs,
  Virtual,
  Zoom,
  Controller
} from 'swiper';
import {SwiperComponent} from 'swiper/angular';
import {AddFavoriteProductsForUser, RemoveFavoriteProductsForUser} from '../store/user/user.actions';
// install Swiper components
SwiperCore.use([ Navigation, Pagination, Scrollbar, A11y, Virtual, Zoom, Autoplay, Controller, Thumbs]);

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyAccountComponent implements OnInit, OnDestroy, AfterContentChecked {

  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  config: SwiperOptions = {
    slidesPerView: 8,
    spaceBetween: 30,
    loopedSlides: 7,
    breakpoints: {
      1400: {
        slidesPerView: 6,
        spaceBetween: 30,
      },
      1028: {
        slidesPerView: 5,
        spaceBetween: 30,
      },
      720: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      480: {
        slidesPerView: 1,
        spaceBetween: 10,
      }
    },
    pagination: { type: 'fraction' },
    navigation: true
  };

  @Select(CartState) cart$: Observable<any>;
  @Select(AppState) currentUser$: Observable<{ currentUser }>;
  @Select(UserState) user$: Observable<any>;
  @Select(ConfigurationState) userConfigurations$: Observable<SingleConfiguration[]>;
  @Select(ComplaintState) userComplaints$: Observable<Complaint[]>;

  currency$ = new BehaviorSubject('PLN');
  vatRate$ = new BehaviorSubject(0.23);
  userOrders$: Observable<Order[]>;
  userTask$: Observable<Task[]>;
  user: User;
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
  showDiscount = false;

  constructor(private authService: AuthService,
              private store: Store,
              private taskService: TaskService,
              private orderService: OrderService,
              private db: DatabaseService,
              private crud: CrudService) {
    this.currencies = Object.keys(exchange);
    this.rates = Object.values(vatRates);
    this.currentUser$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.currentUser = user.currentUser);
    this.userOrders$ = this.orderService.getUserOrders().pipe(takeUntil(this.isDestroyed$));
    this.userTask$ = this.taskService.getUserTasks().pipe(takeUntil(this.isDestroyed$), map((tasks: Task[]) => tasks.filter(task => task.status  === 'Aktywne')));
  }

  ngOnInit(): void {
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe((data) => {
      this.currency$.next(data.cart.currency);
      this.vatRate$.next(data.cart.vatRate);
      this.loading = false;
    });
    this.user$.pipe(takeUntil(this.isDestroyed$)).pipe(take(2)).subscribe(user => {
      this.store.dispatch(new RemoveFavoriteProductsForUser(user, this.db.getAllRoofWindowsToShopList()[1]));
    });
  }
  // tslint:disable-next-line:component-selector
  // /* tslint:disable:template-use-track-by-function */
  /* tslint:disable: template-no-call-expression */
  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
  }

  ngAfterContentChecked(): void {
    // if (this.swiper) {
    //   this.swiper.updateSwiper({});
    // }
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

  addToCart(product: any) {
    this.store.dispatch(new AddProductToCart(product, 1)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
  }

  returnCurrencyName(currency: string) {
    if (currency === 'EUR') {
      return '€';
    } else {
      return 'zł';
    }
  }
}
