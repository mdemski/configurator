import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {SingleConfiguration} from '../../models/single-configuration';
import {map, takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {WindowConfig} from '../../models/window-config';
import {FlashingConfig} from '../../models/flashing-config';
import {Select, Store} from '@ngxs/store';
import {
  DeleteAccessoryConfigurationByConfigAndAccessoryId,
  DeleteFlashingConfigurationByConfigAndFlashingId, DeleteGlobalConfiguration,
  DeleteRoofWindowConfigurationByConfigAndWindowId,
  UpdateAccessoryQuantityByConfigAndAccessoryId,
  UpdateFlashingQuantityByConfigAndFlashingId, UpdateGlobalConfigurationNameByConfigId,
  UpdateRoofWindowQuantityByConfigAndWindowId
} from '../../store/configuration/configuration.actions';
import {AppState} from '../../store/app/app.state';
import {ConfigurationState} from '../../store/configuration/configuration.state';
import {SetChosenFlashing} from '../../store/flashing/flashing.actions';
import {SetChosenRoofWindow} from '../../store/roof-window/roof-window.actions';
import {AddProductToCart} from '../../store/cart/cart.actions';

@Component({
  selector: 'app-configuration-summary',
  templateUrl: './configuration-summary.component.html',
  styleUrls: ['./configuration-summary.component.scss']
})
export class ConfigurationSummaryComponent implements OnInit, OnDestroy {

  @Select(AppState) user$: Observable<{ currentUser }>;

  userConfigurations$: Observable<SingleConfiguration[]> = new Subject() as Observable<SingleConfiguration[]>;
  currentUser;
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
  emptyFlashingConfiguration: string;
  emptyAccessoryConfiguration: string;
  addingProduct: string;

  constructor(private router: Router,
              private store: Store,
              public translate: TranslateService) {
    this.loading = true;
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.currentUser = user.currentUser);
  }

  ngOnInit() {
    this.userConfigurations$ = this.store.select(ConfigurationState.userConfigurations)
      .pipe(
        takeUntil(this.isDestroyed$),
        map(filterFn => filterFn(this.currentUser)));
    this.loading = false;
    // TODO do wywalenia - kod testowy
    // this.db.fetchRoofWindows().pipe(takeUntil(this.isDestroyed$)).subscribe(windows => {
    //   this.tempSingleConfig = {
    //     globalId: 'configuration-1',
    //     created: new Date(),
    //     lastUpdate: new Date(),
    //     user: '178.73.35.150',
    //     userId: 1,
    //     name: 'Pierwsza testowa w MongoDB',
    //     active: true,
    //     products: {
    //       windows: [{
    //         id: 1,
    //         window: Object.assign({}, windows[0]),
    //         quantity: 1,
    //         windowFormName: 'asdfgahafhga',
    //         windowFormData: null
    //       },
    //         {
    //           id: 2,
    //           window: Object.assign({}, windows[1]),
    //           quantity: 2,
    //           windowFormName: 'aaasdfsdfsf',
    //           windowFormData: null
    //         }],
    //       flashings: null,
    //       accessories: null,
    //       verticals: null,
    //       flats: null
    //     }
    //   };
    //   // this.crud.createConfigurationForUser('178.73.35.150', this.tempSingleConfig).subscribe(() => console.log('Success'));
    // });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.emptyFlashingConfiguration = text.configuratorFlashing;
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.emptyAccessoryConfiguration = text.configuratorAccessory;
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.emptyWindowConfiguration = text.configuratorRoofWindow;
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }

  resize(delta: number, quantity: number, globalConfiguration: SingleConfiguration, product, productId) {
    quantity = quantity + delta;
    if (product.window !== undefined) {
      product.quantity = product.quantity + delta;
      this.store.dispatch(new UpdateRoofWindowQuantityByConfigAndWindowId(globalConfiguration, productId, quantity)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
    }
    if (product.flashing !== undefined) {
      product.quantity = product.quantity + delta;
      this.store.dispatch(new UpdateFlashingQuantityByConfigAndFlashingId(globalConfiguration, productId, quantity)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
    }
    if (product.accessory !== undefined) {
      product.quantity = product.quantity + delta;
      this.store.dispatch(new UpdateAccessoryQuantityByConfigAndAccessoryId(globalConfiguration, productId, quantity)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
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

  configurationNameSave(mongoId: string, newConfigName: string) {
    this.store.dispatch(new UpdateGlobalConfigurationNameByConfigId(mongoId, newConfigName)).pipe(takeUntil(this.isDestroyed$)).subscribe(() => console.log('Nazwa została zmieniona'));
    if (this.uneditable === null) {
      this.uneditable = true;
    } else {
      this.uneditable = null;
    }
  }

  removeProductConfiguration(globalConfiguration: SingleConfiguration, productId: number, product) {
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

  // TODO sprawdzić co dokładnie wrzuca się do koszyka i odpowiednio to obsługiwać
  addToCart(window) {
    this.store.dispatch(new AddProductToCart(window, window.quantity)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
  }

  // Options toggle
  onHoverClick($event: MouseEvent) {
    // @ts-ignore
    const divsTable = $event.target.parentElement.parentElement.parentElement.parentElement;
    if (divsTable.style.maxHeight === '126.3px' || divsTable.style.maxHeight === '') {
      divsTable.style.maxHeight = '875px';
      divsTable.style.transition = 'all .7s ease-in-out';
    } else {
      divsTable.style.maxHeight = '126.3px';
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
}
