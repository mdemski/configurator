import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {UserState} from '../../store/user/user.state';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {User} from '../../models/user';
import {UpdateCartCurrency, UpdateCartVatRate} from '../../store/cart/cart.actions';
import {AuthService} from '../../services/auth.service';
import {filter, takeUntil} from 'rxjs/operators';
import {CartState} from '../../store/cart/cart.state';
import exchange from '../../../assets/json/echange.json';
import vatRates from '../../../assets/json/vatRates.json';
import {DatabaseService} from '../../services/database.service';
import Chart from 'chart.js';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('pieCanvas') private pieCanvas: ElementRef;
  @Select(UserState) user$: Observable<User>;
  @Select(CartState) cart$: Observable<any>;
  currency$ = new BehaviorSubject('PLN');
  vatRate$ = new BehaviorSubject(0.23);
  isDestroyed$ = new Subject();
  loading = true;
  currencies: string[] = [];
  rates: number[] = [];
  pieChart: any;
  testCompany;
  labels = ['roofWindows', 'skylights', 'accessories', 'flashings', 'flatRoofWindows', 'verticalWindows'];
  translatedLabels = [];

  constructor(public translate: TranslateService,
              private authService: AuthService,
              private store: Store,
              private db: DatabaseService) {
    this.testCompany = this.db.getAllSellers()[0];
    this.currencies = Object.keys(exchange);
    this.rates = Object.values(vatRates);
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
    this.translate.get('MY-PROFILE').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      for (const label of this.labels) {
        this.translatedLabels.push(text[label]);
      }
    });
  }

  ngOnInit(): void {
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe((data) => {
      this.currency$.next(data.cart.currency);
      this.vatRate$.next(data.cart.vatRate);
      this.loading = false;
    });
    this.loading = false;
  }

  ngAfterViewInit() {
    this.pieChartBrowser();
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }

  pieChartBrowser() {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.translatedLabels,
        datasets: [{
          label: 'Sales doughnut',
          data: [this.testCompany.roofWindowsSalesVolume,
            this.testCompany.skylightsSalesVolume,
            this.testCompany.accessoriesSalesVolume,
            this.testCompany.flashingsSalesVolume,
            this.testCompany.flatRoofWindowsSalesVolume,
            this.testCompany.verticalWindowsSalesVolume],
          backgroundColor: [
            'rgb(252, 3, 3)',
            'rgb(252, 186, 3)',
            'rgb(3, 140, 252)',
            'rgb(137, 141, 145)',
            'rgb(21, 230, 209)',
            'rgb(0, 229, 255)'
          ],
        }]
      }
    });
  }

  updateCurrency(updatedCurrency) {
    this.store.dispatch(new UpdateCartCurrency(updatedCurrency));
  }

  updateVATRate(rateOption: number) {
    this.store.dispatch(new UpdateCartVatRate(rateOption));
  }

  logout() {
    this.authService.logout();
  }

}
