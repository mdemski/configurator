import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {UserState} from '../../store/user/user.state';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {UpdateCartCurrency, UpdateCartVatRate} from '../../store/cart/cart.actions';
import {AuthService} from '../../services/auth.service';
import {filter, map, take, takeUntil} from 'rxjs/operators';
import {CartState} from '../../store/cart/cart.state';
import exchange from '../../../assets/json/echange.json';
import vatRates from '../../../assets/json/vatRates.json';
import {DatabaseService} from '../../services/database.service';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Invoice} from '../../models/invoice';
import _ from 'lodash';
import moment from 'moment';
import {CrudService} from '../../services/crud-service';
import {Address} from '../../models/address';
import {UpdateUserData} from '../../store/user/user.actions';
import {Company} from '../../models/company';
import { Chart } from 'chart.js';
import {MdTranslateService} from '../../services/md-translate.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('pieCanvas') private pieCanvas: ElementRef;
  @Select(UserState) user$: Observable<any>;
  @Select(CartState) cart$: Observable<any>;
  company$ = new BehaviorSubject<Company>(null);
  updateUserForm: FormGroup;
  updateCompanyForm: FormGroup;
  currency$ = new BehaviorSubject('PLN');
  vatRate$ = new BehaviorSubject(0.23);
  isDestroyed$ = new Subject();
  loading = true;
  isUpdating = false;
  isUpdatingCompany = false;
  currencies: string[] = [];
  rates: number[] = [];
  pieChart: any;
  countries$ = new BehaviorSubject(null);
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
  languages;
  private filtersObject = {
    invoiceNumberSearch: '',
    dateSearch: '',
    deliveryDateSearch: '',
    netPriceSearch: '',
    vatSearch: '',
    grossPriceSearch: '',
    statusSearch: ''
  };

  constructor(private translate: MdTranslateService,
              private fb: FormBuilder,
              private authService: AuthService,
              private store: Store,
              private crud: CrudService,
              private db: DatabaseService, public router: Router) {
    // TODO poprawić na dane z api eNova
    this.testCompany = this.db.getAllSellers()[0];
    this.company$.next(this.testCompany);
    this.invoices = this.db.getAllSellers()[0].invoices;
    this.languages = this.translate.getLanguages();
    this.currencies = Object.keys(exchange);
    this.rates = Object.values(vatRates);
    translate.setLanguage();
    this.translate.get('MY-PROFILE').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      for (const label of this.labels) {
        this.translatedLabels.push(text[label]);
      }
    });
    this.crud.getCountryList().pipe(takeUntil(this.isDestroyed$)).subscribe(countries => this.countries$.next(countries));
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
    this.updateUserForm = this.fb.group({
      id: new FormControl(null),
      email: new FormControl(null, [Validators.required, Validators.email], [this.emailExists.bind(this)]),
      name: new FormControl(null),
      preferredLanguage: new FormControl(null),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      street: new FormControl(null, Validators.required),
      localNumber: new FormControl(null),
      zipCode: new FormControl(null, [Validators.pattern('[0-9]{2}-[0-9]{3}'), Validators.required]),
      city: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
      phoneNumber: new FormControl(null, [Validators.pattern('^\\+?[0-9]{3}-?[0-9]{6,12}$')]),
      addressId: new FormControl(null)
    });
    this.user$.pipe(takeUntil(this.isDestroyed$), filter(user => user.email !== '')).subscribe(userData => {
      this.updateUserForm.patchValue({
        id: userData._id,
        email: userData.email,
        name: userData.name,
        preferredLanguage: userData.preferredLanguage,
        firstName: userData.address.firstName,
        lastName: userData.address.lastName,
        street: userData.address.street,
        localNumber: userData.address.localNumber,
        zipCode: userData.address.zipCode,
        city: userData.address.city,
        country: userData.address.country,
        phoneNumber: userData.address.phoneNumber,
        addressId: userData.address._id
      }, {emitEvent: false});
    });
    this.updateCompanyForm = this.fb.group({
      companyCode: new FormControl(null),
      companyEmail: new FormControl(null, [Validators.required, Validators.email], [this.emailExists.bind(this)]),
      companyName: new FormControl(null),
      nip: new FormControl(null),
      companyFirstName: new FormControl(null, Validators.required),
      companyLastName: new FormControl(null, Validators.required),
      companyStreet: new FormControl(null, Validators.required),
      companyLocalNumber: new FormControl(null),
      companyZipCode: new FormControl(null, [Validators.pattern('[0-9]{2}-[0-9]{3}'), Validators.required]),
      companyCity: new FormControl(null, Validators.required),
      companyCountry: new FormControl(null, Validators.required),
      companyPhoneNumber: new FormControl(null, [Validators.pattern('^\\+?[0-9]{3}-?[0-9]{6,12}$')])
    });
    this.company$.pipe(takeUntil(this.isDestroyed$)).subscribe(companyData => {
      this.updateCompanyForm.patchValue({
        companyCode: companyData.companyCode,
        companyEmail: companyData.email,
        companyName: companyData.name,
        nip: companyData.nip,
        companyFirstName: companyData.address.firstName,
        companyLastName: companyData.address.lastName,
        companyStreet: companyData.address.street,
        companyLocalNumber: companyData.address.localNumber,
        companyZipCode: companyData.address.zipCode,
        companyCity: companyData.address.city,
        companyCountry: companyData.address.country,
        companyPhoneNumber: companyData.address.phoneNumber
      }, {emitEvent: false});
    });
    this.filteredInvoices = this.invoices;
    this.loading = false;
  }

  ngAfterViewInit() {
    this.pieChartBrowser();
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
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

  onSubmit() {
    this.isUpdating = true;
    const updatedAddress = new Address(
      this.updateUserForm.value.firstName, this.updateUserForm.value.lastName, this.updateUserForm.value.phoneNumber, this.updateUserForm.value.street,
      this.updateUserForm.value.localNumber, this.updateUserForm.value.zipCode, this.updateUserForm.value.city , this.updateUserForm.value.country);
    this.crud.updateAddress(updatedAddress, this.updateUserForm.value.addressId).pipe().subscribe(() => console.log('Address updated successfully'));
    this.user$.pipe(takeUntil(this.isDestroyed$), take(1)).subscribe(user => {
      const updatedUser = _.cloneDeep(user);
      updatedUser.email = this.updateUserForm.value.email;
      updatedUser.name = this.updateUserForm.value.name;
      updatedUser.preferredLanguage = this.updateUserForm.value.preferredLanguage;
      this.store.dispatch(new UpdateUserData(updatedUser));
      this.isUpdating = false;
    });
  }

  onSubmitCompany() {
    this.isUpdatingCompany = true;
    this.company$.pipe(takeUntil(this.isDestroyed$), take(1)).subscribe(company => {
      const updatedCompany = _.cloneDeep(company);
      updatedCompany.email = this.updateCompanyForm.value.email;
      updatedCompany.address.firstName = this.updateCompanyForm.value.firstName;
      updatedCompany.address.lastName = this.updateCompanyForm.value.lastName;
      updatedCompany.address.phoneNumber = this.updateCompanyForm.value.phoneNumber;
      updatedCompany.address.street = this.updateCompanyForm.value.companyStreet;
      updatedCompany.address.localNumber = this.updateCompanyForm.value.companyLocalNumber;
      updatedCompany.address.zipCode = this.updateCompanyForm.value.companyZipCode;
      updatedCompany.address.city = this.updateCompanyForm.value.companyCity;
      updatedCompany.address.country = this.updateCompanyForm.value.companyCountry;
      this.crud.updateCompany(updatedCompany).pipe(takeUntil(this.isDestroyed$)).subscribe(() => {
        this.isUpdatingCompany = false;
      });
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

  emailExists<AsyncValidator>(control: FormControl): Observable<ValidationErrors | null> {
    const value = control.value;

    return this.user$.pipe(takeUntil(this.isDestroyed$),
      map(user => {
        if (user.email === value) {
          return null;
        } else {
          this.crud.readUserByEmail(value)
            .pipe(takeUntil(this.isDestroyed$),
              map(newUser => {
                return newUser ? {
                  emailExists: true
                } : null;
              }));
        }
      }));
  }
}
