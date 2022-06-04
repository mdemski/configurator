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
import {RoofWindowValuesSetterService} from '../../services/roof-window-values-setter.service';
import {LoadConfigurationService} from '../../services/load-configuration.service';
import {HighestIdGetterService} from '../../services/highest-id-getter.service';
import {RandomStringGeneratorService} from '../../services/random-string-generator.service';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {filter, map, pairwise, startWith, takeUntil, tap} from 'rxjs/operators';
import {FlatConfig} from '../../models/flat-config';
import {FlatValueSetterService} from '../../services/flat-value-setter.service';

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
  private tempConfiguredWindow: FlatRoofWindow;
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
  windowsConfigurator: string;
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

  private loadForm() {
    if (this.formName === 'no-name' || this.formName === undefined) {
      this.loadConfig.getFlarRoofWindowToReconfiguration(this.currentUser, this.formName, this.routerParams.state.params.productCode).pipe(takeUntil(this.isDestroyed$))
        .subscribe(flatRoofWindowToReconfiguration => {
          this.configuredFlatRoofWindow = flatRoofWindowToReconfiguration;
          this.form = this.fb.group({
            openingType: new FormControl(this.configuredFlatRoofWindow.otwieranie, [], [this.validateOpenings.bind(this)]),
            option: new FormControl('LED'), // LED option
            glazing: new FormControl(this.configuredFlatRoofWindow.glazingToCalculation, [], [this.validateGlazing.bind(this)]),
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
      filter(([prevForm, form]: [any, any]) => form.material !== null),
      tap(() => {
        const checkboxExtraControl = this.extras as FormArray;
        this.subscription = checkboxExtraControl.valueChanges.subscribe(() => {
          checkboxExtraControl.setValue(checkboxExtraControl.value.map((value, i) =>
            value ? this.extrasFromFile[i].option : false), {emitEvent: false});
        });
      }),
      map(([prevForm, form]: [any, any]) => {
        this.setConfiguredValues(form[1]);
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

}
