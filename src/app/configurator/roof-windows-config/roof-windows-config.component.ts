import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {
  Observable,
  Observer,
  Subject,
  Subscription
} from 'rxjs';
import {Router} from '@angular/router';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {RoofWindowValuesSetterService} from '../../services/roof-window-values-setter.service';
import {
  filter,
  map, pairwise, startWith,
  takeUntil,
  tap
} from 'rxjs/operators';
import {LoadConfigurationService} from '../../services/load-configuration.service';
import {HighestIdGetterService} from '../../services/highest-id-getter.service';
import cryptoRandomString from 'crypto-random-string';
import {WindowConfig} from '../../models/window-config';
import {SingleConfiguration} from '../../models/single-configuration';
import {Select, Store} from '@ngxs/store';
import {ConfigurationState} from '../../store/configuration/configuration.state';
import {RouterState} from '@ngxs/router-plugin';
import {AvailableConfigDataState} from '../../store/avaiable-config-data/available-config-data.state';
import {RoofWindowState} from '../../store/roof-window/roof-window.state';
import {
  AddGlobalConfiguration,
  AddRoofWindowConfiguration,
  UpdateRoofWindowConfiguration, UpdateRoofWindowFormByFormName
} from '../../store/configuration/configuration.actions';
import {AppState} from '../../store/app/app.state';

@Component({
  selector: 'app-roof-windows-config',
  templateUrl: './roof-windows-config.component.html',
  styleUrls: ['./roof-windows-config.component.scss']
})
export class RoofWindowsConfigComponent implements OnInit, OnDestroy {

  @Select(AppState) user$: Observable<{ currentUser }>;
  @Select(ConfigurationState.configurations) configurations$: Observable<SingleConfiguration[]>;
  @Select(RoofWindowState.roofWindows) roofWindows$: Observable<RoofWindowSkylight[]>;
  @Select(AvailableConfigDataState.configRoofWindows) configOptions$: Observable<any>;
  @Select(AvailableConfigDataState.roofWindowsConfigLoaded) configOptionsLoaded$: Observable<boolean>;
  @Select(AvailableConfigDataState.roofWindowsExclusions) excludeOptions$: Observable<any>;
  @Select(RouterState) params$: Observable<any>;

  // TODO przygotować strumień i service do publikowania tej danej po aplikacji
  constructor(private store: Store,
              private windowValuesSetter: RoofWindowValuesSetterService,
              private loadConfig: LoadConfigurationService,
              private hd: HighestIdGetterService,
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
    this.roofWindows$.pipe(takeUntil(this.isDestroyed$)).subscribe(roofWindows => {
      this.roofWindowsFormDataBase = roofWindows;
    });
  }

  configuredWindow: RoofWindowSkylight;
  form: FormGroup;
  configFormId: number;
  userConfigs = [];
  urlToSaveConfiguration: string;
  showWidthMessage = false;
  showHeightMessage = false;
  popupConfig = true;
  chooseConfigNamePopup = false;
  copyLinkToConfigurationPopup = false;
  private glazingName = 'Okno:EXX';
  private routerParams = null;
  private globalId = '';
  private highestUserId;
  private configurations: SingleConfiguration[];
  private globalConfiguration: SingleConfiguration = null;
  private newWindowConfig: SingleConfiguration;
  private currentUser: string;
  private formName: string;
  private configId: string;
  private windowId: number;
  private windowCode: string;
  private dimensions;
  private roofWindowsFormDataBase: RoofWindowSkylight[];
  private tempConfiguredWindow: RoofWindowSkylight;
  private windowModelsToCalculatePrice = [];
  private standardWidths = [55, 66, 78, 94, 114, 134];
  private standardHeights = [78, 98, 118, 140, 160];
  private materialVisible = true;
  private openingVisible = false;
  private coatsVisible = false;
  private dimensionsVisible = false;
  private glazingVisible = false;
  private innerColorVisible = false;
  private outerMaterialVisible = false;
  private ventilationVisible = false;
  private handleVisible = false;
  private extrasVisible = false;
  minWidth = 47;
  maxWidth = 134;
  minHeight = 78;
  maxHeight = 160;
  stepWidth = 1;
  stepHeight = 1;
  availableOptions = [];
  materials = [];
  openingTypes = [];
  innerColors = [];
  outerMaterials = [];
  outerColors = [];
  outerColorFinishes = [];
  glazingTypes = [];
  coatsFromFile = [];
  extrasFromFile = [];
  ventilations = [];
  handles = [];
  handleColors = [];
  shopRoofWindowLink: string;
  configurationSummary: string;
  windowsConfigurator: string;
  formData$;
  subscription: Subscription;
  isDestroyed$ = new Subject();
  loading;
  configOptions;
  configByName$: Observable<WindowConfig>;
  userConfigurations$: Observable<SingleConfiguration[]> = new Subject() as Observable<SingleConfiguration[]>;

  static setDimensions(dimensions) {
    return dimensions;
  }

  static getControlType(otwieranie: string) {
    if (otwieranie === 'Okno:ElektrycznePilot' || otwieranie === 'Okno:ElektrycznePrzełącznik') {
      return otwieranie;
    } else {
      return null;
    }
  }

  // 'width': new FormControl(78, [this.validateWidth.bind(this), Validators.required]), własnym walidator
  ngOnInit() {
    this.configByName$ = this.store.select(ConfigurationState.configurationByWindowFormName).pipe(
      takeUntil(this.isDestroyed$),
      map(filterFn => filterFn(this.routerParams.state.params.formName)));
    this.configOptionsLoaded$.subscribe(loaded => {
      if (loaded) {
        this.coatsFromFile = this.objectMaker(this.configOptions.coats);
        this.extrasFromFile = this.objectMaker(this.configOptions.extras);
        this.windowModelsToCalculatePrice = this.configOptions.models;
        this.availableOptions = this.configOptions.availableOptions;
        this.glazingTypes = this.objectMaker(this.configOptions.glazingTypes);
        this.materials = this.objectMaker(this.configOptions.materials);
        this.openingTypes = this.objectMaker(this.configOptions.openingTypes);
        this.innerColors = this.objectMaker(this.configOptions.innerColors);
        this.outerMaterials = this.objectMaker(this.configOptions.outerMaterials);
        this.outerColors = this.objectMaker(this.configOptions.outerColor);
        this.outerColorFinishes = this.objectMaker(this.configOptions.outerColorFinishes);
        this.dimensions = RoofWindowsConfigComponent.setDimensions(this.configOptions.dimensions);
        this.ventilations = this.objectMaker(this.configOptions.ventilations);
        this.handles = this.objectMaker(this.configOptions.handles);
        this.handleColors = this.objectMaker(this.configOptions.handleColors);
        this.formName = this.routerParams.state.params.formName;
        this.windowCode = this.routerParams.state.params.productCode;
        this.configId = this.routerParams.state.params.configId === undefined ? '-1' : this.routerParams.state.params.configId;
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
    this.highestUserId = 1;
    this.tempConfiguredWindow = new RoofWindowSkylight(
      '1O-ISO-V-E02-KL00-A7022P-079119-OKPO01', 'Okno dachowe tymczasowe', 'ISOV E2 79x119', 'I-Okno', 'NPL-Okno', 'Nowy', 'Okno:ISOV', 'Okno:E02', 'dwuszybowy', 79,
      119, 'OknoDachowe', 'obrotowe', 'Okno:IS', 'OknoDachowe:ISO', 'Okno:Obrotowe', 'NawiewnikNeoVent', 'DrewnoSosna', 'Drewno:Bezbarwne', 'OknoDachowe:IS', 'Aluminium',
      // tslint:disable-next-line:max-line-length
      'RAL9999', 'Aluminium:Półmat', 'Okno:ExtraSecure', 'Okno:RAL7048', false, 2, ['78x118'], ['zewnetrznaHartowana', false, false, false, false, false, false, false, false],
      ['https://www.okpol.pl/wp-content/uploads/2017/02/1_ISO.jpg'], ['Okno:Zasuwka', false, false], 1332.80, 1, 1.2, 5, 'Okno:RAL7048', 'Okno:RAL7048', null, 2, 'PL');
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.shopRoofWindowLink = text.shopRoofWindows;
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.configurationSummary = text.configurationSummary;
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.windowsConfigurator = text.configuratorRoofWindow;
    });
  }

  // TODO przygotować wczytywanie konfiguracji jeśli Klient wraca do poprawy danej konfiguracji lub chce przekonfigurować produkt ze sklepu
  // TODO Wyświetlanie ceny podstawowej z eNovy podczas natrafienia na kod będący w eNova i zaproponowanie prześcia do sklepu

  ngOnDestroy() {
    this.isDestroyed$.next();
  }

  private loadForm() {
    if (this.formName === 'no-name' || this.formName === undefined) {
      this.loadConfig.getWindowToReconfiguration(this.currentUser, this.formName, this.routerParams.state.params.productCode).pipe(takeUntil(this.isDestroyed$))
        .subscribe(windowToReconfiguration => {
          this.configuredWindow = windowToReconfiguration;
          this.form = this.fb.group({
            material: new FormControl(this.configuredWindow.stolarkaMaterial, [], [this.validateMaterials.bind(this)]),
            openingType: new FormControl(this.configuredWindow.otwieranie, [], [this.validateOpenings.bind(this)]),
            control: new FormControl(RoofWindowsConfigComponent.getControlType(this.configuredWindow.otwieranie)),
            glazing: new FormControl(this.configuredWindow.glazingToCalculation, [], [this.validateGlazing.bind(this)]),
            coats: new FormArray(this.builtCoatsArray(this.coatsFromFile)),
            width: new FormControl(this.configuredWindow.szerokosc),
            height: new FormControl(this.configuredWindow.wysokosc),
            innerColor: new FormControl(this.configuredWindow.stolarkaKolor, [], [this.validateInnerColor.bind(this)]),
            outer: new FormGroup({
              outerMaterial: new FormControl(this.configuredWindow.oblachowanieMaterial),
              outerColor: new FormControl(this.configuredWindow.oblachowanieKolor),
              outerColorFinish: new FormControl(this.configuredWindow.oblachowanieFinisz)
            }, [], [this.validateOuterMaterial.bind(this)]),
            ventilation: new FormControl(this.configuredWindow.wentylacja, [], [this.validateVentilation.bind(this)]),
            closure: new FormGroup({
              handle: new FormControl(this.configuredWindow.zamkniecieTyp, [], [this.validateHandle.bind(this)]),
              handleColor: new FormControl(this.configuredWindow.zamkniecieKolor)
            }),
            extras: new FormArray(this.builtExtrasArray(this.extrasFromFile))
          });
          this.windowId = 1;
          this.formChanges(); // TODO które usunąć to, czy poniżej - raczej poniżej wiersz, bo tam brak ustawiania formArray
          this.setConfiguredValues(this.form.value); // TODO ten i poprzedni wiersz mają odwołanie do tej samej metody setConfigureValues - czy można jedno usunąć?
          this.formName = cryptoRandomString({length: 12, type: 'alphanumeric'});
          this.loading = false;
        });
    } else {
      this.configByName$.pipe(takeUntil(this.isDestroyed$))
        .subscribe((windowConfiguration: WindowConfig) => {
          console.log(windowConfiguration);
          this.form = this.fb.group({
            material: new FormControl(windowConfiguration.windowFormData.material, [], [this.validateMaterials.bind(this)]),
            openingType: new FormControl(windowConfiguration.windowFormData.openingType, [], [this.validateOpenings.bind(this)]),
            control: new FormControl(RoofWindowsConfigComponent.getControlType(windowConfiguration.windowFormData.otwieranie)),
            glazing: new FormControl(windowConfiguration.windowFormData.glazing, [], [this.validateGlazing.bind(this)]),
            width: new FormControl(windowConfiguration.windowFormData.width),
            height: new FormControl(windowConfiguration.windowFormData.height),
            coats: this.fb.array(windowConfiguration.windowFormData.coats),
            innerColor: new FormControl(windowConfiguration.windowFormData.innerColor, [], [this.validateInnerColor.bind(this)]),
            outer: new FormGroup({
              outerMaterial: new FormControl(windowConfiguration.windowFormData.outer
              === undefined ? null : windowConfiguration.windowFormData.outer.outerMaterial),
              outerColor: new FormControl(windowConfiguration.windowFormData.outer
              === undefined ? null : windowConfiguration.windowFormData.outer.outerColor),
              outerColorFinish: new FormControl(windowConfiguration.windowFormData.outer
              === undefined ? null : windowConfiguration.windowFormData.outer.outerColorFinish)
            }, [], [this.validateOuterMaterial.bind(this)]),
            ventilation: new FormControl(windowConfiguration.windowFormData.ventilation, [], [this.validateVentilation.bind(this)]),
            closure: new FormGroup({
              handle: new FormControl(windowConfiguration.windowFormData.closure
              === undefined ? null : windowConfiguration.windowFormData.closure.handle, [], [this.validateHandle.bind(this)]),
              handleColor: new FormControl(windowConfiguration.windowFormData.closure
              === undefined ? null : windowConfiguration.windowFormData.closure.handleColor)
            }),
            extras: this.fb.array(windowConfiguration.windowFormData.extras)
          });
          this.configuredWindow = windowConfiguration.window;
          this.windowId = windowConfiguration.id;
          this.setConfiguredValues(this.form.value); // TODO ten kolejny wiersz mają odwołanie do tej samej metody setConfigureValues - czy można jedno usunąć?
          this.formChanges(); // TODO które usunąć to, czy poprzednie - raczej poprzedni wiersz, bo tam brak ustawiania formArray
          this.loading = false;
        });
    }
  }

  get coats(): FormArray {
    return this.form.get('coats') as FormArray;
  }

  get extras(): FormArray {
    return this.form.get('extras') as FormArray;
  }

  private builtCoatsArray(coatsFromFile: any[]) {
    const coats = [];
    coatsFromFile.forEach((x, index) => {
      if (this.configuredWindow.windowCoats === undefined) {
        coats.push(new FormControl(false));
      } else {
        if (this.configuredWindow.windowCoats[index] === x.option) {
          coats.push(new FormControl(true));
        } else {
          coats.push(new FormControl(false));
        }
      }
    });
    return coats;
  }

  private builtExtrasArray(extrasFromFile: any[]) {
    const extras = [];
    extrasFromFile.forEach((x, index) => {
      if (this.configuredWindow.listaDodatkow === undefined) {
        extras.push(new FormControl(false));
      } else {
        if (this.configuredWindow.listaDodatkow[index] === x.option) {
          extras.push(new FormControl(true));
        } else {
          extras.push(new FormControl(false));
        }
      }
    });
    return extras;
  }

  formChanges() {
    this.formData$ = this.form.valueChanges; // strumień z danymi z formularza
    this.formData$.pipe(
      takeUntil(this.isDestroyed$),
      startWith([]),
      pairwise(),
      filter(([prevForm, form]: [any, any]) => form.material !== null),
      tap(() => {
        const checkboxCoatControl = this.coats as FormArray;
        this.subscription = checkboxCoatControl.valueChanges.subscribe(() => {
          checkboxCoatControl.setValue(checkboxCoatControl.value.map((value, i) =>
            value ? this.coatsFromFile[i].option : false), {emitEvent: false});
        });
      }),
      tap(() => {
        const checkboxExtraControl = this.extras as FormArray;
        this.subscription = checkboxExtraControl.valueChanges.subscribe(() => {
          checkboxExtraControl.setValue(checkboxExtraControl.value.map((value, i) =>
            value ? this.extrasFromFile[i].option : false), {emitEvent: false});
        });
      }),
      startWith([]),
      pairwise(),
      tap(([prevForm, form]: [any, any]) => {
        this.windowValuesSetter.glazingTypeSetter(form[1].material, form[1].glazing, form[1].coats, 'Okno').subscribe(glazingName => {
          this.glazingName = glazingName;
          this.configuredWindow.pakietSzybowy = glazingName;
        });
      }),
      map(([prevForm, form]: [any, any]) => {
        this.setConfiguredValues(form[1]);
      })).subscribe();
  }

  private setConfiguredValues(form) {
    // @ts-ignore
    const temporaryConfigObject: RoofWindowSkylight = {};
    temporaryConfigObject.model = this.windowValuesSetter.getWindowModel(form.material, form.openingType, form.ventilation);
    temporaryConfigObject.grupaAsortymentowa = this.windowValuesSetter.getWindowAssortmentGroup(form.openingType);
    temporaryConfigObject.pakietSzybowy = this.glazingName;
    temporaryConfigObject.glazingToCalculation = form.glazing;
    temporaryConfigObject.status = '1. Nowy';
    temporaryConfigObject.szerokosc = form.width;
    temporaryConfigObject.wysokosc = form.height;
    temporaryConfigObject.productName = this.windowValuesSetter.getModelName(temporaryConfigObject);
    temporaryConfigObject.indeksAlgorytm = 'I-OKNO';
    temporaryConfigObject.nazwaPLAlgorytm = 'NPL-OKNO';
    temporaryConfigObject.typ = this.windowValuesSetter.getWindowType(form.openingType);
    temporaryConfigObject.geometria = this.windowValuesSetter.getWindowGeometry(form.material);
    temporaryConfigObject.otwieranie = form.openingType;
    temporaryConfigObject.wentylacja = form.ventilation;
    temporaryConfigObject.stolarkaMaterial = form.material;
    temporaryConfigObject.stolarkaKolor = form.innerColor;
    temporaryConfigObject.oblachowanieMaterial = form.outer.outerMaterial;
    temporaryConfigObject.oblachowanieKolor = form.outer.outerColor;
    temporaryConfigObject.oblachowanieFinisz = form.outer.outerColorFinish;
    temporaryConfigObject.rodzina = this.windowValuesSetter.getWindowFamily(temporaryConfigObject.stolarkaMaterial, temporaryConfigObject.otwieranie);
    temporaryConfigObject.rodzaj = this.windowValuesSetter.getWindowGroup(temporaryConfigObject.stolarkaMaterial, temporaryConfigObject.otwieranie);
    temporaryConfigObject.zamkniecieTyp = form.closure.handle;
    temporaryConfigObject.zamkniecieKolor = form.closure.handleColor;
    temporaryConfigObject.uszczelki = 2;
    temporaryConfigObject.windowCoats = form.coats;
    temporaryConfigObject.listaDodatkow = form.extras;
    temporaryConfigObject.kolorTworzywWew = temporaryConfigObject.zamkniecieKolor === 'Okno:RAL7048' ? 'Okno:RAL7048' : 'Okno:RAL9016';
    temporaryConfigObject.kolorTworzywZew = 'Okno:RAL7048';
    temporaryConfigObject.windowHardware = false;
    temporaryConfigObject.numberOfGlasses = this.windowValuesSetter.getNumberOfGlasses(temporaryConfigObject);
    temporaryConfigObject.cennik = 'KO';
    temporaryConfigObject.kod = this.windowValuesSetter.generateWindowCode(temporaryConfigObject.stolarkaMaterial, temporaryConfigObject.otwieranie,
      temporaryConfigObject.wentylacja, temporaryConfigObject.pakietSzybowy, temporaryConfigObject.stolarkaKolor,
      temporaryConfigObject.oblachowanieMaterial, temporaryConfigObject.oblachowanieKolor, temporaryConfigObject.oblachowanieFinisz,
      temporaryConfigObject.szerokosc, temporaryConfigObject.wysokosc);
    temporaryConfigObject.CenaDetaliczna = this.priceCalculation(temporaryConfigObject);
    temporaryConfigObject.windowUG = this.windowValuesSetter.getUwAndUgValues(temporaryConfigObject).windowUG;
    temporaryConfigObject.windowUW = this.windowValuesSetter.getUwAndUgValues(temporaryConfigObject).windowUW;
    temporaryConfigObject.dostepneRozmiary = [];
    temporaryConfigObject.linkiDoZdjec = [];
    temporaryConfigObject.iloscSprzedanychRok = 0;
    temporaryConfigObject.okucia = '';
    temporaryConfigObject.nazwaPozycjiPL = 'Nowe okno z konfiguratora - nazwa do uzupełnienia';
    if (form.material &&
      form.openingType) {
      this.popupConfig = true;
    }
    this.configuredWindow = JSON.parse(JSON.stringify(temporaryConfigObject));
    this.showWidthMessage = this.standardWidths.includes(form.width);
    this.showHeightMessage = this.standardHeights.includes(form.height);
    this.setDisabled(this.configuredWindow);
  }

  priceCalculation(configuredWindow: RoofWindowSkylight) {
    // ... spread operator pozwala niezagnieżdżać jendego elementu w drugi
    // tempArray.push({...data[book], id: book});
    let windowPrice = 0;
    let isStandard = false;
    let index = -1;
    for (let i = 0; i < this.windowModelsToCalculatePrice.length; i++) {
      if (this.windowModelsToCalculatePrice[i].windowModel === configuredWindow.model) {
        index = i;
      }
    }
    const windowToCalculations = this.windowModelsToCalculatePrice[index];
    for (const standardRoofWindow of this.roofWindowsFormDataBase) {
      if (standardRoofWindow.kod === configuredWindow.kod) {
        windowPrice = standardRoofWindow.CenaDetaliczna;
        isStandard = true;
        for (const extra of configuredWindow.listaDodatkow) {
          if (extra !== false) {
            windowPrice += +windowToCalculations[extra];
          }
        }
      }
    }
    if (index > -1 && !isStandard) {
      if (configuredWindow.pakietSzybowy) {
        windowPrice += this.getWindowCircuit(configuredWindow) * windowToCalculations[configuredWindow.glazingToCalculation];
      }
      for (const coat of configuredWindow.windowCoats) {
        if (coat !== false) {
          windowPrice += +windowToCalculations[coat];
        }
      }
      if (configuredWindow.stolarkaKolor) {
        windowPrice += this.getWindowCircuit(configuredWindow) * windowToCalculations[configuredWindow.stolarkaKolor];
      }
      if (configuredWindow.oblachowanieMaterial) {
        windowPrice += this.getWindowCircuit(configuredWindow) * windowToCalculations[configuredWindow.oblachowanieMaterial];
      }
      if (configuredWindow.oblachowanieKolor) {
        windowPrice += this.getWindowCircuit(configuredWindow) * windowToCalculations[configuredWindow.oblachowanieKolor];
      }
      if (configuredWindow.oblachowanieFinisz) {
        windowPrice += this.getWindowCircuit(configuredWindow) * windowToCalculations[configuredWindow.oblachowanieFinisz];
      }
      for (const extra of configuredWindow.listaDodatkow) {
        if (extra !== false) {
          windowPrice += +windowToCalculations[extra];
        }
      }
      if (configuredWindow.wentylacja) {
        windowPrice += +windowToCalculations[configuredWindow.wentylacja];
      }
      if (configuredWindow.zamkniecieTyp) {
        windowPrice += +windowToCalculations[configuredWindow.zamkniecieTyp];
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

  navigateToShop() {
    const windowInfo = new Subject();
    const windowInfoChange$ = windowInfo.asObservable();
    windowInfo.next([
      this.configuredWindow.model,
      this.configuredWindow.pakietSzybowy,
      this.configuredWindow.szerokosc,
      this.configuredWindow.wysokosc]);
    this.router.navigate(['/' + this.shopRoofWindowLink]);
  }

  // VALIDATORS
  validateMaterials<AsyncValidatorFn>(control: FormControl) {
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

  validateInnerColor<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let errors = {
        'empty innerColor': true
      };
      this.configOptionsLoaded$.pipe(takeUntil(this.isDestroyed$)).subscribe(loaded => {
        if (loaded) {
          for (const option of this.configOptions.innerColors) {
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

  validateVentilation<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let errors = {
        'empty ventilation': true
      };
      this.configOptionsLoaded$.pipe(takeUntil(this.isDestroyed$)).subscribe(loaded => {
        if (loaded) {
          for (const option of this.configOptions.ventilations) {
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

  onSubmit() {
    this.newWindowConfig = {
      products: {
        windows: [{
          id: this.windowId,
          quantity: 1,
          // TODO zamienić na configuredWindow po odkomentowaniu blokad formularza
          window: this.tempConfiguredWindow,
          windowFormName: this.formName,
          windowFormData: this.form.value,
          configLink: String(this.router['location']._platformLocation.location.origin
            + '/' + this.globalId
            + '/' + this.formName
            + '/' + this.configuredWindow.kod)
        }],
        flashings: null,
        accessories: null,
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
        this.highestUserId = this.hd.getHighestIdForUser(userConfigurations);
        this.newWindowConfig.userId = this.highestUserId;
        // wersja 2 lub 1
        if (this.userConfigs.length !== 0) {
          this.userConfigs.push(this.newWindowConfig);
          this.loading = false;
          this.chooseConfigNamePopup = true;
          // wersja 1
        } else {
          this.newWindowConfig.products.windows.forEach(element => element.configLink = String(
            this.router['location']._platformLocation.location.origin + this.router.url
            + '/' + this.globalId
            + '/' + this.formName
            + '/' + this.configuredWindow.kod));
          this.store.dispatch(new AddGlobalConfiguration(this.currentUser, this.newWindowConfig)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
          this.router.navigate(['/' + this.configurationSummary]);
          this.loading = false;
        }
      });
    } else {
      // wersja 2
      if (this.windowId === 1) {
        const temporaryLink = String(
          this.router['location']._platformLocation.location.origin + this.router.url
          + '/' + this.globalId
          + '/' + this.formName
          + '/' + this.configuredWindow.kod);
        this.store.dispatch(new AddRoofWindowConfiguration(this.globalConfiguration, this.configuredWindow,
          this.formName, this.form.value, temporaryLink))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        // wersja 3
      } else {
        this.store.dispatch(new UpdateRoofWindowConfiguration(this.globalConfiguration, this.windowId, this.configuredWindow))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        this.store.dispatch(new UpdateRoofWindowFormByFormName(this.globalConfiguration, this.formName, this.form.value))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      }
      this.router.navigate(['/' + this.configurationSummary]);
      this.loading = false;
    }
  }

  chooseConfigId(configForm: any) {
    // wersja 1
    if (configForm.value.configFormId === undefined) {
      this.newWindowConfig.products.windows.forEach(element => element.configLink = String(
        this.router['location']._platformLocation.location.origin + this.router.url
        + '/' + this.globalId
        + '/' + this.formName
        + '/' + this.configuredWindow.kod));
      this.store.dispatch(new AddGlobalConfiguration(this.currentUser, this.newWindowConfig))
        .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      // wersja 2
    } else {
      const temporaryLink = String(
        this.router['location']._platformLocation.location.origin
        + '/' + this.globalId
        + '/' + this.formName
        + '/' + this.configuredWindow.kod);
      this.configId = String('configuration-' + parseInt(configForm.value.configFormId, 10));
      this.globalConfiguration = this.configurations.find(config => config.globalId === this.configId);
      // TODO zamienić na configuredWindow
      this.store.dispatch(new AddRoofWindowConfiguration(this.globalConfiguration,
        this.tempConfiguredWindow, this.formName, this.form.value, temporaryLink))
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
        windows: [{
          id: this.windowId,
          quantity: 1,
          window: this.configuredWindow,
          windowFormName: this.formName,
          windowFormData: this.form.value,
          configLink: String(this.router['location']._platformLocation.location.origin
            + '/' + this.globalId
            + '/' + this.formName
            + '/' + this.configuredWindow.kod)
        }],
        flashings: null,
        accessories: null,
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
        + '/' + this.configuredWindow.kod;
      // wersja 2
      if (this.windowId === 1) {
        this.store.dispatch(new AddRoofWindowConfiguration(this.globalConfiguration, this.configuredWindow,
          this.formName, this.form.value, temporaryUrl))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        // wersja 3
      } else {
        this.store.dispatch(new UpdateRoofWindowConfiguration(this.globalConfiguration, this.windowId, this.configuredWindow))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      }
      // wersja 1
    } else {
      this.newWindowConfig.products.windows.forEach(element => element.configLink = String(
        this.router['location']._platformLocation.location.origin + this.router.url
        + '/' + this.globalId
        + '/' + this.formName
        + '/' + this.configuredWindow.kod));
      this.store.dispatch(new AddGlobalConfiguration('anonym', this.newWindowConfig))
        .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      temporaryUrl = this.router['location']._platformLocation.location.origin + this.router.url
        + '/' + this.newWindowConfig.globalId
        + '/' + this.newWindowConfig.products.windows[0].windowFormName
        + '/' + this.newWindowConfig.products.windows[0].window.kod;
    }
    this.urlToSaveConfiguration = temporaryUrl;
    this.loading = false;
  }

  resetConfigForm() {
    this.router.navigate(['/' + this.windowsConfigurator]);
  }

  // CALCULATIONS
  getWindowCircuit(configuredWindow) {
    return 2 * configuredWindow.szerokosc + 2 * configuredWindow.wysokosc;
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

  // CSS STYLING
  setBackgroundImage(value: string) {
    const twoParts = value.split(':');
    let fileName = '';
    if (twoParts[1] === undefined || twoParts[1] === 'TRUE') {
      fileName = twoParts[0];
    } else {
      if (twoParts[0] === 'KolankoPVC' && twoParts[1] === 'Uchylne') {
        fileName = 'UchylnePVC';
      } else if (twoParts[0] === 'KolankoDrewno' && twoParts[1] === 'NieotwieraneFIP') {
        fileName = 'NieotwieraneFIPKolanko';
      } else {
        fileName = twoParts[1];
      }
    }
    return {
      ['background-image']: 'url("assets/img/configurator/window_configurator/central_options_pictures/' + fileName + '.png")',
      ['background-size']: 'contain',
      ['background-repeat']: 'no-repeat'
    };
  }

  builtNameForTranslation(option: string) {
    return String('ROOF-WINDOWS-DATA.' + option);
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
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  onMaterialHover(materialOptions: HTMLDivElement) {
    this.materialVisible = !this.materialVisible;
    this.onHoverClick(materialOptions, this.materials.length, this.materialVisible);
  }

  onOpeningHover(openingOptions: HTMLDivElement) {
    this.openingVisible = !this.openingVisible;
    this.onHoverClick(openingOptions, this.openingTypes.length, this.openingVisible);
  }

  onGlazingHover(glazingOptions: HTMLDivElement) {
    this.glazingVisible = !this.glazingVisible;
    this.onHoverClick(glazingOptions, this.glazingTypes.length, this.glazingVisible);
  }

  onCoatsHover(coatOptions: HTMLDivElement) {
    this.coatsVisible = !this.coatsVisible;
    this.onHoverClick(coatOptions, this.coatsFromFile.length, this.coatsVisible);
  }

  onDimensionsHover(dimensionOption: HTMLDivElement) {
    this.dimensionsVisible = !this.dimensionsVisible;
    this.onHoverClick(dimensionOption, 3, this.dimensionsVisible);
  }

  onInnerColorHover(innerColor: HTMLDivElement) {
    this.innerColorVisible = !this.innerColorVisible;
    this.onHoverClick(innerColor, this.innerColors.length, this.innerColorVisible);
  }

  onOuterMaterialHover(outerMaterial: HTMLDivElement) {
    this.outerMaterialVisible = !this.outerMaterialVisible;
    const length = this.outerColors.length + this.outerMaterials.length + this.outerColorFinishes.length + 1;
    this.onHoverClick(outerMaterial, length, this.outerMaterialVisible);
  }

  onVentilationHover(ventilationOptions: HTMLDivElement) {
    this.ventilationVisible = !this.ventilationVisible;
    this.onHoverClick(ventilationOptions, this.ventilations.length, this.ventilationVisible);
  }

  onHandleHover(handleOptions: HTMLDivElement) {
    this.handleVisible = !this.handleVisible;
    const length = this.handleColors.length + this.handles.length + 1;
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
    this.coatsVisible = false;
    this.dimensionsVisible = false;
    this.glazingVisible = false;
    this.innerColorVisible = false;
    this.outerMaterialVisible = false;
    this.ventilationVisible = false;
    this.handleVisible = false;
    this.extrasVisible = false;
    for (const element of htmlDivElements) {
      element.style.maxHeight = '0';
      element.style.transition = 'all .7s ease-in-out';
    }
  }

  changeCheckBoxState() {
    this.setDisabled(this.configuredWindow);
  }

  closeCopyLinkPopUp() {
    this.copyLinkToConfigurationPopup = false;
  }

  // DISABLE INPUT SETTER LOGIC
  resetAllArrays(materials: { option: string; disabled: boolean }[], openingTypes: { option: string; disabled: boolean }[],
                 innerColors: { option: string; disabled: boolean }[], outerMaterials: { option: string; disabled: boolean }[],
                 outerColors: { option: string; disabled: boolean }[], outerColorFinishes: { option: string; disabled: boolean }[],
                 glazingTypes: { option: string; disabled: boolean }[], coats: { option: string; disabled: boolean }[],
                 extras: { option: string; disabled: boolean }[], ventilations: { option: string; disabled: boolean }[],
                 handles: { option: string; disabled: boolean }[], handleColors: { option: string; disabled: boolean }[]) {
    for (const material of materials) {
      material.disabled = null;
    }
    for (const openingType of openingTypes) {
      openingType.disabled = null;
    }
    for (const innerColor of innerColors) {
      innerColor.disabled = null;
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
    for (const chosenCoat of coats) {
      chosenCoat.disabled = null;
    }
    for (const chosenExtra of extras) {
      chosenExtra.disabled = null;
    }
    for (const ventilation of ventilations) {
      ventilation.disabled = null;
    }
    for (const handle of handles) {
      handle.disabled = null;
    }
    for (const handleColor of handleColors) {
      handleColor.disabled = null;
    }
  }

  setDisabled(configuredWindow: RoofWindowSkylight) {
    this.resetAllArrays(this.materials, this.openingTypes, this.innerColors, this.outerMaterials, this.outerColors, this.outerColorFinishes,
      this.glazingTypes, this.coatsFromFile, this.extrasFromFile, this.ventilations, this.handles, this.handleColors);
    this.excludeOptions$.pipe(takeUntil(this.isDestroyed$)).subscribe(exclusions => {
      const excludedOptions = [];
      for (const configurationOption in configuredWindow) {
        if (configurationOption === '_kolorTworzywZew') {
          continue;
        }
        if (configurationOption === '_kolorTworzywWew') {
          continue;
        }
        if (configurationOption === '_windowCoats') {
          for (const chosenCoat of configuredWindow['_windowCoats']) {
            for (const exclusionObject of exclusions) {
              if (exclusionObject.selectedOption === chosenCoat) {
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
        } else if (configurationOption === '_listaDodatkow') {
          for (const chosenExtra of configuredWindow['_listaDodatkow']) {
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
            if (exclusionObject.selectedOption === configuredWindow[configurationOption]) {
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
      this.setDisabledOptions(excludedOptions, this.materials, this.openingTypes, this.innerColors,
        this.outerMaterials, this.outerColors, this.outerColorFinishes,
        this.glazingTypes, this.coatsFromFile, this.extrasFromFile, this.ventilations,
        this.handles, this.handleColors);
    });
  }

  // tslint:disable-next-line:max-line-length
  setDisabledOptions(excludedOptions: string[], materials: { option: string; disabled: boolean }[], openingTypes: { option: string; disabled: boolean }[],
                     innerColors: { option: string; disabled: boolean }[], outerMaterials: { option: string; disabled: boolean }[],
                     outerColors: { option: string; disabled: boolean }[], outerColorFinishes: { option: string; disabled: boolean }[],
                     glazingTypes: { option: string; disabled: boolean }[], coats: { option: string; disabled: boolean }[],
                     extras: { option: string; disabled: boolean }[], ventilations: { option: string; disabled: boolean }[],
                     handles: { option: string; disabled: boolean }[], handleColors: { option: string; disabled: boolean }[]) {
    for (const excludedOption of excludedOptions) {
      for (const material of materials) {
        if (material.option === excludedOption) {
          material.disabled = true;
        }
      }
      for (const openingType of openingTypes) {
        if (openingType.option === excludedOption) {
          openingType.disabled = true;
        }
      }
      for (const innerColor of innerColors) {
        if (innerColor.option === excludedOption) {
          innerColor.disabled = true;
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
      for (const coat of coats) {
        if (coat.option === excludedOption) {
          coat.disabled = true;
        }
      }
      for (const extra of extras) {
        if (extra.option === excludedOption) {
          extra.disabled = true;
        }
      }
      for (const ventilation of ventilations) {
        if (ventilation.option === excludedOption) {
          ventilation.disabled = true;
        }
      }
      for (const handle of handles) {
        if (handle.option === excludedOption) {
          handle.disabled = true;
        }
      }
      for (const handleColor of handleColors) {
        if (handleColor.option === excludedOption) {
          handleColor.disabled = true;
        }
      }
    }
  }
}

// OLD VALIDATORS
// private validateHeight(control: FormControl): { [s: string]: boolean } {
//     if (control.value > 160 && control.value < 98) {
//       return {'roofWindowToHeight': true};
//     } else {
//       return null;
//     }
//   }
//
//   private validateWidth(control: FormControl): { [s: string]: boolean } {
//     if (control.value > 134 && control.value < 55) {
//       return {'roofWindowToWidth': true};
//     } else {
//       return null;
//     }
//   }
//
//   private validateSurface(): { [s: string]: boolean } {
//     if (this.configuredWindow.windowWidth * this.configuredWindow.windowHeight > 12597) {
//       return {'roofWindowToLarge': true};
//     } else {
//       return null;
//     }
//   }

// tslint:disable-next-line:max-line-length
// setSetsDisabledOptions(setNumber: number, selectedOption: string, materials: { option: string; disabled: boolean }[],openingTypes: { option: string; disabled: boolean }[],
//                        innerColors: { option: string; disabled: boolean }[], outerMaterials: { option: string; disabled: boolean }[],
// tslint:disable-next-line:max-line-length
//                        outerColors: { option: string; disabled: boolean }[], outerColorFinishes: { option: string; disabled: boolean }[],
//                        glazingTypes: { option: string; disabled: boolean }[], chosenCoats: { option: string; disabled: boolean }[],
//                        chosenExtras: { option: string; disabled: boolean }[], ventilations: { option: string; disabled: boolean }[],
//                        handles: { option: string; disabled: boolean }[], handleColors: { option: string; disabled: boolean }[], sets) {
//   for (const set of sets) {
//     if (setNumber > 0 && Object.values(set)[0] === setNumber) {
//       const optionToChange = Object.keys(set)[0];
//       console.log(setNumber); // zwraca wartości liczbowe w setach
//       console.log(optionToChange); // zwraca nazwy watości w setach
//       for (const material of materials) {
//         if (material.option === optionToChange && setNumber !== set[selectedOption]) {
//           material.disabled = true;
//         }
//       }
//       for (const openingType of openingTypes) {
//         if (openingType.option === optionToChange && setNumber !== set[selectedOption]) {
//           openingType.disabled = true;
//         }
//       }
//       for (const innerColor of innerColors) {
//         if (innerColor.option === optionToChange && setNumber !== set[selectedOption]) {
//           innerColor.disabled = true;
//         }
//       }
//       for (const outerMaterial of outerMaterials) {
//         if (outerMaterial.option === optionToChange && setNumber !== set[selectedOption]) {
//           outerMaterial.disabled = true;
//         }
//       }
//       for (const outerColor of outerColors) {
//         if (outerColor.option === optionToChange && setNumber !== set[selectedOption]) {
//           outerColor.disabled = true;
//         }
//       }
//       for (const outerColorFinish of outerColorFinishes) {
//         if (outerColorFinish.option === optionToChange && setNumber !== set[selectedOption]) {
//           outerColorFinish.disabled = true;
//         }
//       }
//       for (const glazingType of glazingTypes) {
//         if (glazingType.option === optionToChange && setNumber !== set[selectedOption]) {
//           glazingType.disabled = true;
//         }
//       }
//       for (const chosenCoat of chosenCoats) {
//         if (chosenCoat.option === optionToChange && setNumber !== set[selectedOption]) {
//           chosenCoat.disabled = true;
//         }
//       }
//       for (const chosenExtra of chosenExtras) {
//         if (chosenExtra.option === optionToChange && setNumber !== set[selectedOption]) {
//           chosenExtra.disabled = true;
//         }
//       }
//       for (const ventilation of ventilations) {
//         if (ventilation.option === optionToChange && setNumber !== set[selectedOption]) {
//           ventilation.disabled = true;
//         }
//       }
//       for (const handle of handles) {
//         if (handle.option === optionToChange && setNumber !== set[selectedOption]) {
//           handle.disabled = true;
//         }
//       }
//       for (const handleColor of handleColors) {
//         if (handleColor.option === optionToChange && setNumber !== set[selectedOption]) {
//           handleColor.disabled = true;
//         }
//       }
//     }
//   }
// }
