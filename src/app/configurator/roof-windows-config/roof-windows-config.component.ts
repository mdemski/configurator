import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  ObservedValueOf,
  Observer,
  Subject,
  Subscription
} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {CrudFirebaseService} from '../../services/crud-firebase-service';
import {ConfigurationDataService} from '../../services/configuration-data.service';
import {AuthService} from '../../services/auth.service';
import {RoofWindowValuesSetterService} from '../../services/roof-window-values-setter.service';
import {
  filter,
  map, pairwise, startWith,
  takeUntil,
  tap
} from 'rxjs/operators';
import {LoadConfigurationService} from '../../services/load-configuration.service';
import {HighestIdGetterService} from '../../services/highest-id-getter.service';
import {DatabaseService} from '../../services/database.service';
import cryptoRandomString from 'crypto-random-string';
import {WindowConfig} from '../../models/window-config';
import {SingleConfiguration} from '../../models/single-configuration';

@Component({
  selector: 'app-roof-windows-config',
  templateUrl: './roof-windows-config.component.html',
  styleUrls: ['./roof-windows-config.component.scss']
})
export class RoofWindowsConfigComponent implements OnInit, OnDestroy {

  // TODO przygotować strumień i service do publikowania tej danej po aplikacji
  constructor(private authService: AuthService,
              private configData: ConfigurationDataService,
              private dataBase: DatabaseService,
              private windowValuesSetter: RoofWindowValuesSetterService,
              private loadConfig: LoadConfigurationService,
              private crud: CrudFirebaseService,
              private hd: HighestIdGetterService,
              private router: Router,
              private activeRouter: ActivatedRoute,
              private fb: FormBuilder,
              public translate: TranslateService) {
    this.loading = true;
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
    this.paramsUserFetchData$ = combineLatest(this.authService.returnUser(), this.activeRouter.params,
      this.configData.fetchAllWindowsData(), this.crud.readAllConfigurationsFromMongoDB()).pipe(
      takeUntil(this.isDestroyed$),
      map(data => {
        return {
          user: data[0],
          params: data[1],
          fetch: data[2],
          configurations: data[3]
        };
      }));
  }

  // tslint:disable-next-line:max-line-length
  private paramsUserFetchData$: Observable<{ params: ObservedValueOf<Observable<Params>>; user: string; fetch: any; configurations: SingleConfiguration[] }>;
  configuredWindow: RoofWindowSkylight;
  form: FormGroup;
  configWindowFormId: number;
  userConfigs = [];
  urlToSaveConfiguration: string;
  showWidthMessage = false;
  showHeightMessage = false;
  popupConfig = true;
  chooseConfigNamePopup = false;
  copyLinkToConfigurationPopup = false;
  private globalId = '';
  private highestUserId;
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
  glazingName$ = new BehaviorSubject('Okno:E01');
  isDestroyed$ = new Subject();
  loading;

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
  ngOnInit(): void {
    this.highestUserId = 1;
    this.tempConfiguredWindow = new RoofWindowSkylight(
      '1O-ISO-V-E02-KL00-A7022P-079119-OKPO01', 'Okno dachowe tymczasowe', 'ISOV E2 79x119', 'I-Okno', 'NPL-Okno', 'Nowy', 'Okno:ISOV', 'Okno:E02', 'dwuszybowy', 79,
      119, 'OknoDachowe', 'obrotowe', 'Okno:IS', 'OknoDachowe:ISO', 'Okno:Obrotowe', 'NawiewnikNeoVent', 'DrewnoSosna', 'Drewno:Bezbarwne', 'OknoDachowe:IS', 'Aluminium',
      // tslint:disable-next-line:max-line-length
      'RAL9999', 'Aluminium:Półmat', 'Okno:ExtraSecure', 'Okno:RAL7048', false, 2, ['78x118'], ['zewnetrznaHartowana', false, false, false, false, false, false, false, false],
      ['https://www.okpol.pl/wp-content/uploads/2017/02/1_ISO.jpg'], ['Okno:Zasuwka', false, false], 1332.80, 1, 1.2, 5, 'Okno:RAL7048', 'Okno:RAL7048', null, 2, 'PL');
    this.paramsUserFetchData$.pipe(
      takeUntil(this.isDestroyed$),
      map((data: { params: ObservedValueOf<Observable<Params>>; user: string; fetch: any; configurations: SingleConfiguration[] }) => {
        this.coatsFromFile = this.objectMaker(data.fetch.coats);
        this.extrasFromFile = this.objectMaker(data.fetch.extras);
        this.windowModelsToCalculatePrice = data.fetch.models;
        this.availableOptions = data.fetch.availableOptions;
        this.glazingTypes = this.objectMaker(data.fetch.glazingTypes);
        this.materials = this.objectMaker(data.fetch.materials);
        this.openingTypes = this.objectMaker(data.fetch.openingTypes);
        this.innerColors = this.objectMaker(data.fetch.innerColors);
        this.outerMaterials = this.objectMaker(data.fetch.outerMaterials);
        this.outerColors = this.objectMaker(data.fetch.outerColor);
        this.outerColorFinishes = this.objectMaker(data.fetch.outerColorFinishes);
        this.dimensions = RoofWindowsConfigComponent.setDimensions(data.fetch.dimensions);
        this.ventilations = this.objectMaker(data.fetch.ventilations);
        this.handles = this.objectMaker(data.fetch.handles);
        this.handleColors = this.objectMaker(data.fetch.handleColors);
        this.currentUser = data.user;
        this.formName = data.params.formName;
        this.windowCode = data.params.productCode;
        this.globalId = data.params.configId === undefined
          ? this.hd.getHighestGlobalIdFormMongoDB(data.configurations) : data.params.configId;
        this.configId = data.params.configId === undefined ? '-1' : this.globalId;
      })).subscribe(() => {
      if (this.formName === 'no-name' || this.formName === undefined) {
        // tslint:disable-next-line:max-line-length
        this.loadConfig.getWindowToReconfiguration(this.currentUser, this.formName, this.windowCode).pipe(takeUntil(this.isDestroyed$))
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
        this.loadConfig.getWindowConfigurationByFormName(this.formName)
          .pipe(takeUntil(this.isDestroyed$))
          .subscribe((windowConfiguration: WindowConfig) => {
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
    });
    this.dataBase.fetchRoofWindows().pipe(takeUntil(this.isDestroyed$)).subscribe(roofWindows => {
      this.roofWindowsFormDataBase = roofWindows;
    });
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
          this.glazingName$.next(glazingName);
        });
      }),
      map(([prevForm, form]: [any, any]) => {
        this.setConfiguredValues(form[1]);
      })).subscribe();
  }

  private setConfiguredValues(form) {
    this.configuredWindow.model = this.windowValuesSetter.setWindowModel(
      form.material,
      form.openingType,
      form.ventilation);
    if (form.material &&
      form.openingType) {
      this.popupConfig = true;
    }
    this.configuredWindow.grupaAsortymentowa = this.windowValuesSetter.setWindowAssortmentGroup(form.openingType);
    this.glazingName$.pipe(takeUntil(this.isDestroyed$)).subscribe(pakietSzybowy => {
      this.configuredWindow.pakietSzybowy = pakietSzybowy;
    });
    this.configuredWindow.glazingToCalculation = form.glazing;
    this.configuredWindow.status = '1. Nowy';
    this.configuredWindow.szerokosc = form.width;
    this.showWidthMessage = this.standardWidths.includes(form.width);
    this.configuredWindow.wysokosc = form.height;
    this.showHeightMessage = this.standardHeights.includes(form.height);
    this.windowValuesSetter.setModelName(this.configuredWindow);
    this.configuredWindow.indeksAlgorytm = 'I-OKNO';
    this.configuredWindow.nazwaPLAlgorytm = 'NPL-OKNO';
    this.configuredWindow.typ = this.windowValuesSetter.setWindowType(form.openingType);
    this.configuredWindow.geometria = this.windowValuesSetter.setWindowGeometry(form.material);
    this.configuredWindow.otwieranie = form.openingType;
    this.configuredWindow.wentylacja = form.ventilation;
    this.configuredWindow.stolarkaMaterial = form.material;
    this.configuredWindow.stolarkaKolor = form.innerColor;
    this.configuredWindow.oblachowanieMaterial = form.outer.outerMaterial;
    this.configuredWindow.rodzina = this.windowValuesSetter.setWindowFamily(this.configuredWindow.stolarkaMaterial, this.configuredWindow.otwieranie);
    this.configuredWindow.rodzaj = this.windowValuesSetter.setWindowGroup(this.configuredWindow.stolarkaMaterial, this.configuredWindow.otwieranie);
    this.configuredWindow.oblachowanieKolor = form.outer.outerColor;
    this.configuredWindow.oblachowanieFinisz = form.outer.outerColorFinish;
    this.configuredWindow.zamkniecieTyp = form.closure.handle;
    this.configuredWindow.zamkniecieKolor = form.closure.handleColor;
    this.configuredWindow.uszczelki = 2;
    this.configuredWindow.windowCoats = form.coats;
    this.configuredWindow.listaDodatkow = form.extras;
    this.configuredWindow.kolorTworzywWew = this.configuredWindow.zamkniecieKolor === 'Okno:RAL7048' ? 'Okno:RAL7048' : 'Okno:RAL9016';
    this.configuredWindow.kolorTworzywZew = 'Okno:RAL7048';
    this.configuredWindow.windowHardware = false;
    this.configuredWindow.numberOfGlasses = this.configuredWindow.glazingToCalculation === 'dwuszybowy' ? 2 : 3;
    this.configuredWindow.cennik = 'KO';
    this.configuredWindow.kod = this.windowValuesSetter.generateWindowCode(this.configuredWindow.stolarkaMaterial, this.configuredWindow.otwieranie,
      this.configuredWindow.wentylacja, this.configuredWindow.pakietSzybowy, this.configuredWindow.stolarkaKolor,
      this.configuredWindow.oblachowanieMaterial, this.configuredWindow.oblachowanieKolor, this.configuredWindow.oblachowanieFinisz,
      this.configuredWindow.szerokosc, this.configuredWindow.wysokosc);
    this.configuredWindow.CenaDetaliczna = this.priceCalculation(this.configuredWindow);
    this.windowValuesSetter.setUwAndUgValues(this.configuredWindow);
    this.setDisabled(this.configuredWindow);
    console.log(this.configuredWindow);
  }

  //


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
      let options = [];
      let errors = {
        'empty material': true
      };
      this.configData.fetchAllWindowsData().pipe(takeUntil(this.isDestroyed$)).subscribe(data => {
        options = data.materials;
        for (const option of options) {
          if (control.value === option) {
            errors = null;
          }
        }
        observer.next(errors);
        observer.complete();
      });
    });
  }

  validateOpenings<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let options = [];
      let errors = {
        'empty openingType': true
      };
      this.configData.fetchAllWindowsData().pipe(takeUntil(this.isDestroyed$)).subscribe(data => {
        options = data.openingTypes;
        for (const option of options) {
          if (control.value === option) {
            errors = null;
          }
        }
        observer.next(errors);
        observer.complete();
      });
    });
  }

  validateGlazing<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let options = [];
      let errors = {
        'empty glazingType': true
      };
      this.configData.fetchAllWindowsData().pipe(takeUntil(this.isDestroyed$)).subscribe(data => {
        options = data.glazingTypes;
        for (const option of options) {
          if (control.value === option) {
            errors = null;
          }
        }
        observer.next(errors);
        observer.complete();
      });
    });
  }

  validateInnerColor<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let options = [];
      let errors = {
        'empty innerColor': true
      };
      this.configData.fetchAllWindowsData().pipe(takeUntil(this.isDestroyed$)).subscribe(data => {
        options = data.innerColors;
        for (const option of options) {
          if (control.value === option) {
            errors = null;
          }
        }
        observer.next(errors);
        observer.complete();
      });
    });
  }

  validateOuterMaterial<AsyncValidatorFn>(group: FormGroup) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let materialOptions = [];
      // let colorOptions = [];
      let finishOptions = [];
      let errors = {
        'empty outerMaterial': true
      };
      this.configData.fetchAllWindowsData().pipe(takeUntil(this.isDestroyed$)).subscribe(data => {
        materialOptions = data.outerMaterials;
        // colorOptions = this.configData.outerColor;
        finishOptions = data.outerColorFinishes;
        for (const option of materialOptions) {
          if (group.controls.outerMaterial.value === option) {
            errors = null;
          }
        }
        // TODO odkomentować kod po wprowadzeniu listy zewnętrznych koloróœ
        // for (const option of colorOptions) {
        //   if (group.controls.outerColor.value === option) {
        //     errors = null;
        //   }
        // }
        for (const option of finishOptions) {
          if (group.controls.outerColorFinish.value === option) {
            errors = null;
          }
        }
        observer.next(errors);
        observer.complete();
      });
    });
  }

  validateVentilation<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let options = [];
      let errors = {
        'empty ventilation': true
      };
      this.configData.fetchAllWindowsData().pipe(takeUntil(this.isDestroyed$)).subscribe(data => {
        options = data.ventilations;
        for (const option of options) {
          if (control.value === option) {
            errors = null;
          }
        }
        observer.next(errors);
        observer.complete();
      });
    });
  }

  validateHandle<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let options = [];
      let errors = {
        'empty handle': true
      };
      this.configData.fetchAllWindowsData().pipe(takeUntil(this.isDestroyed$)).subscribe(data => {
        options = data.handles;
        for (const option of options) {
          if (control.value === option) {
            errors = null;
          }
        }
        observer.next(errors);
        observer.complete();
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
    this.authService.returnUser().pipe(takeUntil(this.isDestroyed$)).subscribe(user => {
      if (this.configId === '-1' || this.configId === '') {
        this.crud.readAllUserConfigurations(user).pipe(
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
            this.crud.createConfigurationForUser(user, this.newWindowConfig).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
            this.router.navigate(['/' + this.configurationSummary]);
            this.loading = false;
          }
        });
      } else {
        // wersja 2
        if (this.windowId === 1) {
          this.crud.createWindowConfigurationIntoConfigurationById(this.configId, this.configuredWindow, this.formName, this.form.value)
            .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
          // wersja 3
        } else {
          this.crud.updateWindowConfigurationIntoConfigurationById(this.configId, this.windowId, this.configuredWindow)
            .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
          this.crud.updateWindowFormDataByFormName(this.configId, this.formName, this.form.value)
            .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        }
        this.router.navigate(['/' + this.configurationSummary]);
        this.loading = false;
      }
    });
  }

  chooseConfigId(configForm: any) {
    // wersja 1
    if (configForm.value.configWindowFormId === undefined) {
      this.crud.createConfigurationForUser(this.currentUser, this.newWindowConfig)
        .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      // wersja 2
    } else {
      this.configId = String('configuration-' + parseInt(configForm.value.configWindowFormId, 10));
      // TODO zamienić na configuredWindow
      this.crud.createWindowConfigurationIntoConfigurationById(this.configId,
        this.tempConfiguredWindow, this.formName, this.form.value)
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
      // wersja 2
      if (this.windowId === 1) {
        this.crud.createWindowConfigurationIntoConfigurationById(this.configId, this.configuredWindow, this.formName, this.form.value)
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        // wersja 3
      } else {
        this.crud.updateWindowConfigurationIntoConfigurationById(this.configId, this.windowId, this.configuredWindow)
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      }
      temporaryUrl = this.router['location']._platformLocation.location.origin
        + '/' + this.globalId
        + '/' + this.formName
        + '/' + this.configuredWindow.kod;
      // wersja 1
    } else {
      this.crud.createConfigurationForUser('anonym', this.newWindowConfig)
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
    this.configData.fetchAllWindowExclusions().pipe(takeUntil(this.isDestroyed$)).subscribe(exclusions => {
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
}
