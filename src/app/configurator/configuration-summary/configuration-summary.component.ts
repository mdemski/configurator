import {Component, OnDestroy, OnInit} from '@angular/core';
import {CrudFirebaseService} from '../../services/crud-firebase-service';
import {map} from 'rxjs/operators';
import {ConfigurationRoofWindowModel} from '../../models/configurationRoofWindowModel';
import {DatabaseService} from '../../services/database.service';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {IpService} from '../../services/ip.service';
import {AuthService} from '../../services/auth.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import _ from 'lodash';
import {Flashing} from '../../models/flashing';
import {Accessory} from '../../models/accessory';

@Component({
  selector: 'app-configuration-summary',
  templateUrl: './configuration-summary.component.html',
  styleUrls: ['./configuration-summary.component.scss']
})
export class ConfigurationSummaryComponent implements OnInit, OnDestroy {

  configurations: ConfigurationRoofWindowModel[];
  configurationsSubject: BehaviorSubject<ConfigurationRoofWindowModel[]>;
  configurations$: Observable<ConfigurationRoofWindowModel[]>;
  currentUser$: Subject<string> = new Subject();
  currentUser;

  constructor(private configDist: CrudFirebaseService,
              private db: DatabaseService,
              private authService: AuthService,
              private ipService: IpService) {
  }

  ngOnInit(): void {
    this.configDist.populateDataToFirebase();
    this.configurationsSubject = new BehaviorSubject<ConfigurationRoofWindowModel[]>([]);
    this.configurations$ = this.configurationsSubject.asObservable();
    this.authService.isLogged ? this.authService.user.pipe(map(user => user)).subscribe(user => {
        this.currentUser$.next(user.email);
      })
      : this.ipService.getIpAddress().pipe(map(userIp => userIp)).subscribe(userIp => {
        // @ts-ignore
        this.currentUser$.next(userIp.ip);
      });
    this.currentUser$.subscribe(currentUser => {
      this.configDist.readAllUserConfigurations(currentUser).subscribe(userConfigurations => {
        this.configurations = userConfigurations;
        this.configurationsSubject.next(this.configurations);
        // console.log(this.configurations);
      });
    });
  }

  builtNameForTranslation(prefix: string, option: string) {
    return String(prefix + option);
  }

  ngOnDestroy(): void {
    // this.configDist.configurationDataChange$.unsubscribe();
  }

  resize(delta: number, quantity: number) {
    quantity = quantity + delta;
  }

  decreaseQuantity(product: RoofWindowSkylight | Flashing | Accessory) {
    // @ts-ignore
    console.log(product.quantity);
    // @ts-ignore
    if (product.quantity === 0) {
      // @ts-ignore
      product.quantity = 0;
    } else {
      // @ts-ignore
      this.resize(-1, product.quantity);
    }
    // @ts-ignore
    console.log(product.quantity);
  }

  increaseQuantity(product: RoofWindowSkylight | Flashing | Accessory) {
    // @ts-ignore
    this.resize(+1, product.quantity);
    // @ts-ignore
    console.log(product.quantity);
  }

  // TODO sprawdzić co dokładnie wrzuca się do koszyka i odpowiednio to obsługiwać
  addToCart(window) {
    this.db.addToCart(window, window.quantity);
  }

  // Options toggle
  onHoverClick($event: MouseEvent) {
    // @ts-ignore
    const divsTable = $event.target.parentElement.parentElement.parentElement.parentElement;
    if (divsTable.style.maxHeight === '84.2px' || divsTable.style.maxHeight === '') {
      divsTable.style.maxHeight = '875px';
      divsTable.style.transition = 'all .7s ease-in-out';
    } else {
      divsTable.style.maxHeight = '84.2px';
      divsTable.style.transition = 'all .7s ease-in-out';
    }
  }

  removeConfiguration(configurationId: number,
                      product: RoofWindowSkylight | Flashing | Accessory) {
    for (const configs of this.configurations) {
      // @ts-ignore
      if (configs.id === configurationId && product.window !== undefined) {
        // @ts-ignore
        configs.windows = configs.windows.filter(windows => windows.id !== product.id);
      }
      // @ts-ignore
      if (configs.id === configurationId && product.flashing !== undefined) {
        // @ts-ignore
        configs.flashings = configs.flashings.filter(flashings => flashings.id !== product.id);
      }
      // @ts-ignore
      if (configs.id === configurationId && product.accessory !== undefined) {
        // @ts-ignore
        configs.accessories = configs.accessories.filter(accessories => accessories.id !== product.id);
      }
    }
    // this.configDist.createConfigurationForUser(this.currentUser, this.configurations);
    this.configurationsSubject.next(this.configurations);
  }

  removeHoleConfiguration(configuration: ConfigurationRoofWindowModel) {
    let index = -1;
    for (let i = 0; i < this.configurations.length; i++) {
      if (_.isEqual(this.configurations[i], configuration)) {
        index = i;
      }
    }
    this.configurations.splice(index, 1);
    this.configurationsSubject.next(this.configurations);
  }
}
