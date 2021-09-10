import {Component, OnDestroy, OnInit} from '@angular/core';
import {CrudFirebaseService} from '../../services/crud-firebase-service';
import {DatabaseService} from '../../services/database.service';
import {AuthService} from '../../services/auth.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {SingleConfiguration} from '../../models/single-configuration';
import {map, takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {WindowConfig} from '../../models/window-config';
import {LoadConfigurationService} from '../../services/load-configuration.service';
import {FlashingConfig} from '../../models/flashing-config';

@Component({
  selector: 'app-configuration-summary',
  templateUrl: './configuration-summary.component.html',
  styleUrls: ['./configuration-summary.component.scss']
})
export class ConfigurationSummaryComponent implements OnInit, OnDestroy {

  configurations: SingleConfiguration[];
  configurationsSubject: BehaviorSubject<SingleConfiguration[]>;
  configurations$: Observable<SingleConfiguration[]>;
  currentUser;
  uneditable = true;
  loading;
  chooseWindowPopup = false;
  chooseFlashingPopup = false;
  tempSingleConfig: SingleConfiguration;
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

  constructor(private crud: CrudFirebaseService,
              private db: DatabaseService,
              private authService: AuthService,
              private router: Router,
              private loadConfig: LoadConfigurationService,
              public translate: TranslateService) {
    this.loading = true;
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  ngOnInit() {
    // this.crud.deleteWindowConfigurationFromConfigurationById('configuration-1', 2).subscribe(console.log);
    // this.db.fetchRoofWindows().subscribe(windows => {
    //   this.crud.updateWindowConfigurationIntoConfigurationById('configuration-1', 1, windows[3]).subscribe(console.log);
    // });
    this.configurationsSubject = new BehaviorSubject<SingleConfiguration[]>([]);
    this.configurations$ = this.configurationsSubject.asObservable();
    this.authService.returnUser().pipe(takeUntil(this.isDestroyed$)).subscribe(currentUser => {
      this.crud.readAllUserConfigurations(currentUser).pipe(
        map((data: Array<any>) => {
          return data.filter(x => x !== null);
        }),
        map(configurations => {
          return configurations.filter(config => config.active === true);
        }),
        takeUntil(this.isDestroyed$)).subscribe(activeConfigurations => {
        this.configurations = activeConfigurations;
        this.configurationsSubject.next(this.configurations);
        this.loading = currentUser === '';
      });
    });
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

  builtNameForTranslation(prefix: string, option: string) {
    return String(prefix + option);
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }

  resize(delta: number, quantity: number, configurationId, product, productId) {
    quantity = quantity + delta;
    if (product.window !== undefined) {
      product.quantity = product.quantity + delta;
      this.crud.updateWindowQuantity(configurationId, productId, quantity).subscribe(console.log);
    }
    if (product.flashing !== undefined) {
      product.quantity = product.quantity + delta;
      this.crud.updateFlashingQuantity(configurationId, productId, quantity).subscribe(console.log);
    }
    if (product.accessory !== undefined) {
      product.quantity = product.quantity + delta;
      this.crud.updateAccessoryQuantity(configurationId, productId, quantity).subscribe(console.log);
    }
  }

  decreaseQuantity(configurationId: string, product,
                   productId: number, quantity: number) {
    if (quantity === 0) {
      quantity = 0;
    }
    this.resize(-1, quantity, configurationId, product, productId);
  }

  increaseQuantity(configurationId: string, product,
                   productId: number, quantity: number) {
    this.resize(1, quantity, configurationId, product, productId);
  }

  configurationNameEdit() {
    if (this.uneditable === null) {
      this.uneditable = true;
    } else {
      this.uneditable = null;
    }
  }

  configurationNameSave(configId: string, newConfigName: string) {
    this.crud.updateNameConfigurationById(configId, newConfigName).subscribe(() => console.log('Nazwa została zmieniona'));
    if (this.uneditable === null) {
      this.uneditable = true;
    } else {
      this.uneditable = null;
    }
  }

  removeProductConfiguration(id: string, productId: number, product) {
    if (product.window !== undefined) {
      this.crud.deleteWindowConfigurationFromConfigurationById(id, productId);
    }
    if (product.flashing !== undefined) {
      this.crud.deleteFlashingConfigurationFromConfigurationById(id, productId);
    }
    if (product.accessory !== undefined) {
      this.crud.deleteAccessoryConfigurationFromConfigurationById(id, productId);
    }
  }

  removeHoleConfiguration(id: string) {
    this.crud.deleteConfigurationById(id);
  }

  // TODO sprawdzić co dokładnie wrzuca się do koszyka i odpowiednio to obsługiwać
  addToCart(window) {
    this.db.addToCart(window, window.quantity);
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
      quantity: 0
    });
    if (configuration.products.windows.length === 1) {
      this.crud.readWindowByIdFromConfigurationById(configuration.globalId, configuration.products.windows[0].id)
        .subscribe(window =>  this.loadConfig.windowData$.next(window.window));
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
    if (windowId === undefined || windowId === 0) {
      this.loadConfig.windowData$.next(null);
    } else {
      this.crud.readWindowByIdFromConfigurationById(this.chosenConfig.globalId, windowId)
        .subscribe(window =>  this.loadConfig.windowData$.next(window.window));
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
      quantity: 0
    });
    if (configuration.products.flashings.length === 1) {
      this.crud.readFlashingByIdFromConfigurationById(configuration.globalId, configuration.products.flashings[0].id)
        .subscribe(flashing =>  this.loadConfig.flashingData$.next(flashing.flashing));
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
    if (flashingId === undefined || flashingId === 0) {
      this.loadConfig.flashingData$.next(null);
    } else {
      this.crud.readFlashingByIdFromConfigurationById(this.chosenConfig.globalId, flashingId)
        .subscribe(flashing =>  this.loadConfig.flashingData$.next(flashing.flashing));
    }
    this.router.navigate(['/' + this.emptyWindowConfiguration +
    '/' + this.chosenConfig.globalId + '/' + 'no-name' + '/' + '-1']);
    this.chooseFlashingPopup = false;
  }
}
