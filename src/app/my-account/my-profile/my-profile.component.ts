import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {UserState} from '../../store/user/user.state';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {User} from '../../models/user';
import {UpdateCartCurrency, UpdateCartVatRate} from '../../store/cart/cart.actions';
import {AuthService} from '../../services/auth.service';
import {filter, map, takeUntil} from 'rxjs/operators';
import {CartState} from '../../store/cart/cart.state';
import exchange from '../../../assets/json/echange.json';
import vatRates from '../../../assets/json/vatRates.json';
import {DatabaseService} from '../../services/database.service';
import Chart from 'chart.js';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Invoice} from '../../models/invoice';
import _ from 'lodash';
import moment from 'moment';

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
  filteredInvoices: Invoice[] = [];
  invoices: Invoice[] = [];
  labels = ['roofWindows', 'skylights', 'accessories', 'flashings', 'flatRoofWindows', 'verticalWindows'];
  translatedLabels = [];
  filtrationForm: FormGroup;
  numberToggler = true;
  dateToggler = true;
  deliveryDateToggler = true;
  netPriceToggler = true;
  vatToggler = true;
  grossPriceToggler = true;
  statusToggler = true;
  correctingInvoiceToggler = true;
  private filtersObject = {
    invoiceNumberSearch: '',
    dateSearch: '',
    deliveryDateSearch: '',
    netPriceSearch: '',
    vatSearch: '',
    grossPriceSearch: '',
    statusSearch: ''
  };

  constructor(public translate: TranslateService,
              private fb: FormBuilder,
              private authService: AuthService,
              private store: Store,
              private db: DatabaseService) {
    this.testCompany = this.db.getAllSellers()[0];
    this.invoices = this.db.getAllSellers()[0].invoices;
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
    this.filtrationForm = this.fb.group({
      invoiceNumberSearch: new FormControl(null),
      dateSearch: new FormControl(null),
      deliveryDateSearch: new FormControl(null),
      netPriceSearch: new FormControl(null),
      vatSearch: new FormControl(null),
      grossPriceSearch: new FormControl(null),
      statusSearch: new FormControl(null)
    });
    this.filtrationForm.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      map(data => {
        this.filtersObject.invoiceNumberSearch = data.invoiceNumberSearch;
        this.filtersObject.dateSearch = data.dateSearch;
        this.filtersObject.deliveryDateSearch = data.deliveryDateSearch;
        this.filtersObject.netPriceSearch = data.netPriceSearch;
        this.filtersObject.vatSearch = data.vatSearch;
        this.filtersObject.grossPriceSearch = data.grossPriceSearch;
        this.filtersObject.statusSearch = data.statusSearch;
      })).subscribe(() => {
      this.filterTable(this.filtersObject);
    });
    this.testCompany.invoices = this.invoices;
    this.filteredInvoices = this.invoices;
    console.log(this.invoices);
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

  // tslint:disable-next-line:max-line-length
  private filterTable(filtersObject: { invoiceNumberSearch: string; statusSearch: string; netPriceSearch: string; deliveryDateSearch: string; dateSearch: string; grossPriceSearch: string; vatSearch: string }) {
    this.filteredInvoices = this.invoices;
    this.filteredInvoices = this.filteredInvoices.filter(invoice => {
      let invoiceNumberFound = true;
      let dateFound = true;
      let deliveryDateFound = true;
      let netPriceFound = true;
      let vatFound = true;
      let grossPriceFound = true;
      let statusFound = true;
      if (filtersObject.invoiceNumberSearch) {
        invoiceNumberFound = invoice.fvNumber.toString().trim().toLowerCase().indexOf(filtersObject.invoiceNumberSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.dateSearch) {
        const firstDateToCompare = new Date(invoice.createdAt);
        const secondDateToCompare = new Date(filtersObject.dateSearch);
        dateFound = moment(firstDateToCompare).isSame(secondDateToCompare, 'day');
      }
      if (filtersObject.deliveryDateSearch) {
        const firstDateToCompare = new Date(invoice.deliveryDate);
        const secondDateToCompare = new Date(filtersObject.deliveryDateSearch);
        deliveryDateFound = moment(firstDateToCompare).isSame(secondDateToCompare, 'day');
      }
      if (filtersObject.netPriceSearch) {
        netPriceFound = invoice.totalNetValue.toString().trim().toLowerCase().indexOf(filtersObject.netPriceSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.vatSearch) {
        vatFound = invoice.vat.toString().trim().toLowerCase().indexOf(filtersObject.vatSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.grossPriceSearch) {
        grossPriceFound = invoice.grossAmount.toString().trim().toLowerCase().indexOf(filtersObject.grossPriceSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.statusSearch) {
        statusFound = invoice.isPaid.toString().trim().toLowerCase().indexOf(filtersObject.statusSearch.toLowerCase()) !== -1;
      }
      return invoiceNumberFound && dateFound && deliveryDateFound && netPriceFound && vatFound && grossPriceFound && statusFound;
    });
  }

  sortByERPNumber() {
    this.numberToggler = !this.numberToggler;
    const order = this.numberToggler ? 'asc' : 'desc';
    this.filteredInvoices = _.orderBy(this.filteredInvoices, ['fvNumber'], order);
  }

  sortByRegistrationDate() {
    this.dateToggler = !this.dateToggler;
    const order = this.dateToggler ? 'asc' : 'desc';
    this.filteredInvoices = _.orderBy(this.filteredInvoices, ['createdAt'], order);
  }

  sortByDeliveryDate() {
    this.deliveryDateToggler = !this.deliveryDateToggler;
    const order = this.deliveryDateToggler ? 'asc' : 'desc';
    this.filteredInvoices = _.orderBy(this.filteredInvoices, ['deliveryDate'], order);
  }

  sortByNetPrice() {
    this.netPriceToggler = !this.netPriceToggler;
    const order = this.netPriceToggler ? 'asc' : 'desc';
    this.filteredInvoices = _.orderBy(this.filteredInvoices, ['totalNetValue'], order);
  }

  sortByVAT() {
    this.vatToggler = !this.vatToggler;
    const order = this.vatToggler ? 'asc' : 'desc';
    this.filteredInvoices = _.orderBy(this.filteredInvoices, ['vat'], order);
  }

  sortByGrossPrice() {
    this.grossPriceToggler = !this.grossPriceToggler;
    const order = this.grossPriceToggler ? 'asc' : 'desc';
    this.filteredInvoices = _.orderBy(this.filteredInvoices, ['grossAmount'], order);
  }

  sortByStatus() {
    this.statusToggler = !this.statusToggler;
    const order = this.statusToggler ? 'asc' : 'desc';
    this.filteredInvoices = _.orderBy(this.filteredInvoices, ['isPaid'], order);
  }

  sortByCorrectingInvoice() {
    this.correctingInvoiceToggler = !this.correctingInvoiceToggler;
    const order = this.correctingInvoiceToggler ? 'asc' : 'desc';
    this.filteredInvoices = _.orderBy(this.filteredInvoices, ['correctionReason'], order);
  }
}
