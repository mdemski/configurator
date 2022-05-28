import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppState} from '../../store/app/app.state';
import {Observable, Observer, Subject} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {ConfigurationState} from '../../store/configuration/configuration.state';
import {SingleConfiguration} from '../../models/single-configuration';
import {RouterState} from '@ngxs/router-plugin';
import {CartState} from '../../store/cart/cart.state';
import {AvailableConfigDataState} from '../../store/avaiable-config-data/available-config-data.state';
import {HighestIdGetterService} from '../../services/highest-id-getter.service';
import {RandomStringGeneratorService} from '../../services/random-string-generator.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {filter, map, takeUntil, tap} from 'rxjs/operators';
import {AccessoryState} from '../../store/accessory/accessory.state';
import {Accessory} from '../../models/accessory';
import {AccessoryConfig} from '../../models/accessory-config';
import {LoadConfigurationService} from '../../services/load-configuration.service';
import {AccessoryValuesSetterService} from '../../services/accessory-values-setter.service';
import {ModalService} from '../../modal/modal.service';
import {
  AddAccessoryConfiguration, AddGlobalConfiguration,
  UpdateAccessoryConfiguration, UpdateAccessoryFormByFormName
} from '../../store/configuration/configuration.actions';

@Component({
  selector: 'app-accessories-config',
  templateUrl: './accessories-config.component.html',
  styleUrls: ['./accessories-config.component.scss']
})
export class AccessoriesConfigComponent implements OnInit, OnDestroy {

  @Select(AppState) user$: Observable<{ currentUser }>;
  @Select(ConfigurationState.configurations) configurations$: Observable<SingleConfiguration[]>;
  @Select(AccessoryState.accessories) accessories$: Observable<Accessory[]>;
  @Select(AvailableConfigDataState.configAccessories) configOptions$: Observable<any>;
  @Select(AvailableConfigDataState.accessoriesConfigLoaded) configOptionsLoaded$: Observable<boolean>;
  @Select(AvailableConfigDataState.accessoriesExclusions) excludeOptions$: Observable<any>;
  @Select(RouterState) params$: Observable<any>;
  @Select(CartState) cart$: Observable<any>;

  constructor(private store: Store,
              private hd: HighestIdGetterService,
              private randomString: RandomStringGeneratorService,
              private loadConfig: LoadConfigurationService,
              private accessoryValueSetter: AccessoryValuesSetterService,
              private router: Router,
              private fb: FormBuilder,
              private modal: ModalService,
              public translate: TranslateService) {
    this.loading = true;
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
    this.configOptions$.pipe(takeUntil(this.isDestroyed$)).subscribe(configOptions => this.configOptions = configOptions);
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.currentUser = user.currentUser.email);
    this.configurations$.pipe(takeUntil(this.isDestroyed$)).subscribe(configurations => this.configurations = configurations);
    this.params$.pipe(takeUntil(this.isDestroyed$)).subscribe(params => this.routerParams = params);
    this.accessories$.pipe(takeUntil(this.isDestroyed$)).subscribe(accessories => {
      this.accessoriesFormDataBase = accessories;
    });
  }

  isDestroyed$ = new Subject();
  loading;
  private shopAccessoryLink = '';
  private configurationSummary: string;
  private accessoriesFormDataBase: Accessory[];
  private accessoryModelsToCalculationPrice = [];
  private currentUser: string;
  private routerParams = null;
  private configurations: SingleConfiguration[];
  configByName$: Observable<AccessoryConfig>;
  private formName: string;
  private accessoryCode: string;
  private configId: string;
  private globalId = '';
  private globalConfiguration: SingleConfiguration = null;
  private newAccessoryConfig: SingleConfiguration;
  configuredAccessory: Accessory;
  tempConfiguredAccessory: Accessory;
  accessoryId: number;
  form: FormGroup;
  formData$: Observable<any>;
  showWidthMessage = false;
  showHeightMessage = false;
  showFramesMatching = true;
  configFormId: number;
  userConfigurations$: Observable<SingleConfiguration[]> = new Subject() as Observable<SingleConfiguration[]>;
  userConfigs = [];
  private highestUserId;
  chooseConfigNamePopup = false;
  copyLinkToConfigurationPopup = false;
  urlToSaveConfiguration: string;
  accessoriesConfigurator: string;
  // Available options
  private configOptions;
  accessoryTypes = [];
  accessoryKinds = [];
  framesMatchings = [];
  accessoryMaterials = [];
  materialColors = [];
  equipmentColors = [];
  dimensions;
  // HTML template elements
  private typeVisible = false;
  private kindVisible = false;
  private materialVisible = false;
  private colorVisible = false;
  private dimensionVisible = false;

  private standardWidths = [55, 66, 78, 94, 114, 134];
  private standardHeights = [78, 98, 118, 140, 160];
  stepWidth;
  stepHeight;
  minWidth;
  minHeight;
  maxWidth;
  maxHeight;

  static setDimensions(dimensions) {
    return dimensions;
  }

  ngOnInit(): void {
    this.loadDimensionData();
    this.configByName$ = this.store.select(ConfigurationState.configurationByAccessoryFormName).pipe(
      takeUntil(this.isDestroyed$),
      map(filterFn => filterFn(this.routerParams.state.params.formName)));
    this.configOptionsLoaded$.subscribe(loaded => {
      if (loaded) {
        this.accessoryModelsToCalculationPrice = this.configOptions.models;
        this.accessoryTypes = this.objectMaker(this.configOptions.accessoryTypes); // przy tym wyborze dodać opcję D37/D33/D12 oraz podział na roletę zewnętrzną elektryczną i solarną oraz UTB i AKP
        this.accessoryKinds = this.objectMaker(this.configOptions.accessoryKinds);
        this.framesMatchings = this.objectMaker(this.configOptions.framesMatchings);
        this.accessoryMaterials = this.objectMaker(this.configOptions.materials);
        this.materialColors = this.objectMaker(this.configOptions.materialColors); // wybór tego w jednym kroku tak jak klamki w oknach
        this.equipmentColors = this.objectMaker(this.configOptions.equipmentColors); // wybór tego w jednym kroku tak jak klamki w oknach
        this.dimensions = AccessoriesConfigComponent.setDimensions(this.configOptions.dimensions);
        this.formName = this.routerParams.state.params.formName;
        this.accessoryCode = this.routerParams.state.params.productCode;
        this.configId = this.routerParams.state.params.configId === undefined ? '-1' : this.routerParams.state.params.configId;
        if (this.routerParams.state.params.configId === undefined) {
          this.globalId = this.hd.getHighestGlobalIdFormMongoDB(this.configurations);
        } else {
          this.globalId = this.routerParams.state.params.configId;
          this.globalConfiguration = this.configurations.find(item => item.globalId === this.globalId);
        }
        this.loadForm();
      }
      this.userConfigurations$ = this.store.select(ConfigurationState.userConfigurations)
        .pipe(map(filterFn => filterFn(this.currentUser)));
      this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
        this.configurationSummary = text.configurationSummary;
      });
      this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
        this.shopAccessoryLink = text.shopAccessories;
      });
      this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
        this.accessoriesConfigurator = text.configuratorAccessory;
      });
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

  private loadDimensionData() {
    this.stepWidth = 1;
    this.stepHeight = 1;
    this.minWidth = 47;
    this.minHeight = 78;
    this.maxWidth = 134;
    this.maxHeight = 160;
  }

  private loadForm() {
    if (this.formName === 'no-name' || this.formName === undefined) {
      this.loadConfig.getAccessoryToReconfiguration(this.currentUser, this.formName, this.routerParams.state.params.productCode).pipe(takeUntil(this.isDestroyed$))
        .subscribe(accessoryToReconfiguration => {
          this.configuredAccessory = accessoryToReconfiguration;
          this.form = this.fb.group({
            // Wewnętrzne, Zewnętrzne, Montażowe, Automatyka, Pozostałe
            type: new FormControl(this.configuredAccessory.typ, [Validators.required], []),
            kind: new FormControl(this.configuredAccessory.rodzaj, [Validators.required], []),
            framesMatching: new FormControl(null),
            material: new FormControl(this.configuredAccessory.typTkaniny, [], [this.validateMaterial.bind(this)]),
            materialColor: new FormControl(this.configuredAccessory.kolorTkaniny, [], [this.validateMaterialColor.bind(this)]),
            equipmentColor: new FormControl(this.configuredAccessory.roletyKolorOsprzetu, [], [this.validateEquipmentColor.bind(this)]),
            width: new FormControl(this.configuredAccessory.szerokosc),
            height: new FormControl(this.configuredAccessory.wysokosc)
          });
          this.accessoryId = 1;
          this.formChanges();
          this.setConfiguredValues(this.form.value); // Potrzebne do wywołania przy pierwszym wczytaniu, ustawia blokady
          this.formName = this.randomString.randomString(12);
          this.loading = false;
        });
    } else {
      this.configByName$.pipe(takeUntil(this.isDestroyed$))
        .subscribe((accessoryConfig: AccessoryConfig) => {
          this.form = this.fb.group({
            type: new FormControl(accessoryConfig.accessoryFormData.type, [Validators.required], []),
            kind: new FormControl(accessoryConfig.accessoryFormData.kind, [Validators.required], []),
            framesMatching: new FormControl(accessoryConfig.accessoryFormData.framesMatching),
            material: new FormControl(accessoryConfig.accessoryFormData.material, [], [this.validateMaterial.bind(this)]),
            materialColor: new FormControl(accessoryConfig.accessoryFormData.materialColor, [], [this.validateMaterialColor.bind(this)]),
            equipmentColor: new FormControl(accessoryConfig.accessoryFormData.equipmentColor, [], [this.validateEquipmentColor.bind(this)]),
            width: new FormControl(accessoryConfig.accessoryFormData.width),
            height: new FormControl(accessoryConfig.accessoryFormData.height)
          });
          this.configuredAccessory = accessoryConfig.accessory;
          this.accessoryId = accessoryConfig.id;
          this.setConfiguredValues(this.form.value); // Potrzebne do wywołania przy pierwszym wczytaniu, ustawia blokady
          this.formChanges();
          this.loading = false;
        });
    }
  }

  private formChanges() {
    this.formData$ = this.form.valueChanges;
    this.formData$.pipe(
      takeUntil(this.isDestroyed$),
      filter((form: any) => form.type != null),
      map((form: any) => this.setConfiguredValues(form))
    ).subscribe();
  }

  private setConfiguredValues(form) {
    this.showFramesMatchingSetter(form);
    // @ts-ignore
    const temporaryConfigObject: Accessory = {};
    temporaryConfigObject.typ = form.type; // Wewnętrzne - 6, Zewnętrzne - 4, Montażowe - 2, Automatyka - 7, Pozostałe - 6 (pytanie, czy dodawać jeszcze dodatkowy krok - wybór rodziny?)
    temporaryConfigObject.rodzaj = form.kind; // AkcesoriumRoletaW:D37, AkcesoriumRoletaW:D33, AkcesoriumRoletaW:D12, P40, BL, AMO, P50, RZE, RZS,
    temporaryConfigObject.rodzina = this.accessoryValueSetter.getAccessoryFamily(temporaryConfigObject.rodzaj); // Roleta, Moskitiera, ...
    temporaryConfigObject.grupaAsortymentowa = 'Akcesorium';
    temporaryConfigObject.status = '1. Nowy';
    temporaryConfigObject.szerokosc = form.width;
    temporaryConfigObject.wysokosc = form.height;
    temporaryConfigObject.otwieranie = form.opening;
    temporaryConfigObject.dopasowanieRoletySzerokosc = 'Rolety:' + this.accessoryValueSetter.matchingSetter(form.framesMatching).width;
    temporaryConfigObject.dopasowanieRoletyDlugosc = 'Rolety:' + this.accessoryValueSetter.matchingSetter(form.framesMatching).height;
    if (form.type === 'Akcesorium:Zewnętrzne') {
      temporaryConfigObject.typTkaniny = null;
      temporaryConfigObject.kolorTkaniny = null;
      temporaryConfigObject.oblachowanieMaterial = form.material;
      temporaryConfigObject.oblachowanieKolor = form.materialColor;
      temporaryConfigObject.oblachowanieFinisz = 'Akcesorium:Półmat';
    } else {
      temporaryConfigObject.oblachowanieMaterial = null;
      temporaryConfigObject.oblachowanieKolor = null;
      temporaryConfigObject.oblachowanieFinisz = null;
      temporaryConfigObject.typTkaniny = form.material;
      temporaryConfigObject.kolorTkaniny = form.materialColor;
    }
    temporaryConfigObject.roletyKolorOsprzetu = form.equipmentColor;
    temporaryConfigObject.kolorTworzywWew = form.equipmentColor;
    temporaryConfigObject.model = this.accessoryValueSetter.getAccessoryModel(temporaryConfigObject.rodzaj, form.material, form.equipmentColor); // RoletaW:D37T
    temporaryConfigObject.geometria = this.accessoryValueSetter.getAccessoryGeometry(form.kind, form.material, form.equipmentColor); // Akcesorium:D37ZW
    temporaryConfigObject.indeksAlgorytm = this.accessoryValueSetter.getIndexAlgorithm(form.kind);
    temporaryConfigObject.nazwaPLAlgorytm = this.accessoryValueSetter.getNameAlgorithm(form.kind).nameA;
    temporaryConfigObject.productName = this.accessoryValueSetter.getAccessoryName(temporaryConfigObject.model, temporaryConfigObject.szerokosc, temporaryConfigObject.wysokosc,
      temporaryConfigObject.typTkaniny, temporaryConfigObject.kolorTkaniny, temporaryConfigObject.roletyKolorOsprzetu);
    temporaryConfigObject.cennik = 'KO';
    // tslint:disable-next-line:max-line-length
    temporaryConfigObject.kod = this.accessoryValueSetter.generateAccessoryCode(form.type, form.kind, temporaryConfigObject.szerokosc, temporaryConfigObject.wysokosc, temporaryConfigObject.typTkaniny,
      temporaryConfigObject.kolorTkaniny, temporaryConfigObject.roletyKolorOsprzetu, temporaryConfigObject.dopasowanieRoletySzerokosc, temporaryConfigObject.dopasowanieRoletyDlugosc);
    temporaryConfigObject.dostepneRozmiary = [];
    temporaryConfigObject.linkiDoZdjec = [];
    temporaryConfigObject.CenaDetaliczna = this.priceCalculation(temporaryConfigObject);
    temporaryConfigObject.nazwaPozycjiPL = 'Nowe akcesorium z konfiguratora - nazwa do uzupełnienia';
    this.configuredAccessory = JSON.parse(JSON.stringify(temporaryConfigObject));
    this.showWidthMessage = this.standardWidths.includes(form.width);
    this.showHeightMessage = this.standardHeights.includes(form.height);
    this.setDisabled(this.configuredAccessory);
  }

  private priceCalculation(configuredAccessory: Accessory) {
    let accessoryPrice = 0;
    let isStandard = false;
    let index = -1;
    for (let i = 0; i < this.accessoryModelsToCalculationPrice.length; i++) {
      if (this.accessoryModelsToCalculationPrice[i].accessoryModel === configuredAccessory.model) {
        index = i;
      }
    }
    const accessoryToCalculations = this.accessoryModelsToCalculationPrice[index];
    for (const standardAccessory of this.accessoriesFormDataBase) {
      if (standardAccessory.kod === configuredAccessory.kod) {
        accessoryPrice = standardAccessory.CenaDetaliczna;
        isStandard = true;
      }
    }
    if (index > -1 && !isStandard) {
      if (configuredAccessory.typTkaniny) {
        accessoryPrice += this.getAccessoryCircuit(configuredAccessory) * accessoryToCalculations[configuredAccessory.typTkaniny];
      }
      if (configuredAccessory.kolorTkaniny) {
        accessoryPrice += this.getAccessoryCircuit(configuredAccessory) * accessoryToCalculations[configuredAccessory.kolorTkaniny];
      }
    }
    return accessoryPrice;
  }

  private getAccessoryCircuit(configuredAccessory: Accessory) {
    return 2 * configuredAccessory.szerokosc + 2 * configuredAccessory.wysokosc;
  }

  onSubmit() {
    this.newAccessoryConfig = {
      products: {
        windows: null,
        flashings: null,
        accessories: [{
          id: this.accessoryId,
          quantity: 1,
          // TODO zamienić na configuredAccessory po odkomentowaniu blokad formularza
          accessory: this.tempConfiguredAccessory,
          accessoryFormName: this.formName,
          accessoryFormData: this.form.value,
          configLink: String(this.router['location']._platformLocation.location.origin
            + '/' + this.globalId
            + '/' + this.formName
            + '/' + this.configuredAccessory.kod)
        }],
        verticals: null,
        flats: null
      },
      globalId: this.globalId,
      created: new Date(),
      lastUpdate: new Date(),
      user: this.currentUser,
      userId: 1,
      name: '<New configuration>',
      active: true
    };
    this.loading = true;
    if (this.configId === '-1' || this.configId === '') {
      this.userConfigurations$.pipe(
        takeUntil(this.isDestroyed$),
        map((data: Array<any>) => {
          return data.filter(x => x !== null);
        })).subscribe(userConfigurations => {
        this.userConfigs = userConfigurations;
        // this.configFormId = this.userConfigs[0].userId;
        this.configFormId = 1;
        this.highestUserId = this.hd.getHighestIdForUser(userConfigurations);
        this.newAccessoryConfig.userId = this.highestUserId;
        // wersja 2 lub 1
        if (this.userConfigs.length !== 0) {
          this.userConfigs.push(this.newAccessoryConfig);
          this.loading = false;
          this.chooseConfigNamePopup = true;
          // wersja 1
        } else {
          this.newAccessoryConfig.products.accessories.forEach(element => element.configLink = String(
            this.router['location']._platformLocation.location.origin + this.router.url
            + '/' + this.globalId
            + '/' + this.formName
            + '/' + this.configuredAccessory.kod));
          this.store.dispatch(new AddGlobalConfiguration(this.currentUser, this.newAccessoryConfig)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
          this.router.navigate(['/' + this.configurationSummary]);
          this.loading = false;
        }
      });
    } else {
      // wersja 2
      if (this.accessoryId === 1) {
        const temporaryLink = String(
          this.router['location']._platformLocation.location.origin + this.router.url
          + '/' + this.globalId
          + '/' + this.formName
          + '/' + this.configuredAccessory.kod);
        this.store.dispatch(new AddAccessoryConfiguration(this.globalConfiguration, this.configuredAccessory,
          this.formName, this.form.value, temporaryLink))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        // wersja 3
      } else {
        this.store.dispatch(new UpdateAccessoryConfiguration(this.globalConfiguration, this.accessoryId, this.configuredAccessory))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        this.store.dispatch(new UpdateAccessoryFormByFormName(this.globalConfiguration, this.formName, this.form.value))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      }
      this.router.navigate(['/' + this.configurationSummary]);
      this.loading = false;
    }
  }

  chooseConfigId() {
    // wersja 1
    if (this.configFormId === undefined) {
      this.newAccessoryConfig.products.accessories.forEach(element => element.configLink = String(
        this.router['location']._platformLocation.location.origin + this.router.url
        + '/' + this.globalId
        + '/' + this.formName
        + '/' + this.configuredAccessory.kod));
      this.store.dispatch(new AddGlobalConfiguration(this.currentUser, this.newAccessoryConfig))
        .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      // wersja 2
    } else {
      const temporaryLink = String(
        this.router['location']._platformLocation.location.origin
        + '/' + this.globalId
        + '/' + this.formName
        + '/' + this.configuredAccessory.kod);
      this.configId = String('configuration-' + this.configFormId);
      this.globalConfiguration = this.configurations.find(config => config.globalId === this.configId);
      // TODO zamienić na configuredAccessory
      this.store.dispatch(new AddAccessoryConfiguration(this.globalConfiguration,
        this.tempConfiguredAccessory, this.formName, this.form.value, temporaryLink))
        .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
    }
    this.chooseConfigNamePopup = false;
    this.router.navigate(['/' + this.configurationSummary]);
  }

  saveCopyLinkPopUp() {
    let temporaryUrl = '';
    this.loading = true;
    this.copyLinkToConfigurationPopup = true;
    this.newAccessoryConfig = {
      products: {
        windows: null,
        flashings: null,
        accessories: [{
          id: this.accessoryId,
          quantity: 1,
          accessory: this.configuredAccessory,
          accessoryFormName: this.formName,
          accessoryFormData: this.form.value,
          configLink: String(this.router['location']._platformLocation.location.origin
            + '/' + this.globalId
            + '/' + this.formName
            + '/' + this.configuredAccessory.kod)
        }],
        verticals: null,
        flats: null
      },
      globalId: this.globalId,
      created: new Date(),
      lastUpdate: new Date(),
      user: 'anonym',
      userId: 0,
      name: 'temporary',
      active: true
    };
    // wersja 2 lub 3
    if (this.configId === this.globalId) {
      temporaryUrl = this.router['location']._platformLocation.location.origin
        + '/' + this.globalId
        + '/' + this.formName
        + '/' + this.configuredAccessory.kod;
      // wersja 2
      if (this.accessoryId === 1) {
        this.store.dispatch(new AddAccessoryConfiguration(this.globalConfiguration, this.configuredAccessory,
          this.formName, this.form.value, temporaryUrl))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        // wersja 3
      } else {
        this.store.dispatch(new UpdateAccessoryConfiguration(this.globalConfiguration, this.accessoryId, this.configuredAccessory))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      }
      // wersja 1
    } else {
      this.newAccessoryConfig.products.accessories.forEach(element => element.configLink = String(
        this.router['location']._platformLocation.location.origin + this.router.url
        + '/' + this.globalId
        + '/' + this.formName
        + '/' + this.configuredAccessory.kod));
      this.store.dispatch(new AddGlobalConfiguration('anonym', this.newAccessoryConfig))
        .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      temporaryUrl = this.router['location']._platformLocation.location.origin + this.router.url
        + '/' + this.newAccessoryConfig.globalId
        + '/' + this.newAccessoryConfig.products.accessories[0].accessoryFormName
        + '/' + this.newAccessoryConfig.products.accessories[0].accessory.kod;
    }
    this.urlToSaveConfiguration = temporaryUrl;
    this.loading = false;
  }

  resetConfigForm() {
    this.router.navigate(['/' + this.accessoriesConfigurator]);
  }

  hidePopup() {
    this.chooseConfigNamePopup = false;
  }

  closeCopyLinkPopUp() {
    this.chooseConfigNamePopup = false;
    this.copyLinkToConfigurationPopup = false;
  }

  // VALIDATORS
  validateMaterial<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let errors = {
        'empty material': true
      };
      this.configOptionsLoaded$.pipe(takeUntil(this.isDestroyed$)).subscribe(loaded => {
        if (loaded) {
          for (const option of this.configOptions.materials) {
            if (control.value === option) {
              errors = null;
            }
          }
          observer.next(errors);
          observer.complete();
        }
      });
    });
  }

  validateMaterialColor<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let errors = {
        'empty material color': true
      };
      this.configOptionsLoaded$.pipe(takeUntil(this.isDestroyed$)).subscribe(loaded => {
        if (loaded) {
          for (const option of this.configOptions.materialColors) {
            if (control.value === option) {
              errors = null;
            }
          }
          observer.next(errors);
          observer.complete();
        }
      });
    });
  }

  validateEquipmentColor<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let errors = {
        'empty equipment color': true
      };
      this.configOptionsLoaded$.pipe(takeUntil(this.isDestroyed$)).subscribe(loaded => {
        if (loaded) {
          for (const option of this.configOptions.equipmentColors) {
            if (control.value === option) {
              errors = null;
            }
          }
          observer.next(errors);
          observer.complete();
        }
      });
    });
  }

  // DISABLE INPUT SETTER LOGIC
  private resetAllArrays(accessoryTypes: { option: string, disabled: boolean }[], accessoryKinds: { option: string, disabled: boolean }[], accessoryMaterials: { option: string, disabled: boolean }[],
                         materialColors: { option: string, disabled: boolean }[], equipmentColors: { option: string, disabled: boolean }[]) {
    for (const accessoryType of accessoryTypes) {
      accessoryType.disabled = null;
    }
    for (const accessoryKind of accessoryKinds) {
      accessoryKind.disabled = null;
    }
    for (const accessoryMaterial of accessoryMaterials) {
      accessoryMaterial.disabled = null;
    }
    for (const materialColor of materialColors) {
      materialColor.disabled = null;
    }
    for (const equipmentColor of equipmentColors) {
      equipmentColor.disabled = null;
    }
  }

  setDisabled(configuredAccessory: Accessory) {
    this.resetAllArrays(this.accessoryTypes, this.accessoryKinds, this.accessoryMaterials, this.materialColors, this.equipmentColors);
    this.excludeOptions$.pipe(takeUntil(this.isDestroyed$)).subscribe((exclusions) => {
      const excludedOptions = [];
      // tslint:disable-next-line:forin
      for (const configurationOption in configuredAccessory) {
        for (const exclusionObject of exclusions) {
          if (exclusionObject.selectedOption === configuredAccessory[configurationOption]) {
            for (const [key, value] of Object.entries(exclusionObject)) {
              if (value === 'TRUE') {
                if (excludedOptions.indexOf(key) === -1) {
                  excludedOptions.push(key);
                }
              }
            }
          }
        }
      }
      this.setDisabledOptions(excludedOptions, this.accessoryTypes, this.accessoryKinds, this.accessoryMaterials, this.materialColors, this.equipmentColors);
    });
  }

  private setDisabledOptions(excludedOptions: string[], accessoryTypes: { option: string; disabled: boolean }[], accessoryKinds: { option: string; disabled: boolean }[],
                             accessoryMaterials: { option: string; disabled: boolean }[], materialColors: { option: string; disabled: boolean }[],
                             equipmentColors: { option: string; disabled: boolean }[]) {
    for (const excludedOption of excludedOptions) {
      for (const accessoryType of accessoryTypes) {
        if (accessoryType.option === excludedOption) {
          accessoryType.disabled = true;
        }
      }
      for (const accessoryKind of accessoryKinds) {
        if (accessoryKind.option === excludedOption) {
          accessoryKind.disabled = true;
        }
      }
      for (const accessoryMaterial of accessoryMaterials) {
        if (accessoryMaterial.option === excludedOption) {
          accessoryMaterial.disabled = true;
        }
      }
      for (const materialColor of materialColors) {
        if (materialColor.option === excludedOption) {
          materialColor.disabled = true;
        }
      }
      for (const equipmentColor of equipmentColors) {
        if (equipmentColor.option === excludedOption) {
          equipmentColor.disabled = true;
        }
      }
    }
  }

  // Options toggle
  onHoverClick(divEle: HTMLDivElement, arrayLength: number, visibility: boolean) {
    if (!visibility) {
      divEle.style.maxHeight = '0';
      divEle.style.transition = 'all .7s ease-in-out';
    } else {
      divEle.style.maxHeight = arrayLength * 105 + 120 + 'px';
      divEle.style.transition = 'all .7s ease-in-out';
    }
    const scrollCorrection = window.scrollY === 0 ? 200 : window.scrollY;
    window.scrollTo({top: divEle.getBoundingClientRect().top - scrollCorrection, behavior: 'smooth'});
  }

  closeAllHovers(htmlDivElements: HTMLDivElement[]) {
    this.typeVisible = false;
    this.kindVisible = false;
    this.materialVisible = false;
    this.colorVisible = false;
    this.dimensionVisible = false;
    for (const element of htmlDivElements) {
      element.style.maxHeight = '0';
      element.style.transition = 'all .7s ease-in-out';
    }
  }

  onTypeHover(typeOptions: HTMLDivElement) {
    this.typeVisible = !this.typeVisible;
    this.onHoverClick(typeOptions, this.accessoryTypes.length, this.typeVisible);
  }

  onKindHover(kindOptions: HTMLDivElement) {
    this.kindVisible = !this.kindVisible;
    this.onHoverClick(kindOptions, this.accessoryKinds.length + this.framesMatchings.length + 1, this.kindVisible);
  }

  onMaterialHover(materialOptions: HTMLDivElement) {
    this.materialVisible = !this.materialVisible;
    this.onHoverClick(materialOptions, this.accessoryMaterials.length, this.materialVisible);
  }

  onColorHover(colorOptions: HTMLDivElement) {
    this.colorVisible = !this.colorVisible;
    this.onHoverClick(colorOptions, this.materialColors.length + this.equipmentColors.length + 1, this.colorVisible);
  }

  onDimensionsHover(dimensionOption: HTMLDivElement) {
    this.dimensionVisible = !this.dimensionVisible;
    this.onHoverClick(dimensionOption, 3, this.dimensionVisible);
  }

  openModal(text: string, event: MouseEvent) {
    this.modal.open(text, event);
  }

  closeModal(text: string) {
    this.modal.close(text);
  }

  returnCurrencyName(currency: string) {
    if (currency === 'EUR') {
      return '€';
    } else {
      return 'zł';
    }
  }

  setBackgroundImage(option: string) {
    option = option.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\u0142/g, 'l');
    const twoParts = option.split(':');
    let fileName = '';
    if (twoParts[1] === undefined || twoParts[1] === 'TRUE') {
      fileName = twoParts[0];
    } else {
      fileName = twoParts[1];
    }
    return {
      ['background-image']: 'url("assets/img/configurator/accessory_configurator/central_options_pictures/' + fileName + '.png")',
      ['background-size']: 'contain',
      ['background-repeat']: 'no-repeat'
    };
  }

  builtNameForTranslation(option: string) {
    return String('ACCESSORY-DATA.' + option);
  }

  builtNameForColor(option: string) {
    if (option === 'Aluminium:RAL7022') {
      return this.builtNameForTranslation(option);
    }
    return option.split(':')[1];
  }

  navigateToShop() {
    const accessoryInfo = new Subject();
    const flashingInfoChange$ = accessoryInfo.asObservable();
    accessoryInfo.next([
      this.configuredAccessory.model,
      this.configuredAccessory.szerokosc,
      this.configuredAccessory.wysokosc]);
    this.router.navigate(['/' + this.shopAccessoryLink]);
  }

  showFramesMatchingSetter(form) {
    if (form.kind === 'AkcesoriumRoletaW:D37' ||
      form.kind === 'AkcesoriumRoletaW:D33' ||
      form.kind === 'AkcesoriumRoletaW:D12' ||
      form.kind === 'AkcesoriumRoletaW:P40') {
      this.showFramesMatching = null;
    } else {
      this.showFramesMatching = true;
    }
  }
}
