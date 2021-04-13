import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConfigurationDistributorService} from '../../services/configuration-distributor.service';
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

  constructor(private configDist: ConfigurationDistributorService,
              private db: DatabaseService,
              private authService: AuthService,
              private ipService: IpService) {
  }

  ngOnInit(): void {
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
      console.log(currentUser);
      this.configurations = [];
      const configurationsFormStorage = JSON.parse(localStorage.getItem('configurations'));
      for (const userConfigurations of configurationsFormStorage) {
        if (currentUser === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            this.configurations.push(config);
          }
        }
      }
      this.configurationsSubject.next(this.configurations);
      console.log(this.configurations);
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

  decreaseQuantity(quantity: number) {
    if (quantity === 0) {
      quantity = 0;
    } else {
      this.resize(-1, quantity);
    }
  }

  increaseQuantity(quantity: number) {
    this.resize(+1, quantity);
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

  removeWindowConfiguration(configurationId: number, window: { id: number; quantity: number; window: RoofWindowSkylight }) {
    for (const configs of this.configurations) {
      // @ts-ignore
      if (configs.id === configurationId) {
        // @ts-ignore
        configs.windows = configs.windows.filter(windows => windows.id !== window.id);
      }
    }
    this.configurationsSubject.next(this.configurations);
    localStorage.clear();
    localStorage.setItem('configurations', JSON.stringify(this.configurations));
    this.configDist.populateDataToFirebase(this.configurations);
  }

  removeFlashingConfiguration(configurationId: number, flashing: { id: number; quantity: number; flashing: Flashing }) {
    for (const configs of this.configurations) {
      // @ts-ignore
      if (configs.id === configurationId) {
        // @ts-ignore
        configs.flashings = configs.flashings.filter(flashings => flashings.id !== flashing.id);
      }
    }
    this.configurationsSubject.next(this.configurations);
    localStorage.clear();
    localStorage.setItem('configurations', JSON.stringify(this.configurations));
    this.configDist.populateDataToFirebase(this.configurations);
  }

  removeAccessoryConfiguration(configurationId: number, accessory: { id: number; quantity: number; accessory: Accessory }) {
    for (const configs of this.configurations) {
      // @ts-ignore
      if (configs.id === configurationId) {
        // @ts-ignore
        configs.accessories = configs.accessories.filter(accessories => accessories.id !== accessory.id);
      }
    }
    this.configurationsSubject.next(this.configurations);
    localStorage.clear();
    localStorage.setItem('configurations', JSON.stringify(this.configurations));
    this.configDist.populateDataToFirebase(this.configurations);
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
