import {Component, OnDestroy, OnInit} from '@angular/core';
import {CrudFirebaseService} from '../../services/crud-firebase-service';
import {map} from 'rxjs/operators';
import {DatabaseService} from '../../services/database.service';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {IpService} from '../../services/ip.service';
import {AuthService} from '../../services/auth.service';
import {AsyncSubject, BehaviorSubject, Observable, Subject} from 'rxjs';
import {Flashing} from '../../models/flashing';
import {Accessory} from '../../models/accessory';
import {SingleConfiguration} from '../../models/single-configuration';

@Component({
  selector: 'app-configuration-summary',
  templateUrl: './configuration-summary.component.html',
  styleUrls: ['./configuration-summary.component.scss']
})
export class ConfigurationSummaryComponent implements OnInit, OnDestroy {

  configurations: SingleConfiguration[];
  configurationsSubject: BehaviorSubject<SingleConfiguration[]>;
  configurations$: Observable<SingleConfiguration[]>;
  currentUser$: BehaviorSubject<string>;
  currentUser;
  uneditable = true;
  loading;

  constructor(private configDist: CrudFirebaseService,
              private db: DatabaseService,
              private authService: AuthService,
              private ipService: IpService) {
    this.loading = true;
    this.currentUser$ = new BehaviorSubject<string>('');
    this.authService.isLogged ? this.authService.user.pipe(map(user => user)).subscribe(user => {
        this.currentUser$.next(user.email);
      })
      : this.ipService.getIpAddress().pipe(map(userIp => userIp)).subscribe(userIp => {
        // @ts-ignore
        this.currentUser$.next(userIp.ip);
      });
  }

  ngOnInit(): void {
    // this.db.populateDataToFirebase();
    // this.configDist.createConfigurationForUser('178.73.35.150', this.db.temporarySingleConfiguration);
    this.configurationsSubject = new BehaviorSubject<SingleConfiguration[]>([]);
    this.configurations$ = this.configurationsSubject.asObservable();
    this.currentUser$.subscribe(currentUser => {
      this.configDist.readAllUserConfigurations(currentUser).subscribe(userConfigurations => {
        this.configurations = userConfigurations;
        this.configurationsSubject.next(this.configurations);
        this.loading = currentUser === '';
      });
    });
  }

  builtNameForTranslation(prefix: string, option: string) {
    return String(prefix + option);
  }

  ngOnDestroy(): void {
    // this.configDist.configurationDataChange$.unsubscribe();
  }

  resize(delta: number, quantity: number, configurationId, product, productId) {
    quantity = quantity + delta;
    this.currentUser$.subscribe(user => {
      if (product.window !== undefined) {
        this.configDist.updateWindowQuantity(user, configurationId, productId, quantity);
      }
      if (product.flashing !== undefined) {
        this.configDist.updateFlashingQuantity(user, configurationId, productId, quantity);
      }
      if (product.accessory !== undefined) {
        this.configDist.updateAccessoryQuantity(user, configurationId, productId, quantity);
      }
    });
  }

  decreaseQuantity(configurationId: number, product,
                   productId: number, quantity: number) {
    if (quantity === 0) {
      quantity = 0;
    }
    this.resize(-1, quantity, configurationId, product, productId);
  }

  increaseQuantity(configurationId: number, product,
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

  configurationNameSave(configId: number, newConfigName: string) {
    this.currentUser$.subscribe(user => {
      this.configDist.updateNameConfigurationById(user, configId, newConfigName);
    });
    if (this.uneditable === null) {
      this.uneditable = true;
    } else {
      this.uneditable = null;
    }
  }

  removeProductConfiguration(id: number, productId: number, product) {
    this.currentUser$.subscribe(user => {
      if (product.window !== undefined) {
        this.configDist.deleteWindowConfigurationFromConfigurationById(user, id, productId);
      }
      if (product.flashing !== undefined) {
        this.configDist.deleteFlashingConfigurationFromConfigurationById(user, id, productId);
      }
      if (product.accessory !== undefined) {
        this.configDist.deleteAccessoryConfigurationFromConfigurationById(user, id, productId);
      }
    });
  }

  removeHoleConfiguration(id: number) {
    this.currentUser$.subscribe(user => {
      this.configDist.deleteConfigurationById(user, id);
    });
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
}
