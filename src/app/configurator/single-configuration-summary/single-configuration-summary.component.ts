import {Component, OnDestroy, OnInit} from '@angular/core';
import {SingleConfiguration} from '../../models/single-configuration';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {CrudFirebaseService} from '../../services/crud-firebase-service';
import {DatabaseService} from '../../services/database.service';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {map, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-single-configuration-summary',
  templateUrl: './single-configuration-summary.component.html',
  styleUrls: ['./single-configuration-summary.component.scss']
})
export class SingleConfigurationSummaryComponent implements OnInit, OnDestroy {

  configuration: SingleConfiguration;
  configurationSubject: BehaviorSubject<SingleConfiguration>;
  configuration$: Observable<SingleConfiguration>;
  currentUser;
  uneditable = true;
  loading;
  tempSingleConfig: SingleConfiguration;
  isDestroyed$ = new Subject();

  constructor(private crud: CrudFirebaseService,
              private db: DatabaseService,
              private authService: AuthService,
              private activeRouter: ActivatedRoute) {
    this.loading = true;
  }

  ngOnInit() {
    this.configurationSubject = new BehaviorSubject<SingleConfiguration>(null);
    this.configuration$ = this.configurationSubject.asObservable();
    this.activeRouter.params.pipe(
      takeUntil(this.isDestroyed$),
      map(param => {
      this.crud.readConfigurationById(param.configId).pipe(
        takeUntil(this.isDestroyed$),
        map(configuration => {
        this.configuration = configuration;
        this.configurationSubject.next(this.configuration);
        this.loading = false;
      })).subscribe();
    })).subscribe();
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

}
