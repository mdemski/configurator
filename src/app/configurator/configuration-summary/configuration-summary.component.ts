import {Component, OnDestroy, OnInit} from '@angular/core';
import {from, Observable, Subject} from 'rxjs';
import {SingleConfiguration} from '../../models/single-configuration';
import {concatMap, filter, map, skip, takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {WindowConfig} from '../../models/window-config';
import {FlashingConfig} from '../../models/flashing-config';
import {Select, Store} from '@ngxs/store';
import {
  DeleteAccessoryConfigurationByConfigAndAccessoryId,
  DeleteFlashingConfigurationByConfigAndFlashingId, DeleteFlatRoofConfigurationByConfigAndFlatId,
  DeleteGlobalConfiguration,
  DeleteRoofWindowConfigurationByConfigAndWindowId,
  UpdateAccessoryQuantityByConfigAndAccessoryId,
  UpdateFlashingQuantityByConfigAndFlashingId, UpdateGlobalConfigurationInfoByConfigId,
  UpdateGlobalConfigurationNameByConfigId,
  UpdateRoofWindowQuantityByConfigAndWindowId
} from '../../store/configuration/configuration.actions';
import {AppState} from '../../store/app/app.state';
import {ConfigurationState} from '../../store/configuration/configuration.state';
import {SetChosenFlashing} from '../../store/flashing/flashing.actions';
import {SetChosenRoofWindow} from '../../store/roof-window/roof-window.actions';
import {AddProductToCart} from '../../store/cart/cart.actions';
import {CartState} from '../../store/cart/cart.state';
import {MdTranslateService} from '../../services/md-translate.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Address} from '../../models/address';
import _ from 'lodash';

@Component({
  selector: 'app-configuration-summary',
  templateUrl: './configuration-summary.component.html',
  styleUrls: ['./configuration-summary.component.scss']
})
export class ConfigurationSummaryComponent implements OnInit, OnDestroy {

  @Select(AppState) user$: Observable<{ currentUser }>;
  @Select(CartState) cart$: Observable<any>;
  // @Select(ConfigurationState.userConfigurations) userConfigurations$: Observable<any>;

  currentUser;
  userConfigurations: SingleConfiguration[];
  uneditable = true;
  loading;
  chooseWindowPopup = false;
  chooseFlashingPopup = false;
  isDestroyed$ = new Subject();
  windowId: number;
  flashingId: number;
  windowConfigs: WindowConfig[];
  flashingConfigs: FlashingConfig[];
  chosenConfig: SingleConfiguration;
  emptyWindowConfiguration: string;
  emptyFlatWindowConfiguration: string;
  emptyFlashingConfiguration: string;
  emptyAccessoryConfiguration: string;
  addingProduct: string;
  userConfigurations$;
  localizationForm: FormGroup;
  loadingForm;

  constructor(public router: Router,
              private store: Store,
              private translate: MdTranslateService) {
    this.loading = true;
    translate.setLanguage();
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.currentUser = user.currentUser.email);
    this.userConfigurations$ = this.store.select(ConfigurationState.userConfigurations).pipe(
      takeUntil(this.isDestroyed$),
      map(filterFn => filterFn(this.currentUser)),
      filter(configurations => configurations.length > 0));
  }

  ngOnInit() {
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
    this.localizationForm = new FormGroup({});
    this.loadFormData();
    this.loading = false;
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.emptyFlashingConfiguration = text.configuratorFlashing;
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.emptyAccessoryConfiguration = text.configuratorAccessory;
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.emptyWindowConfiguration = text.configuratorRoofWindow;
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.emptyFlatWindowConfiguration = text.configuratorFlatRoofWindow;
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
  }

  loadFormData() {
    this.userConfigurations$.pipe(takeUntil(this.isDestroyed$)).subscribe(userConfigurations => {
      if (userConfigurations.length === 0) {
        this.localizationForm.addControl('email' + 0, new FormControl(null, [Validators.email]));
        this.localizationForm.addControl('firstName' + 0, new FormControl(null));
        this.localizationForm.addControl('lastName' + 0, new FormControl(null));
        this.localizationForm.addControl('phoneNumber' + 0, new FormControl(null, [Validators.pattern('^\\+?[0-9]{3}-?[0-9]{6,12}$')]));
        this.localizationForm.addControl('street' + 0, new FormControl(null));
        this.localizationForm.addControl('localNumber' + 0, new FormControl(null));
        this.localizationForm.addControl('zipCode' + 0, new FormControl(null, [Validators.pattern('[0-9]{2}-[0-9]{3}')]));
        this.localizationForm.addControl('city' + 0, new FormControl(null));
        this.localizationForm.addControl('country' + 0, new FormControl(null));
        this.localizationForm.addControl('comments' + 0, new FormControl(null));
      } else {
        userConfigurations.forEach((config, index) => {
          this.localizationForm.addControl('email' + index, new FormControl(config.emailToSend, [Validators.email]));
          this.localizationForm.addControl('firstName' + index, new FormControl(config.installationAddress.firstName));
          this.localizationForm.addControl('lastName' + index, new FormControl(config.installationAddress.lastName));
          this.localizationForm.addControl('phoneNumber' + index, new FormControl(config.installationAddress.phoneNumber, [Validators.pattern('^\\+?[0-9]{3}-?[0-9]{6,12}$')]));
          this.localizationForm.addControl('street' + index, new FormControl(config.installationAddress.street));
          this.localizationForm.addControl('localNumber' + index, new FormControl(config.installationAddress.localNumber));
          this.localizationForm.addControl('zipCode' + index, new FormControl(config.installationAddress.zipCode, [Validators.pattern('[0-9]{2}-[0-9]{3}')]));
          this.localizationForm.addControl('city' + index, new FormControl(config.installationAddress.city));
          this.localizationForm.addControl('country' + index, new FormControl(config.installationAddress.country));
          this.localizationForm.addControl('comments' + index, new FormControl(config.comments));
        });
      }
    });
  }

  resize(delta: number, quantity: number, globalConfiguration: SingleConfiguration, product, productId) {
    if (product.window !== undefined) {
      const updatedQuantity = product.quantity + delta;
      this.store.dispatch(new UpdateRoofWindowQuantityByConfigAndWindowId(globalConfiguration, productId, updatedQuantity)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
    }
    if (product.flashing !== undefined) {
      const updatedQuantity = product.quantity + delta;
      this.store.dispatch(new UpdateFlashingQuantityByConfigAndFlashingId(globalConfiguration, productId, updatedQuantity)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
    }
    if (product.accessory !== undefined) {
      const updatedQuantity = product.quantity + delta;
      this.store.dispatch(new UpdateAccessoryQuantityByConfigAndAccessoryId(globalConfiguration, productId, updatedQuantity)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
    }
  }

  decreaseQuantity(globalConfiguration: SingleConfiguration, product,
                   productId: number, quantity: number) {
    if (quantity === 0) {
      quantity = 0;
    }
    this.resize(-1, quantity, globalConfiguration, product, productId);
  }

  increaseQuantity(globalConfiguration: SingleConfiguration, product,
                   productId: number, quantity: number) {
    this.resize(1, quantity, globalConfiguration, product, productId);
  }

  configurationNameEdit() {
    if (this.uneditable === null) {
      this.uneditable = true;
    } else {
      this.uneditable = null;
    }
  }

  configurationNameSave(mongoId: string, newConfigName: HTMLInputElement) {
    this.store.dispatch(new UpdateGlobalConfigurationNameByConfigId(mongoId, newConfigName.value)).pipe(takeUntil(this.isDestroyed$)).subscribe(() => console.log('Nazwa została zmieniona'));
    if (this.uneditable === null) {
      this.uneditable = true;
    } else {
      this.uneditable = null;
    }
  }

  removeProductConfiguration(globalConfiguration: SingleConfiguration, productId: number, product) {
    if (product.flat !== undefined) {
      this.store.dispatch(new DeleteFlatRoofConfigurationByConfigAndFlatId(globalConfiguration, productId)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
    }
    if (product.window !== undefined) {
      this.store.dispatch(new DeleteRoofWindowConfigurationByConfigAndWindowId(globalConfiguration, productId)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
    }
    if (product.flashing !== undefined) {
      this.store.dispatch(new DeleteFlashingConfigurationByConfigAndFlashingId(globalConfiguration, productId)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
    }
    if (product.accessory !== undefined) {
      this.store.dispatch(new DeleteAccessoryConfigurationByConfigAndAccessoryId(globalConfiguration, productId)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
    }
  }

  removeHoleConfiguration(globalConfiguration: SingleConfiguration) {
    this.store.dispatch(new DeleteGlobalConfiguration(globalConfiguration)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
  }

  addToCart(product, quantity) {
    this.store.dispatch(new AddProductToCart(product, quantity)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
  }

  addHoleConfigurationToCart(configuration: SingleConfiguration) {
    const productsToCart: {
      product: any,
      quantity: number
    }[] = [];
    if (configuration.products.windows) {
      for (const window of configuration.products.windows) {
        productsToCart.push({
          product: window.window,
          quantity: window.quantity
        });
        // this.store.dispatch(new AddProductToCart(window.window, window.quantity)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      }
    }
    if (configuration.products.flashings) {
      for (const flashing of configuration.products.flashings) {
        productsToCart.push({
          product: flashing.flashing,
          quantity: flashing.quantity
        });
        // this.store.dispatch(new AddProductToCart(flashing.flashing, flashing.quantity)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      }
    }
    if (configuration.products.accessories) {
      for (const accessory of configuration.products.accessories) {
        productsToCart.push({
          product: accessory.accessory,
          quantity: accessory.quantity
        });
        // this.store.dispatch(new AddProductToCart(accessory.accessory, accessory.quantity)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      }
    }
    if (configuration.products.flats) {
      for (const flat of configuration.products.flats) {
        productsToCart.push({
          product: flat.flat,
          quantity: flat.quantity
        });
        // this.store.dispatch(new AddProductToCart(flat.flat, flat.quantity)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      }
    }
    if (configuration.products.verticals) {
      for (const vertical of configuration.products.verticals) {
        productsToCart.push({
          product: vertical.vertical,
          quantity: vertical.quantity
        });
        // this.store.dispatch(new AddProductToCart(vertical.vertical, vertical.quantity)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      }
    }
    from(productsToCart).pipe(
      takeUntil(this.isDestroyed$),
      concatMap((data: { product: any, quantity: number }) =>
        this.store.dispatch(new AddProductToCart(data.product, data.quantity)))).subscribe(console.log);
  }

  // Options toggle
  onHoverClick($event: MouseEvent) {
    // @ts-ignore
    const divsTable = $event.target.parentElement.parentElement.parentElement.parentElement;
    this.eventMoving(divsTable, '126.3px', '875px');
  }

  onHover2Click($event: MouseEvent) {
    // @ts-ignore
    const divsTable = $event.target.parentElement.parentElement;
    this.eventMoving(divsTable, '65px', '595px');
  }

  eventMoving(divsTable: any, rolledUp: string, spreadOut: string) {
    if (divsTable.style.maxHeight === rolledUp || divsTable.style.maxHeight === '') {
      divsTable.style.maxHeight = spreadOut;
      divsTable.style.transition = 'all .7s ease-in-out';
    } else {
      divsTable.style.maxHeight = rolledUp;
      divsTable.style.transition = 'all .7s ease-in-out';
    }
  }

  addNewFlashingOrAccessory(configuration: SingleConfiguration, product: string) {
    this.chosenConfig = configuration;
    this.addingProduct = product;
    this.windowConfigs = Object.assign([], configuration.products.windows);
    this.windowConfigs.push({
      window: null,
      id: -1,
      windowFormName: null,
      windowFormData: null,
      quantity: 0,
      configLink: ''
    });
    if (configuration.products.windows.length === 1) {
      this.store.select(ConfigurationState.roofWindowConfigurationByIdByGlobalId).pipe(
        takeUntil(this.isDestroyed$),
        map(filterFn => filterFn(configuration.globalId, configuration.products.windows[0].id))).subscribe(roofWindow => this.store.dispatch(new SetChosenRoofWindow(roofWindow)).subscribe());
    }
    // Do wyboru jeśli w konfiguracji jest wiele okien do wyboru
    if (configuration.products.windows.length > 1) {
      this.chooseWindowPopup = true;
    } else {
      // 'konfigurator/kolnierze/:configId/:formName/:productCode'
      if (this.addingProduct === 'flashing') {
        this.router.navigate(['/' + this.emptyFlashingConfiguration +
        '/' + configuration.globalId + '/' + 'no-name' + '/' + '-1']);
      }
      if (this.addingProduct === 'accessory') {
        this.router.navigate(['/' + this.emptyAccessoryConfiguration +
        '/' + configuration.globalId + '/' + 'no-name' + '/' + '-1']);
      }
    }
  }

  chooseWindowId(windowId: number) {
    if (windowId !== undefined || windowId !== 0) {
      this.store.select(ConfigurationState.roofWindowConfigurationByIdByGlobalId).pipe(
        takeUntil(this.isDestroyed$),
        map(filterFn => filterFn(this.chosenConfig.globalId, windowId))).subscribe(roofWindow => this.store.dispatch(new SetChosenRoofWindow(roofWindow)).subscribe());
    }
    if (this.addingProduct === 'flashing') {
      this.router.navigate(['/' + this.emptyFlashingConfiguration +
      '/' + this.chosenConfig.globalId + '/' + 'no-name' + '/' + '-1']);
    }
    if (this.addingProduct === 'accessory') {
      this.router.navigate(['/' + this.emptyAccessoryConfiguration +
      '/' + this.chosenConfig.globalId + '/' + 'no-name' + '/' + '-1']);
    }
    this.chooseWindowPopup = false;
  }

  addNewWindow(configuration: SingleConfiguration) {
    this.chosenConfig = configuration;
    this.flashingConfigs = Object.assign([], configuration.products.flashings);
    this.flashingConfigs.push({
      flashing: null,
      id: -1,
      flashingFormName: null,
      flashingFormData: null,
      quantity: 0,
      configLink: ''
    });
    if (configuration.products.flashings.length === 1) {
      this.store.select(ConfigurationState.flashingConfigurationByIdByGlobalId).pipe(
        takeUntil(this.isDestroyed$),
        map(filterFn => filterFn(configuration.globalId, configuration.products.flashings[0].id))).subscribe(flashing => this.store.dispatch(new SetChosenFlashing(flashing)).subscribe());
    }
    // Do wyboru jeśli w konfiguracji jest wiele okien do wyboru
    if (configuration.products.flashings.length > 1) {
      this.chooseFlashingPopup = true;
    } else {
      this.router.navigate(['/' + this.emptyWindowConfiguration +
      '/' + configuration.globalId + '/' + 'no-name' + '/' + '-1']);
    }
  }

  chooseFlashingId(flashingId: number) {
    if (flashingId !== undefined || flashingId !== 0) {
      this.store.select(ConfigurationState.flashingConfigurationByIdByGlobalId).pipe(
        takeUntil(this.isDestroyed$),
        map(filterFn => filterFn(this.chosenConfig.globalId, flashingId))).subscribe(flashing => this.store.dispatch(new SetChosenFlashing(flashing)).subscribe());
    }
    this.router.navigate(['/' + this.emptyWindowConfiguration +
    '/' + this.chosenConfig.globalId + '/' + 'no-name' + '/' + '-1']);
    this.chooseFlashingPopup = false;
  }

  returnCurrencyName(currency: string) {
    if (currency === 'EUR') {
      return '€';
    } else {
      return 'zł';
    }
  }

  addNewFlatWindow(configuration: any) {
    this.chosenConfig = configuration;
    // 'konfigurator/kolnierze/:configId/:formName/:productCode'
    this.router.navigate(['/' + this.emptyFlatWindowConfiguration +
    '/' + configuration.globalId + '/' + 'no-name' + '/' + '-1']);
  }

  onSubmit(configuration: SingleConfiguration, i: number) {
    this.loadingForm = true;
    const newConfiguration = _.cloneDeep(configuration);
    newConfiguration.installationAddress = new Address();
    const address = {
      firstName: this.localizationForm.get('firstName' + i).value,
      lastName: this.localizationForm.get('lastName' + i).value,
      phoneNumber: this.localizationForm.get('phoneNumber' + i).value,
      street: this.localizationForm.get('street' + i).value,
      localNumber: this.localizationForm.get('localNumber' + i).value,
      zipCode: this.localizationForm.get('zipCode' + i).value,
      city: this.localizationForm.get('city' + i).value,
      country: this.localizationForm.get('country' + i).value
    };
    newConfiguration.emailToSend = this.localizationForm.get('email' + i).value;
    newConfiguration.installationAddress = address;
    newConfiguration.comments = this.localizationForm.get('comments' + i).value;
    console.log(newConfiguration);
    this.store.dispatch(new UpdateGlobalConfigurationInfoByConfigId(newConfiguration)).pipe(takeUntil(this.isDestroyed$)).subscribe(() => this.loadingForm = false);
  }
}
