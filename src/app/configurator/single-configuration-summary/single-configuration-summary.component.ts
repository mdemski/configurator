import {Component, OnDestroy, OnInit} from '@angular/core';
import {SingleConfiguration} from '../../models/single-configuration';
import {Observable, Subject} from 'rxjs';
import {filter, map, skip, takeUntil} from 'rxjs/operators';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../../store/app/app.state';
import {ConfigurationState} from '../../store/configuration/configuration.state';
import {RouterState} from '@ngxs/router-plugin';
import {CartState} from '../../store/cart/cart.state';
import {Router} from '@angular/router';
import {PdfDataFormatterService} from '../../services/pdf-data-formatter.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import _ from 'lodash';
import {UpdateGlobalConfigurationInfoByConfigId} from '../../store/configuration/configuration.actions';
import {Address} from '../../models/address';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-single-configuration-summary',
  templateUrl: './single-configuration-summary.component.html',
  styleUrls: ['./single-configuration-summary.component.scss']
})
export class SingleConfigurationSummaryComponent implements OnInit, OnDestroy {

  @Select(AppState) user$: Observable<{ currentUser }>;
  @Select(RouterState) params$: Observable<any>;
  @Select(ConfigurationState.configurationByGlobalID) configurations$: Observable<SingleConfiguration[]>;
  @Select(CartState) cart$: Observable<any>;
  private routerParams;
  configuration$: Observable<SingleConfiguration>;
  currentUser;
  uneditable = true;
  loading;
  loadingForm;
  state;
  isDestroyed$ = new Subject();
  localizationForm: FormGroup;
  formHeight: any;

  constructor(private store: Store, public router: Router, private pdfFormatter: PdfDataFormatterService) {
    this.loading = true;
    this.configuration$ = this.store.select(ConfigurationState.configurationByGlobalID)
      .pipe(map(filterFn => filterFn(this.routerParams.state.params.configId)));
    this.params$.pipe(takeUntil(this.isDestroyed$)).subscribe(params => this.routerParams = params);
    this.state = this.routerParams.state;
    this.loadingForm = false;
  }

  ngOnInit() {
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
    this.loading = false;
    this.localizationForm = new FormGroup({
      email: new FormControl(null, [Validators.email]),
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      phoneNumber: new FormControl(null, [Validators.pattern('^\\+?[0-9]{3}-?[0-9]{6,12}$')]),
      street: new FormControl(null),
      localNumber: new FormControl(null),
      zipCode: new FormControl(null, [Validators.pattern('[0-9]{2}-[0-9]{3}')]),
      city: new FormControl(null),
      country: new FormControl(null),
      comments: new FormControl(null),
    });
    this.loadFormData();
  }

  builtNameForTranslation(prefix: string, option: string) {
    return String(prefix + option);
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
  }

  loadFormData() {
    this.configuration$.pipe(skip(1), takeUntil(this.isDestroyed$)).subscribe(config => {
      this.localizationForm.patchValue({email: config.emailToSend});
      this.localizationForm.patchValue({firstName: config.installationAddress.firstName});
      this.localizationForm.patchValue({lastName: config.installationAddress.lastName});
      this.localizationForm.patchValue({phoneNumber: config.installationAddress.phoneNumber});
      this.localizationForm.patchValue({street: config.installationAddress.street});
      this.localizationForm.patchValue({localNumber: config.installationAddress.localNumber});
      this.localizationForm.patchValue({zipCode: config.installationAddress.zipCode});
      this.localizationForm.patchValue({city: config.installationAddress.city});
      this.localizationForm.patchValue({country: config.installationAddress.country});
      this.localizationForm.patchValue({comments: config.comments});
    });
  }

  returnCurrencyName(currency: string) {
    if (currency === 'EUR') {
      return '€';
    } else {
      return 'zł';
    }
  }

  saveToPDF(configuration: SingleConfiguration) {
    const doc = this.pdfFormatter.getConfigurationDefinition(configuration);
    pdfMake.createPdf(doc).open();
  }

  onSubmit(configuration: SingleConfiguration) {
    this.loadingForm = true;
    const newConfiguration = _.cloneDeep(configuration);
    newConfiguration.installationAddress = new Address();
    const address = {
      firstName: this.localizationForm.value.firstName,
      lastName: this.localizationForm.value.lastName,
      phoneNumber: this.localizationForm.value.phoneNumber,
      street: this.localizationForm.value.street,
      localNumber: this.localizationForm.value.localNumber,
      zipCode: this.localizationForm.value.zipCode,
      city: this.localizationForm.value.city,
      country: this.localizationForm.value.country
    };
    newConfiguration.emailToSend = this.localizationForm.value.email;
    newConfiguration.installationAddress = address;
    newConfiguration.comments = this.localizationForm.value.comments;
    this.store.dispatch(new UpdateGlobalConfigurationInfoByConfigId(newConfiguration)).pipe(takeUntil(this.isDestroyed$)).subscribe(() => this.loadingForm = false);
  }
}
