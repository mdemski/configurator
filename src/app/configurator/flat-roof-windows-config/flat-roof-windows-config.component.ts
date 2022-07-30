import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Observer, Subject, Subscription} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {RouterState} from '@ngxs/router-plugin';
import {CartState} from '../../store/cart/cart.state';
import {AppState} from '../../store/app/app.state';
import {ConfigurationState} from '../../store/configuration/configuration.state';
import {SingleConfiguration} from '../../models/single-configuration';
import {FlatRoofWindowState} from '../../store/flat-roof-window/flat-roof-window.state';
import {FlatRoofWindow} from '../../models/flat-roof-window';
import {AvailableConfigDataState} from '../../store/avaiable-config-data/available-config-data.state';
import {LoadConfigurationService} from '../../services/load-configuration.service';
import {HighestIdGetterService} from '../../services/highest-id-getter.service';
import {RandomStringGeneratorService} from '../../services/random-string-generator.service';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {filter, map, pairwise, startWith, takeUntil, tap} from 'rxjs/operators';
import {FlatConfig} from '../../models/flat-config';
import {FlatValueSetterService} from '../../services/flat-value-setter.service';
import {
  AddFlatRoofConfiguration, AddGlobalConfiguration,
  UpdateFlatRoofConfiguration, UpdateFlatRoofFormByFormName,
} from '../../store/configuration/configuration.actions';

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
              private flatRoofWindowValueSetter: FlatValueSetterService,
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
  configByName$: Observable<FlatConfig>;
  configOptions;
  configurationSummary: string;
  configuredFlatRoofWindow: FlatRoofWindow;
  chooseConfigNamePopup = false;
  configFormId: number;
  form: FormGroup;
  private formName: string;
  formDataForFlatRoofWindow$;
  userConfigs = [];
  copyLinkToConfigurationPopup = false;
  urlToSaveConfiguration: string;
  flatRoofWindowsConfigurator: string;
  showWidthMessage = false;
  showHeightMessage = false;
  private flatRoofWindowsFromDataBase: FlatRoofWindow[];
  private routerParams = null;
  private globalId = '';
  private highestUserId;
  private currentUser: string;
  private flatId: number;
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
        this.openingTypes = this.objectMaker(this.configOptions.openingTypes);
        this.outerMaterials = this.objectMaker(this.configOptions.outerMaterials);
        this.outerColors = this.objectMaker(this.configOptions.outerColors);
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
      this.flatRoofWindowsConfigurator = text.configuratorFlatRoofWindow;
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

  private loadForm() {
    if (this.formName === 'no-name' || this.formName === undefined) {
      this.loadConfig.getFlarRoofWindowToReconfiguration(this.currentUser, this.formName, this.routerParams.state.params.productCode).pipe(takeUntil(this.isDestroyed$))
        .subscribe(flatRoofWindowToReconfiguration => {
          this.configuredFlatRoofWindow = flatRoofWindowToReconfiguration;
          this.form = this.fb.group({
            openingType: new FormControl(this.configuredFlatRoofWindow.otwieranie, [], [this.validateOpenings.bind(this)]),
            option: new FormControl(null), // LED option
            glazing: new FormControl(this.configuredFlatRoofWindow.pakietSzybowy, [], [this.validateGlazing.bind(this)]),
            width: new FormControl(this.configuredFlatRoofWindow.szerokosc),
            height: new FormControl(this.configuredFlatRoofWindow.wysokosc),
            outer: new FormGroup({
              outerMaterial: new FormControl(this.configuredFlatRoofWindow.oblachowanieMaterial),
              outerColor: new FormControl(this.configuredFlatRoofWindow.oblachowanieKolor),
              outerColorFinish: new FormControl(this.configuredFlatRoofWindow.oblachowanieFinisz)
            }, [], [this.validateOuterMaterial.bind(this)]),
            closure: new FormGroup({
              handle: new FormControl(this.configuredFlatRoofWindow.zamkniecieTyp, [], [this.validateHandle.bind(this)]),
              handleColor: new FormControl(this.configuredFlatRoofWindow.zamkniecieKolor)
            }),
            extras: new FormArray(this.builtExtrasArray(this.extrasFromFile))
          });
          this.flatId = 1;
          this.formChanges();
          this.setConfiguredValues(this.form.value);
          this.formName = this.randomString.randomString(12);
          this.loading = false;
        });
    } else {
      this.configByName$.pipe(takeUntil(this.isDestroyed$))
        .subscribe((flatRoofWindowConfig: FlatConfig) => {
          this.form = this.fb.group({
            openingType: new FormControl(flatRoofWindowConfig.flatFormData.openingType, [], [this.validateOpenings.bind(this)]),
            option: new FormControl(flatRoofWindowConfig.flatFormData.option),
            glazing: new FormControl(flatRoofWindowConfig.flatFormData.glazing, [], [this.validateGlazing.bind(this)]),
            width: new FormControl(flatRoofWindowConfig.flatFormData.width),
            height: new FormControl(flatRoofWindowConfig.flatFormData.height),
            outer: new FormGroup({
              outerMaterial: new FormControl(flatRoofWindowConfig.flatFormData.outer
              === undefined ? null : flatRoofWindowConfig.flatFormData.outer.outerMaterial),
              outerColor: new FormControl(flatRoofWindowConfig.flatFormData.outer
              === undefined ? null : flatRoofWindowConfig.flatFormData.outer.outerColor),
              outerColorFinish: new FormControl(flatRoofWindowConfig.flatFormData.outer
              === undefined ? null : flatRoofWindowConfig.flatFormData.outer.outerColorFinish)
            }, [], [this.validateOuterMaterial.bind(this)]),
            closure: new FormGroup({
              handle: new FormControl(flatRoofWindowConfig.flatFormData.closure
              === undefined ? null : flatRoofWindowConfig.flatFormData.closure.handle, [], [this.validateHandle.bind(this)]),
              handleColor: new FormControl(flatRoofWindowConfig.flatFormData.closure
              === undefined ? null : flatRoofWindowConfig.flatFormData.closure.handleColor)
            }),
            extras: this.fb.array(flatRoofWindowConfig.flatFormData.extras)
          });
          this.configuredFlatRoofWindow = flatRoofWindowConfig.flat;
          this.flatId = flatRoofWindowConfig.id;
          this.setConfiguredValues(this.form.value);
          this.formChanges();
          this.loading = false;
        });
    }
  }

  get extras(): FormArray {
    return this.form.get('extras') as FormArray;
  }

  private builtExtrasArray(extrasFromFile: any[]) {
    const extras = [];
    extrasFromFile.forEach((x, index) => {
      if (this.configuredFlatRoofWindow.listaDodatkow === undefined) {
        extras.push(new FormControl(false));
      } else {
        if (this.configuredFlatRoofWindow.listaDodatkow[index] === x.option) {
          extras.push(new FormControl(true));
        } else {
          extras.push(new FormControl(false));
        }
      }
    });
    return extras;
  }

  formChanges() {
    this.formDataForFlatRoofWindow$ = this.form.valueChanges; // strumień z danymi z formularza
    this.formDataForFlatRoofWindow$.pipe(
      takeUntil(this.isDestroyed$),
      startWith([]),
      pairwise(),
      filter(([prevForm, form]: [any, any]) => form.openingType !== null),
      tap(() => {
        const checkboxExtraControl = this.extras as FormArray;
        this.subscription = checkboxExtraControl.valueChanges.subscribe(() => {
          checkboxExtraControl.setValue(checkboxExtraControl.value.map((value, i) =>
            value ? this.extrasFromFile[i].option : false), {emitEvent: false});
        });
      }),
      map(([prevForm, form]: [any, any]) => {
        this.setConfiguredValues(form);
      })).subscribe();
  }

  private setConfiguredValues(form) {
    // @ts-ignore
    const temporaryConfigObject: FlatRoofWindow = {};
    temporaryConfigObject.model = this.flatRoofWindowValueSetter.getWindowModel(form.openingType, form.option);
    temporaryConfigObject.grupaAsortymentowa = 'DachPłaski';
    temporaryConfigObject.pakietSzybowy = form.glazing;
    temporaryConfigObject.glazingToCalculation = form.glazing;
    temporaryConfigObject.status = '1. Nowy';
    temporaryConfigObject.szerokosc = form.width;
    temporaryConfigObject.wysokosc = form.height;
    temporaryConfigObject.productName = this.flatRoofWindowValueSetter.getModelName(temporaryConfigObject);
    temporaryConfigObject.indeksAlgorytm = 'I-PŁASKI';
    temporaryConfigObject.nazwaPLAlgorytm = 'NPL-OKNO';
    temporaryConfigObject.typ = 'DachPłaski:Okno';
    temporaryConfigObject.geometria = 'PG';
    temporaryConfigObject.otwieranie = form.openingType;
    temporaryConfigObject.stolarkaMaterial = form.material;
    temporaryConfigObject.stolarkaKolor = 'PVC:Biały9016';
    temporaryConfigObject.oblachowanieMaterial = form.outer.outerMaterial;
    temporaryConfigObject.oblachowanieKolor = form.outer.outerColor;
    temporaryConfigObject.oblachowanieFinisz = form.outer.outerColorFinish;
    temporaryConfigObject.rodzina = 'DachPłaski:PG';
    temporaryConfigObject.rodzaj = this.flatRoofWindowValueSetter.getWindowGroup(form.openingType);
    temporaryConfigObject.zamkniecieTyp = form.closure.handle;
    temporaryConfigObject.zamkniecieKolor = form.closure.handleColor;
    temporaryConfigObject.uszczelki = 1;
    temporaryConfigObject.windowCoats = [];
    temporaryConfigObject.listaDodatkow = form.extras;
    temporaryConfigObject.kolorTworzywWew = 'Okno:RAL9016';
    temporaryConfigObject.kolorTworzywZew = 'Okno:RAL7048';
    temporaryConfigObject.numberOfGlasses = this.flatRoofWindowValueSetter.getNumberOfGlasses(temporaryConfigObject);
    temporaryConfigObject.cennik = 'KO';
    temporaryConfigObject.kod = this.flatRoofWindowValueSetter.generateWindowCode(temporaryConfigObject.otwieranie, form.option,
      temporaryConfigObject.pakietSzybowy, temporaryConfigObject.stolarkaKolor,
      temporaryConfigObject.oblachowanieMaterial, temporaryConfigObject.oblachowanieKolor, temporaryConfigObject.oblachowanieFinisz,
      temporaryConfigObject.szerokosc, temporaryConfigObject.wysokosc);
    temporaryConfigObject.CenaDetaliczna = this.priceCalculation(temporaryConfigObject);
    temporaryConfigObject.windowUG = this.flatRoofWindowValueSetter.getUwAndUgValues(temporaryConfigObject).windowUG;
    temporaryConfigObject.windowUW = this.flatRoofWindowValueSetter.getUwAndUgValues(temporaryConfigObject).windowUW;
    temporaryConfigObject.dostepneRozmiary = [];
    temporaryConfigObject.linkiDoZdjec = [];
    temporaryConfigObject.iloscSprzedanychRok = 0;
    temporaryConfigObject.nazwaPozycjiPL = 'Nowe okno na płaski dach z konfiguratora - nazwa do uzupełnienia';
    this.configuredFlatRoofWindow = JSON.parse(JSON.stringify(temporaryConfigObject));
    this.showWidthMessage = this.standardWidths.includes(form.width);
    this.showHeightMessage = this.standardHeights.includes(form.height);
    this.setDisabled(this.configuredFlatRoofWindow);
    console.log(this.configuredFlatRoofWindow.kod);
  }

  priceCalculation(configuredFlatRoofWindow: FlatRoofWindow) {
    // ... spread operator pozwala nie zagnieżdżać jendego elementu w drugi
    // tempArray.push({...data[book], id: book});
    let windowPrice = 0;
    let isStandard = false;
    let index = -1;
    for (let i = 0; i < this.flatRoofWindowModelsToCalculatePrice.length; i++) {
      if (this.flatRoofWindowModelsToCalculatePrice[i].windowModel === configuredFlatRoofWindow.model) {
        index = i;
      }
    }
    const windowToCalculations = this.flatRoofWindowModelsToCalculatePrice[index];
    for (const standardRoofWindow of this.flatRoofWindowsFromDataBase) {
      if (standardRoofWindow.kod === configuredFlatRoofWindow.kod) {
        windowPrice = standardRoofWindow.CenaDetaliczna;
        isStandard = true;
        for (const extra of configuredFlatRoofWindow.listaDodatkow) {
          if (extra !== false) {
            windowPrice += +windowToCalculations[extra];
          }
        }
      }
    }
    if (index > -1 && !isStandard) {
      if (configuredFlatRoofWindow.pakietSzybowy) {
        windowPrice += this.getWindowCircuit(configuredFlatRoofWindow) * windowToCalculations[configuredFlatRoofWindow.glazingToCalculation];
      }
      if (configuredFlatRoofWindow.oblachowanieMaterial) {
        windowPrice += this.getWindowCircuit(configuredFlatRoofWindow) * windowToCalculations[configuredFlatRoofWindow.oblachowanieMaterial];
      }
      if (configuredFlatRoofWindow.oblachowanieKolor) {
        windowPrice += this.getWindowCircuit(configuredFlatRoofWindow) * windowToCalculations[configuredFlatRoofWindow.oblachowanieKolor];
      }
      if (configuredFlatRoofWindow.oblachowanieFinisz) {
        windowPrice += this.getWindowCircuit(configuredFlatRoofWindow) * windowToCalculations[configuredFlatRoofWindow.oblachowanieFinisz];
      }
      for (const extra of configuredFlatRoofWindow.listaDodatkow) {
        if (extra !== false) {
          windowPrice += +windowToCalculations[extra];
        }
      }
      if (configuredFlatRoofWindow.zamkniecieTyp) {
        windowPrice += +windowToCalculations[configuredFlatRoofWindow.zamkniecieTyp];
      }
      if (windowToCalculations) {
        this.minWidth = windowToCalculations.minSzerokosc;
        this.maxWidth = windowToCalculations.maxSzerokosc;
        this.minHeight = windowToCalculations.minWysokosc;
        this.maxHeight = windowToCalculations.maxWysokosc;
      }
    }
    return windowPrice;
  }

  builtNameForTranslation(option: string) {
    return String('ROOF-WINDOWS-DATA.' + option);
  }

  returnCurrencyName(currency: string) {
    if (currency === 'EUR') {
      return '€';
    } else {
      return 'zł';
    }
  }

  resetConfigForm() {
    this.router.navigate(['/' + this.flatRoofWindowsConfigurator]);
  }

  // VALIDATORS
  validateOpenings<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let errors = {
        'empty openingType': true
      };
      this.configOptionsLoaded$.pipe(takeUntil(this.isDestroyed$)).subscribe(loaded => {
        if (loaded) {
          for (const option of this.configOptions.openingTypes) {
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

  validateGlazing<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let errors = {
        'empty glazingType': true
      };
      this.configOptionsLoaded$.pipe(takeUntil(this.isDestroyed$)).subscribe(loaded => {
        if (loaded) {
          for (const option of this.configOptions.glazingTypes) {
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

  validateOuterMaterial<AsyncValidatorFn>(group: FormGroup) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let errors = {
        'empty outerMaterial': true
      };

      this.configOptionsLoaded$.pipe(takeUntil(this.isDestroyed$)).subscribe(loaded => {
        if (loaded) {
          for (const option of this.configOptions.outerMaterials) {
            if (group.controls.outerMaterial.value === option) {
              errors = null;
            }
          }
          // TODO odkomentować kod po wprowadzeniu listy zewnętrznych kolorów
          // for (const option of this.configOptions.outerColors) {
          //   if (group.controls.outerMaterial.value === option) {
          //     errors = null;
          //   }
          // }
          for (const option of this.configOptions.outerColorFinishes) {
            if (group.controls.outerMaterial.value === option) {
              errors = null;
            }
          }
          observer.next(errors);
          observer.complete();
        }
      });
    });
  }

  validateHandle<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let errors = {
        'empty handle': true
      };
      this.configOptionsLoaded$.pipe(takeUntil(this.isDestroyed$)).subscribe(loaded => {
        if (loaded) {
          for (const option of this.configOptions.handles) {
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

  // CALCULATIONS
  getWindowCircuit(configuredWindow) {
    return 2 * configuredWindow.szerokosc + 2 * configuredWindow.wysokosc;
  }

  onSubmit() {
    this.newWindowConfig = {
      products: {
        windows: null,
        flashings: null,
        accessories: null,
        verticals: null,
        flats: [{
          id: this.flatId,
          quantity: 1,
          flat: this.configuredFlatRoofWindow,
          flatFormName: this.formName,
          flatFormData: this.form.value,
          configLink: String(this.router['location']._platformLocation.location.origin
            + '/' + this.globalId
            + '/' + this.formName
            + '/' + this.configuredFlatRoofWindow.kod)
        }]
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
        this.newWindowConfig.userId = this.highestUserId;
        // wersja 2 lub 1
        if (this.userConfigs.length !== 0) {
          this.userConfigs.push(this.newWindowConfig);
          this.loading = false;
          this.chooseConfigNamePopup = true;
          // wersja 1
        } else {
          this.newWindowConfig.products.flats.forEach(element => element.configLink = String(
            this.router['location']._platformLocation.location.origin + this.router.url
            + '/' + this.globalId
            + '/' + this.formName
            + '/' + this.configuredFlatRoofWindow.kod));
          this.store.dispatch(new AddGlobalConfiguration(this.currentUser, this.newWindowConfig)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
          this.router.navigate(['/' + this.configurationSummary]);
          this.loading = false;
        }
      });
    } else {
      // wersja 2
      if (this.flatId === 1) {
        const temporaryLink = String(
          this.router['location']._platformLocation.location.origin + this.router.url
          + '/' + this.globalId
          + '/' + this.formName
          + '/' + this.configuredFlatRoofWindow.kod);
        this.store.dispatch(new AddFlatRoofConfiguration(this.globalConfiguration, this.configuredFlatRoofWindow,
          this.formName, this.form.value, temporaryLink))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        // wersja 3
      } else {
        this.store.dispatch(new UpdateFlatRoofConfiguration(this.globalConfiguration, this.flatId, this.configuredFlatRoofWindow))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        this.store.dispatch(new UpdateFlatRoofFormByFormName(this.globalConfiguration, this.formName, this.form.value))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      }
      this.router.navigate(['/' + this.configurationSummary]);
      this.loading = false;
    }
  }

  hidePopup() {
    this.chooseConfigNamePopup = false;
  }

  chooseConfigId() {
    // wersja 1
    if (this.configFormId === undefined) {
      this.newWindowConfig.products.flats.forEach(element => element.configLink = String(
        this.router['location']._platformLocation.location.origin + this.router.url
        + '/' + this.globalId
        + '/' + this.formName
        + '/' + this.configuredFlatRoofWindow.kod));
      this.store.dispatch(new AddGlobalConfiguration(this.currentUser, this.newWindowConfig))
        .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      // wersja 2
    } else {
      const temporaryLink = String(
        this.router['location']._platformLocation.location.origin
        + '/' + this.globalId
        + '/' + this.formName
        + '/' + this.configuredFlatRoofWindow.kod);
      this.configId = String('configuration-' + this.configFormId);
      this.globalConfiguration = this.configurations.find(config => config.userId === this.configFormId && config.user === this.currentUser);
      this.store.dispatch(new AddFlatRoofConfiguration(this.globalConfiguration,
        this.configuredFlatRoofWindow, this.formName, this.form.value, temporaryLink))
        .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
    }
    this.chooseConfigNamePopup = false;
    this.router.navigate(['/' + this.configurationSummary]);
  }

  saveCopyLinkPopUp() {
    let temporaryUrl = '';
    this.loading = true;
    this.copyLinkToConfigurationPopup = true;
    this.newWindowConfig = {
      products: {
        windows: null,
        flashings: null,
        accessories: null,
        verticals: null,
        flats: [{
          id: this.flatId,
          quantity: 1,
          flat: this.configuredFlatRoofWindow,
          flatFormName: this.formName,
          flatFormData: this.form.value,
          configLink: String(this.router['location']._platformLocation.location.origin
            + '/' + this.globalId
            + '/' + this.formName
            + '/' + this.configuredFlatRoofWindow.kod)
        }]
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
        + '/' + this.configuredFlatRoofWindow.kod;
      // wersja 2
      if (this.flatId === 1) {
        this.store.dispatch(new AddFlatRoofConfiguration(this.globalConfiguration, this.configuredFlatRoofWindow,
          this.formName, this.form.value, temporaryUrl))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        // wersja 3
      } else {
        this.store.dispatch(new UpdateFlatRoofConfiguration(this.globalConfiguration, this.flatId, this.configuredFlatRoofWindow))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      }
      // wersja 1
    } else {
      this.newWindowConfig.products.flats.forEach(element => element.configLink = String(
        this.router['location']._platformLocation.location.origin + this.router.url
        + '/' + this.globalId
        + '/' + this.formName
        + '/' + this.configuredFlatRoofWindow.kod));
      this.store.dispatch(new AddGlobalConfiguration('anonym', this.newWindowConfig))
        .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      temporaryUrl = this.router['location']._platformLocation.location.origin + this.router.url
        + '/' + this.newWindowConfig.globalId
        + '/' + this.newWindowConfig.products.flats[0].flatFormName
        + '/' + this.newWindowConfig.products.flats[0].flat.kod;
    }
    this.urlToSaveConfiguration = temporaryUrl;
    this.loading = false;
  }

  // CSS STYLING
  setBackgroundImage(value: string) {
    let fileName = '';
    const twoParts = value.split(':');
    if (twoParts[1] === undefined || twoParts[1] === 'TRUE') {
      fileName = twoParts[0];
    } else {
      fileName = twoParts[1];
    }
    if (value === 'Miedź:Natur') {
      fileName = 'Miedź-Kolor';
    }
    if (value === 'TytanCynk:Natur') {
      fileName = 'TytanCynk-Kolor';
    }
    return {
      ['background-image']: 'url("assets/img/configurator/flat_roof_window_configurator/central_options_pictures/' + fileName + '.png")',
      ['background-size']: 'contain',
      ['background-repeat']: 'no-repeat'
    };
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

  onOpeningHover(openingOptions: HTMLDivElement) {
    this.openingVisible = !this.openingVisible;
    this.onHoverClick(openingOptions, this.openingTypes.length + 3, this.openingVisible);
  }

  onGlazingHover(glazingOptions: HTMLDivElement) {
    this.glazingVisible = !this.glazingVisible;
    this.onHoverClick(glazingOptions, this.glazingTypes.length, this.glazingVisible);
  }

  onDimensionsHover(dimensionOption: HTMLDivElement) {
    this.dimensionsVisible = !this.dimensionsVisible;
    this.onHoverClick(dimensionOption, 3, this.dimensionsVisible);
  }

  onOuterMaterialHover(outerMaterial: HTMLDivElement) {
    this.outerMaterialVisible = !this.outerMaterialVisible;
    const length = this.outerColors.length + this.outerMaterials.length + this.outerColorFinishes.length + 1;
    this.onHoverClick(outerMaterial, length, this.outerMaterialVisible);
  }

  onHandleHover(handleOptions: HTMLDivElement) {
    this.handleVisible = !this.handleVisible;
    const length = this.handles.length + 1;
    this.onHoverClick(handleOptions, length, this.handleVisible);
  }

  onExtrasHover(extrasOptions: HTMLDivElement) {
    this.extrasVisible = !this.extrasVisible;
    this.onHoverClick(extrasOptions, this.extrasFromFile.length + 5, this.extrasVisible);
  }

  moveWidthOutput(outputWidth: HTMLOutputElement) {
    const width = this.form.value.width;
    const newWidth = Number((width - this.minWidth) * 100 / (this.maxWidth - this.minWidth));
    outputWidth.style.left = ((newWidth * 0.35) + (3.5 - newWidth * 0.07)) + 'rem';
  }

  moveHeightOutput(outputHeight: HTMLOutputElement) {
    const height = this.form.value.height;
    const newHeight = Number((height - this.minHeight) * 100 / (this.maxHeight - this.minHeight));
    outputHeight.style.left = ((newHeight * 0.35) + (3.5 - newHeight * 0.07)) + 'rem';
  }

  closeAllHovers(htmlDivElements: HTMLDivElement[]) {
    this.materialVisible = false;
    this.openingVisible = false;
    this.dimensionsVisible = false;
    this.glazingVisible = false;
    this.outerMaterialVisible = false;
    this.handleVisible = false;
    this.extrasVisible = false;
    for (const element of htmlDivElements) {
      element.style.maxHeight = '0';
      element.style.transition = 'all .7s ease-in-out';
    }
  }

  changeCheckBoxState() {
    this.setDisabled(this.configuredFlatRoofWindow);
  }

  closeCopyLinkPopUp() {
    this.chooseConfigNamePopup = false;
    this.copyLinkToConfigurationPopup = false;
  }

  // DISABLE INPUT SETTER LOGIC
  resetAllArrays(openingTypes: { option: string; disabled: boolean }[], outerMaterials: { option: string; disabled: boolean }[],
                 outerColors: { option: string; disabled: boolean }[], outerColorFinishes: { option: string; disabled: boolean }[],
                 glazingTypes: { option: string; disabled: boolean }[], extras: { option: string; disabled: boolean }[],
                 handles: { option: string; disabled: boolean }[]) {
    for (const openingType of openingTypes) {
      openingType.disabled = null;
    }
    for (const outerMaterial of outerMaterials) {
      outerMaterial.disabled = null;
    }
    for (const outerColor of outerColors) {
      outerColor.disabled = null;
    }
    for (const outerColorFinish of outerColorFinishes) {
      outerColorFinish.disabled = null;
    }
    for (const glazingType of glazingTypes) {
      glazingType.disabled = null;
    }
    for (const chosenExtra of extras) {
      chosenExtra.disabled = null;
    }
    for (const handle of handles) {
      handle.disabled = null;
    }
  }

  setDisabled(configuredFlatRoofWindow: FlatRoofWindow) {
    this.resetAllArrays(this.openingTypes, this.outerMaterials, this.outerColors, this.outerColorFinishes,
      this.glazingTypes, this.extrasFromFile, this.handles);
    this.excludeOptions$.pipe(takeUntil(this.isDestroyed$)).subscribe(exclusions => {
      const excludedOptions = [];
      for (const configurationOption in configuredFlatRoofWindow) {
        if (configurationOption === '_kolorTworzywZew') {
          continue;
        }
        if (configurationOption === '_kolorTworzywWew') {
          continue;
        }
        if (configurationOption === '_listaDodatkow') {
          for (const chosenExtra of configuredFlatRoofWindow['_listaDodatkow']) {
            for (const exclusionObject of exclusions) {
              if (exclusionObject.selectedOption === chosenExtra) {
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
        } else {
          for (const exclusionObject of exclusions) {
            if (exclusionObject.selectedOption === configuredFlatRoofWindow[configurationOption]) {
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
      }
      this.setDisabledOptions(excludedOptions, this.openingTypes,
        this.outerMaterials, this.outerColors, this.outerColorFinishes,
        this.glazingTypes, this.extrasFromFile, this.handles);
    });
  }

  setDisabledOptions(excludedOptions: string[], openingTypes: { option: string; disabled: boolean }[], outerMaterials: { option: string; disabled: boolean }[],
                     outerColors: { option: string; disabled: boolean }[], outerColorFinishes: { option: string; disabled: boolean }[],
                     glazingTypes: { option: string; disabled: boolean }[], extras: { option: string; disabled: boolean }[],
                     handles: { option: string; disabled: boolean }[]) {
    for (const excludedOption of excludedOptions) {
      for (const openingType of openingTypes) {
        if (openingType.option === excludedOption) {
          openingType.disabled = true;
        }
      }
      for (const outerMaterial of outerMaterials) {
        if (outerMaterial.option === excludedOption) {
          outerMaterial.disabled = true;
        }
      }
      for (const outerColor of outerColors) {
        if (outerColor.option.startsWith(excludedOption)) {
          outerColor.disabled = true;
        }
      }
      for (const outerColorFinish of outerColorFinishes) {
        if (outerColorFinish.option === excludedOption) {
          outerColorFinish.disabled = true;
        }
      }
      for (const glazingType of glazingTypes) {
        if (glazingType.option === excludedOption) {
          glazingType.disabled = true;
        }
      }
      for (const extra of extras) {
        if (extra.option === excludedOption) {
          extra.disabled = true;
        }
      }
      for (const handle of handles) {
        if (handle.option === excludedOption) {
          handle.disabled = true;
        }
      }
    }
  }

  navigateToShop() {
    const windowInfo = new Subject();
    const windowInfoChange$ = windowInfo.asObservable();
    windowInfo.next([
      this.configuredFlatRoofWindow.model,
      this.configuredFlatRoofWindow.pakietSzybowy,
      this.configuredFlatRoofWindow.szerokosc,
      this.configuredFlatRoofWindow.wysokosc]);
    this.router.navigate(['/' + this.shopFlatRoofWindowLink]);
  }
}
