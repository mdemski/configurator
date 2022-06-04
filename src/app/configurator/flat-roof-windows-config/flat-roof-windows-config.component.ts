import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {RouterState} from '@ngxs/router-plugin';
import {CartState} from '../../store/cart/cart.state';
import {AppState} from '../../store/app/app.state';
import {ConfigurationState} from '../../store/configuration/configuration.state';
import {SingleConfiguration} from '../../models/single-configuration';
import {FlatRoofWindowState} from '../../store/flat-roof-window/flat-roof-window.state';
import {FlatRoofWindow} from '../../models/flat-roof-window';
import {AvailableConfigDataState} from '../../store/avaiable-config-data/available-config-data.state';
import {RoofWindowValuesSetterService} from '../../services/roof-window-values-setter.service';
import {LoadConfigurationService} from '../../services/load-configuration.service';
import {HighestIdGetterService} from '../../services/highest-id-getter.service';
import {RandomStringGeneratorService} from '../../services/random-string-generator.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {filter, map, takeUntil} from 'rxjs/operators';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {FlatConfig} from '../../models/flat-config';

@Component({
  selector: 'app-flat-roof-windows-config',
  templateUrl: './flat-roof-windows-config.component.html',
  styleUrls: ['./flat-roof-widows-config.component.scss']
})
export class FlatRoofWindowsConfigComponent implements OnInit, OnDestroy {

  isDestroyed$ = new Subject();
  @Select(RouterState) params$: Observable<any>;
  @Select(CartState) cart$: Observable<any>;
  @Select(AppState) user$: Observable<{ currentUser }>;
  @Select(ConfigurationState.configurations) configurations$: Observable<SingleConfiguration[]>;
  @Select(FlatRoofWindowState.flats) flatRoofWindows$: Observable<FlatRoofWindow[]>;
  @Select(AvailableConfigDataState.configFlatRoofWindows) configOptions$: Observable<any>;
  @Select(AvailableConfigDataState.flatRoofWindowsConfigLoaded) configOptionsLoaded$: Observable<boolean>;
  @Select(AvailableConfigDataState.flatRoofWindowsExclusions) excludeOptions$: Observable<any>;

  constructor(private store: Store,
              private windowValuesSetter: RoofWindowValuesSetterService,
              private loadConfig: LoadConfigurationService,
              private hd: HighestIdGetterService,
              private randomString: RandomStringGeneratorService,
              private router: Router,
              private fb: FormBuilder,
              public translate: TranslateService) {
    this.loading = true;
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
    this.configOptions$.pipe(takeUntil(this.isDestroyed$)).subscribe(configOptions => this.configOptions = configOptions);
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.currentUser = user.currentUser.email);
    this.configurations$.pipe(takeUntil(this.isDestroyed$)).subscribe(configurations => this.configurations = configurations);
    this.params$.pipe(takeUntil(this.isDestroyed$)).subscribe(params => this.routerParams = params);
    this.flatRoofWindows$.pipe(takeUntil(this.isDestroyed$)).subscribe(flatRoofWindows => this.flatRoofWindowsFromDataBase = flatRoofWindows);
  }

  private configurations: SingleConfiguration[];
  userConfigurations$: Observable<SingleConfiguration[]> = new Subject() as Observable<SingleConfiguration[]>;
  private globalConfiguration: SingleConfiguration = null;
  private newWindowConfig: SingleConfiguration;
  private configId: string;
  private tempConfiguredWindow: FlatRoofWindow;
  configByName$: Observable<FlatConfig>;
  configOptions;
  configurationSummary: string;
  configuredFlatRoofWindow: FlatRoofWindow;
  chooseConfigNamePopup = false;
  configFormId: number;
  form: FormGroup;
  private formName: string;
  formData$;
  popupConfig = true;
  userConfigs = [];
  copyLinkToConfigurationPopup = false;
  urlToSaveConfiguration: string;
  windowsConfigurator: string;
  showWidthMessage = false;
  showHeightMessage = false;
  private flatRoofWindowsFromDataBase: FlatRoofWindow[];
  private routerParams = null;
  private globalId = '';
  private highestUserId;
  private currentUser: string;
  private windowId: number;
  private windowCode: string;
  private dimensions;
  private flatRoofWindowModelsToCalculatePrice = [];
  private standardWidths = [60, 70, 80, 90, 100, 120, 140, 150, 220];
  private standardHeights = [60, 70, 80, 90, 100, 120, 140];
  private materialVisible = true;
  private openingVisible = false;
  private dimensionsVisible = false;
  private glazingVisible = false;
  private outerMaterialVisible = false;
  private handleVisible = false;
  private extrasVisible = false;
  minWidth = 24;
  maxWidth = 220;
  minHeight = 24;
  maxHeight = 140;
  stepWidth = 1;
  stepHeight = 1;
  availableOptions = [];
  materials = [];
  openingTypes = [];
  outerMaterials = [];
  outerColors = [];
  outerColorFinishes = [];
  glazingTypes = [];
  extrasFromFile = [];
  handles = [];
  shopFlatRoofWindowLink: string;
  subscription: Subscription;
  loading;

  static setDimensions(dimensions) {
    return dimensions;
  }

  ngOnInit(): void {
    this.configByName$ = this.store.select(ConfigurationState.configurationByFlatRoofFormName).pipe(
      takeUntil(this.isDestroyed$),
      map(filterFn => filterFn(this.routerParams.state.params.formName)));
    this.configOptionsLoaded$.pipe(takeUntil(this.isDestroyed$)).subscribe(loaded => {
      if (loaded) {
        this.flatRoofWindowModelsToCalculatePrice = this.configOptions.models;
        this.availableOptions = this.configOptions.availableOptions;
        this.extrasFromFile = this.objectMaker(this.configOptions.extras);
        this.glazingTypes = this.objectMaker(this.configOptions.glazingTypes);
        this.materials = this.objectMaker(this.configOptions.materials);
        this.openingTypes = this.objectMaker(this.configOptions.openingTypes);
        this.outerMaterials = this.objectMaker(this.configOptions.outerMaterials);
        this.outerColors = this.objectMaker(this.configOptions.outerColor);
        this.outerColorFinishes = this.objectMaker(this.configOptions.outerColorFinishes);
        this.dimensions = FlatRoofWindowsConfigComponent.setDimensions(this.configOptions.dimensions);
        this.handles = this.objectMaker(this.configOptions.handles);
        this.formName = this.routerParams.state.params.formName;
        this.windowCode = this.routerParams.state.params.productCode;
        if (this.routerParams.state.params.configId === undefined) {
          this.globalId = this.hd.getHighestGlobalIdFormMongoDB(this.configurations);
        } else {
          this.globalId = this.routerParams.state.params.configId;
          this.globalConfiguration = this.configurations.find(item => item.globalId === this.globalId);
        }
        this.loadForm();
      }
    });
    this.userConfigurations$ = this.store.select(ConfigurationState.userConfigurations)
      .pipe(takeUntil(this.isDestroyed$),
        map(filterFn => filterFn(this.currentUser)));
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
    this.highestUserId = 1;
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.shopFlatRoofWindowLink = text.shopFlatRoofWindows;
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.configurationSummary = text.configurationSummary;
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.windowsConfigurator = text.configuratorFlatRoofWindow;
    });
  }

  ngOnDestroy() {
    this.isDestroyed$.next(null);
  }

  private objectMaker(availableOptionsArray: string[]): {}[] {
    const objectsArray = [];
    for (const option of availableOptionsArray) {
      const tempObject = {
        option,
        disabled: null
      };
      objectsArray.push(tempObject);
    }
    return objectsArray;
  }

}
