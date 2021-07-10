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
  tempSingleConfig: SingleConfiguration;
  isDestroyed$ = new Subject();
  windowId: number;
  windowConfigurations: WindowConfig[];
  chosenConfig: SingleConfiguration;
  emptyFlashingConfiguration: string;
  emptyAccessoryConfiguration: string;
  addingProduct: string;

  constructor(private crud: CrudFirebaseService,
              private db: DatabaseService,
              private authService: AuthService,
              private router: Router,
              public translate: TranslateService,
              private loadConfig: LoadConfigurationService) {
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
    this.windowConfigurations = Object.assign([], configuration.products.windows);
    this.windowConfigurations.push({
      window: null,
      id: -1,
      windowFormName: null,
      windowFormData: null,
      quantity: 0
    });
    this.chooseWindowPopup = true;
  }

  chooseWindowId(windowId: number) {
    if (windowId === undefined || windowId === 0) {
      this.loadConfig.windowData$.next(null);
    } else {
      this.crud.readWindowByIdFromConfigurationById(this.chosenConfig.globalId, windowId)
        .subscribe(window =>  this.loadConfig.windowData$.next(window.window));
    }
    if (this.addingProduct === 'flashing') {
      this.router.navigate(['/' + this.emptyFlashingConfiguration]);
    }
    if (this.addingProduct === 'accessory') {
      this.router.navigate(['/' + this.emptyAccessoryConfiguration]);
    }
    this.chooseWindowPopup = false;
  }
}
