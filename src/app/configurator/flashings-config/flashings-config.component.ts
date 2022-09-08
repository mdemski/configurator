import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {LoadConfigurationService} from '../../services/load-configuration.service';
import {Observable, Observer, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {filter, map, takeUntil} from 'rxjs/operators';
import {SingleConfiguration} from '../../models/single-configuration';
import {Flashing} from '../../models/flashing';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {FlashingConfig} from '../../models/flashing-config';
import {HighestIdGetterService} from '../../services/highest-id-getter.service';
import {ModalService} from '../../modal/modal.service';
import {FlashingValueSetterService} from '../../services/flashing-value-setter.service';
import {Select, Store} from '@ngxs/store';
import {FlashingState} from '../../store/flashing/flashing.state';
import {RouterState} from '@ngxs/router-plugin';
import {ConfigurationState} from '../../store/configuration/configuration.state';
import {AvailableConfigDataState} from '../../store/avaiable-config-data/available-config-data.state';
import {AppState} from '../../store/app/app.state';
import {
  AddFlashingConfiguration,
  AddFlashingConfigurations,
  AddGlobalConfiguration,
  UpdateFlashingConfiguration,
  UpdateFlashingConfigurations,
  UpdateFlashingFormByFormName
} from '../../store/configuration/configuration.actions';
import {CartState} from '../../store/cart/cart.state';
import {RandomStringGeneratorService} from '../../services/random-string-generator.service';
import {MdTranslateService} from '../../services/md-translate.service';

@Component({
  selector: 'app-flashings-config',
  templateUrl: './flashings-config.component.html',
  styleUrls: ['./flashings-config.component.scss']
})
export class FlashingsConfigComponent implements OnInit, OnDestroy, AfterViewInit {

  @Select(AppState) user$: Observable<{ currentUser }>;
  @Select(ConfigurationState.configurations) configurations$: Observable<SingleConfiguration[]>;
  @Select(FlashingState.flashings) flashings$: Observable<Flashing[]>;
  @Select(AvailableConfigDataState.configFlashings) configOptions$: Observable<any>;
  @Select(AvailableConfigDataState.flashingsConfigLoaded) configOptionsLoaded$: Observable<boolean>;
  @Select(AvailableConfigDataState.flashingsExclusions) excludeOptions$: Observable<any>;
  @Select(RouterState) params$: Observable<any>;
  @Select(CartState) cart$: Observable<any>;

  constructor(private router: Router,
              private fb: FormBuilder,
              private store: Store,
              private changeDetector: ChangeDetectorRef,
              private loadData: LoadConfigurationService,
              private flashingSetter: FlashingValueSetterService,
              private randomString: RandomStringGeneratorService,
              private hd: HighestIdGetterService,
              private modal: ModalService,
              private translate: MdTranslateService) {
    this.loading = true;
    translate.setLanguage();
    this.configOptions$.pipe(takeUntil(this.isDestroyed$)).subscribe(configOptions => this.configOptions = configOptions);
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.currentUser = user.currentUser.email);
    this.configurations$.pipe(takeUntil(this.isDestroyed$)).subscribe(configurations => this.configurations = configurations);
    this.params$.pipe(takeUntil(this.isDestroyed$)).subscribe(params => this.routerParams = params);
    this.flashings$.pipe(takeUntil(this.isDestroyed$)).subscribe(flashings => {
      this.flashingsFromDataBase = flashings;
    });
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
  }

  @ViewChildren('dimensionsPresentationDivs') dimPresentDivs: QueryList<ElementRef>;
  @ViewChildren('dimensionsPresentationDivsEqual') dimPresentDivsEqual: QueryList<ElementRef>;
  @ViewChildren('dimensionsPresentationDivsH1') dimPresentDivsH1: QueryList<ElementRef>;
  @ViewChildren('dimensionsPresentationDivsW1') dimPresentDivsW1: QueryList<ElementRef>;
  @ViewChildren('dimensionsPresentationTD') dimPresentTDS: QueryList<ElementRef>;

  private isDestroyed$ = new Subject();
  private tempConfigFlashing: Flashing;
  private flashingId: number;
  private configuredFlashingIDsArray: number[];
  private columns: ElementRef[] = [];
  private divs: ElementRef[] = [];
  private routerParams = null;
  private configOptions;
  private configurations: SingleConfiguration[];
  userConfigurations$: Observable<SingleConfiguration[]> = new Subject() as Observable<SingleConfiguration[]>;
  configByName$: Observable<FlashingConfig[]>;
  reverseModelsArrayIndex: number[];
  summaryFlashingsPrice: number;
  globalId = '';
  form: FormGroup;
  configuredFlashing: Flashing;
  configuredFlashingArray: Flashing[];
  flashingsFromDataBase: Flashing[];
  loading = false;
  flashingModels = [];
  flashingTypes: { option: string, disabled: boolean }[];
  lShaped: { option: string, disabled: boolean }[];
  apronTypes: { option: string, disabled: boolean }[];
  availableOptions: {}[];
  verticalSpacingsFromFile: {}[];
  horizontalSpacingsFromFile: {}[];
  dimensionsFromFile;
  outerMaterials: { option: string, disabled: boolean }[];
  outerColors: { option: string, disabled: boolean }[];
  outerColorFinishes: { option: string, disabled: boolean }[];
  userConfigs = [];
  configFormId: number;
  minVerticalNumber: number;
  minHorizontalNumber: number;
  maxVerticalNumber: number;
  maxHorizontalNumber: number;
  stepWidth: number;
  stepHeight: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  minWindchestLength: number;
  maxWindchestLength: number;
  showWidthMessage = false;
  showHeightMessage = false;
  chooseConfigNamePopup = false;
  copyLinkToConfigurationPopup = false;
  urlToSaveConfiguration: string;
  path: string;
  exteriorPath: string;
  private standardWidths = [55, 66, 78, 94, 114, 134];
  private standardHeights = [78, 98, 118, 140, 160];
  private currentUser: string;
  private formName: string;
  private flashingCode: string;
  private configId: string;
  private shopFlashingLink: string;
  private configurationSummary: string;
  private flashingsConfigurator: string;
  private flashingTypeVisible = true;
  private apronTypeVisible = false;
  private outerMaterialVisible = false;
  private compositionVisible = false;
  private dimensionsVisible = false;
  private highestUserId;
  private newFlashingConfig: SingleConfiguration;
  private globalConfiguration: SingleConfiguration = null;
  dimensionsPopup = false;
  widthsSize: any;
  verticalsSize: any;

  private static setDimensions(dimensions) {
    return dimensions;
  }

  private static objectsMaker(availableOptionsArray: string[]): { option: string, disabled: boolean }[] {
    const objectsArray: { option: string, disabled: boolean }[] = [];
    for (const option of availableOptionsArray) {
      const tempObject = {
        option,
        disabled: null
      };
      objectsArray.push(tempObject);
    }
    return objectsArray;
  }

  ngOnInit(): void {
    this.minVerticalNumber = 1;
    this.minHorizontalNumber = 1;
    this.maxVerticalNumber = 6;
    this.maxHorizontalNumber = 6;
    this.minWindchestLength = 10;
    this.maxWindchestLength = 150;
    this.stepWidth = 1;
    this.stepHeight = 1;
    this.minWidth = 47;
    this.minHeight = 78;
    this.maxWidth = 134;
    this.maxHeight = 160;
    this.widthsSize = 20;
    this.verticalsSize = 20;
    this.configuredFlashingArray = [];
    this.tempConfigFlashing = new Flashing('1K-1-U-UO------A7022P-055098-OKPK01', 'UN/O 055x098 Kołnierz uniwersalny /A7022P/UO/OKPK01', 'Kołnierz U 55x98 UO', 'I-KOLNIERZ', 'NPL-KOLNIERZ', 'Nowy', 'U', 55, 98, 'KołnierzUszczelniający',
      'KolnierzUszczelniający', 'Kołnierz:U', 'KołnierzUszczelniający:K-1', 'KołnierzUszczelniający', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'U', 0, 'UO', 5, 0, 0,
      270, ['78x118', '78x140'], ['assets/img/products/flashings.jpg'], 'PL', false, null, []);
    this.configByName$ = this.store.select(ConfigurationState.configurationByFlashingFormName).pipe(
      takeUntil(this.isDestroyed$),
      map(filterFn => filterFn(this.routerParams.state.params.formName)));
    this.configOptionsLoaded$.pipe(takeUntil(this.isDestroyed$)).subscribe(loaded => {
      if (loaded) {
        this.flashingModels = this.configOptions.models;
        this.flashingTypes = FlashingsConfigComponent.objectsMaker(this.configOptions.flashingTypes);
        this.lShaped = FlashingsConfigComponent.objectsMaker(this.configOptions.lShapeds);
        this.availableOptions = FlashingsConfigComponent.objectsMaker(this.configOptions.availableOptions);
        this.verticalSpacingsFromFile = this.configOptions.verticalSpacings;
        this.horizontalSpacingsFromFile = this.configOptions.horizontalSpacings;
        this.dimensionsFromFile = FlashingsConfigComponent.setDimensions(this.configOptions.dimensions);
        this.apronTypes = FlashingsConfigComponent.objectsMaker(this.configOptions.apronTypes);
        this.outerMaterials = FlashingsConfigComponent.objectsMaker(this.configOptions.outerMaterials);
        this.outerColors = FlashingsConfigComponent.objectsMaker(this.configOptions.outerColors);
        this.outerColorFinishes = FlashingsConfigComponent.objectsMaker(this.configOptions.outerColorFinishes);
        this.formName = this.routerParams.state.params.formName;
        this.flashingCode = this.routerParams.state.params.productCode;
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
      .pipe(map(filterFn => filterFn(this.currentUser)));
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.shopFlashingLink = text.shopFlashings;
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.configurationSummary = text.configurationSummary;
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.flashingsConfigurator = text.configuratorFlashings;
    });
  }

  ngAfterViewInit() {
    // tslint:disable-next-line:no-shadowed-variable
    // this.dimPresentTDS.forEach(element => element.nativeElement.setAttribute('background: green'));
  }

  initialTemplateArrays() {
    this.dimPresentTDS.changes.pipe(takeUntil(this.isDestroyed$)).subscribe((columns: QueryList<any>) => {
      columns.forEach(element => this.columns.push(element));
    });
    this.dimPresentDivsH1.changes.pipe(takeUntil(this.isDestroyed$)).subscribe((divs: QueryList<any>) => {
      divs.forEach(element => this.divs.push(element));
    });
    this.dimPresentDivsW1.changes.pipe(takeUntil(this.isDestroyed$)).subscribe((divs: QueryList<any>) => {
      divs.forEach(element => this.divs.push(element));
    });
    this.dimPresentDivsEqual.changes.pipe(takeUntil(this.isDestroyed$)).subscribe((divs: QueryList<any>) => {
      divs.forEach(element => this.divs.push(element));
    });
    this.dimPresentDivs.changes.pipe(takeUntil(this.isDestroyed$)).subscribe((divs: QueryList<any>) => {
      divs.forEach(element => this.divs.push(element));
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
  }

  private loadForm() {
    if (this.formName === 'no-name' || this.formName === undefined) {
      this.loadData.getFlashingToReconfiguration(this.currentUser, this.formName, this.flashingCode).pipe(
        takeUntil(this.isDestroyed$)).subscribe(flashingToReconfiguration => {
        this.configuredFlashing = flashingToReconfiguration;
        this.form = this.fb.group({
          flashingType: new FormControl(this.configuredFlashing.typKolnierza, [], [this.validateFlashingType.bind(this)]),
          apronType: new FormControl(this.configuredFlashing.typFartucha, [], [this.validateApronType.bind(this)]),
          outer: new FormGroup({
            outerMaterial: new FormControl(this.configuredFlashing.oblachowanieMaterial),
            outerColor: new FormControl(this.configuredFlashing.oblachowanieKolor),
            outerColorFinish: new FormControl(this.configuredFlashing.oblachowanieFinisz)
          }, [], [this.validateOuterMaterial.bind(this)]),
          composition: new FormGroup({
            verticalNumber: new FormControl(1),
            horizontalNumber: new FormControl(1),
          }),
          dimensions: this.fb.group({
            widths: this.fb.array([new FormControl(this.configuredFlashing.szerokosc)]),
            heights: this.fb.array([new FormControl(this.configuredFlashing.wysokosc)]),
            verticalSpacings: this.fb.array([]),
            horizontalSpacings: this.fb.array([])
          }, {
            asyncValidators: [this.validateDimensions.bind(this)]
          }),
          lShaped: new FormControl(null),
          windchestLength: new FormControl(80)
        });
        this.formName = this.randomString.randomString(12);
      });
      this.flashingId = 1;
      this.configuredFlashingIDsArray = [this.flashingId];
      this.formChanges();
      this.loading = false;
    } else {
      this.configByName$
        .pipe(takeUntil(this.isDestroyed$))
        .subscribe((flashingConfigurations: FlashingConfig[]) => {
          this.configuredFlashing = flashingConfigurations[0].flashing;
          flashingConfigurations.forEach(flashingConfig => this.configuredFlashingIDsArray.push(flashingConfig.id));
          flashingConfigurations.forEach(flashingConfig => this.configuredFlashingArray.push(flashingConfig.flashing));
          this.flashingId = flashingConfigurations[0].id; // w tym zwraca pierwszy id gdy znajdzie pasujący formName
          const flashingFormData = flashingConfigurations[0].flashingFormData;
          this.form = this.fb.group({
            flashingType: new FormControl(flashingFormData.flashingType, [], [this.validateFlashingType.bind(this)]),
            apronType: new FormControl(flashingFormData.apronType, [], [this.validateApronType.bind(this)]),
            outer: new FormGroup({
              outerMaterial: new FormControl(flashingFormData.outer.outerMaterial),
              outerColor: new FormControl(flashingFormData.outer.outerColor),
              outerColorFinish: new FormControl(flashingFormData.outer.outerColorFinish),
            }),
            composition: new FormGroup({
              verticalNumber: new FormControl(flashingFormData.composition.verticalNumber),
              horizontalNumber: new FormControl(flashingFormData.composition.horizontalNumber),
            }),
            dimensions: new FormGroup({
              widths: this.fb.array(flashingFormData.dimensions.widths),
              heights: this.fb.array(flashingFormData.dimensions.heights),
              verticalSpacings: this.fb.array(flashingFormData.dimensions.verticalSpacings),
              horizontalSpacings: this.fb.array(flashingFormData.dimensions.horizontalSpacings),
            }),
            lShaped: new FormControl(flashingFormData.lShaped),
            windchestLenght: new FormControl(flashingFormData.windchestLenght)
          });
          this.formChanges();
          this.loading = false;
        });
    }
  }

  get dimensions() {
    return this.form.get('dimensions') as FormGroup;
  }

  get widths() {
    // To działa, bo zwraca tablice z FormControlkami
    return this.form.get('dimensions.widths') as FormArray;
  }

  get heights() {
    // To działa, bo zwraca tablice z FormControlkami
    return this.dimensions.get('heights') as FormArray;
  }

  get verticalSpacings() {
    return this.form.get('dimensions.verticalSpacings') as FormArray;
  }

  get horizontalSpacings() {
    return this.form.get('dimensions.horizontalSpacings') as FormArray;
  }

  formChanges() {
    this.form.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      // pairwise(),
      map(form => {
        this.calcWidthInputSize();
        this.setConfiguredValues(form);
      })).subscribe();
  }

  private setConfiguredValues(form) {
    this.configuredFlashingArray = [];
    let flashingModelsArray = [];
    let reverseHeightsArray = [];
    let reverseHorizontalSpacingsArray = [];
    if (form.lShaped) {
      form.lShaped = this.lShaped[0].option;
    }
    if (form.composition.verticalNumber > 1 || form.composition.horizontalNumber > 1) {
      const modelsIndexArray = [];
      // tslint:disable-next-line:max-line-length
      flashingModelsArray = this.flashingSetter.flashingsArrayOfModelsCreator(form.composition.verticalNumber, form.composition.horizontalNumber, form.lShaped, form.flashingType, form.apronType);
      reverseHeightsArray = [...form.dimensions.heights].reverse();
      reverseHorizontalSpacingsArray = [...form.dimensions.horizontalSpacings].reverse();
      for (let i = 0; i < form.composition.horizontalNumber; i++) {
        for (let j = 0; j < form.composition.verticalNumber; j++) {
          // tslint:disable-next-line:max-line-length
          const modelsArrayIndex = (form.composition.verticalNumber * i) + ((form.composition.horizontalNumber - (form.composition.horizontalNumber - 1)) * j);
          modelsIndexArray.push(modelsArrayIndex);
          if (this.columns.length !== 0) {
            let k = -1;
            let l = -1;
            k = i === 0 ? 0 : i - 1;
            l = j === 0 ? 0 : j - 1;
            // tslint:disable-next-line:max-line-length
            this.widthsHeightsAndSpacingsSetter(modelsArrayIndex, form.dimensions.widths[j], form.dimensions.heights[i], form.dimensions.horizontalSpacings[k], form.dimensions.verticalSpacings[l]);
          }
          this.configuredFlashing = new Flashing(null, null, null, 'I-KOŁNIERZ', 'NPL-KOŁNIERZ', '1.Nowy', null,
            0, 0, 'KołnierzUszczelniający', null, null, null, null, null, null, null,
            null, 0, null, 0, 0, 0, 0,
            [], [], null, false, null, []);
          this.configuredFlashing.indeksAlgorytm = 'I-KOŁNIERZ';
          this.configuredFlashing.nazwaPLAlgorytm = 'NPL-KOŁNIERZ';
          this.configuredFlashing.status = '1. Nowy';
          this.configuredFlashing.grupaAsortymentowa = 'KołnierzUszczelniający';
          this.configuredFlashing.typ = 'KołnierzUszczelniający:DoZespoleń';
          this.configuredFlashing.geometria = form.flashingType;
          this.configuredFlashing.oblachowanieMaterial = form.outer.outerMaterial;
          this.configuredFlashing.oblachowanieKolor = form.outer.outerColor;
          this.configuredFlashing.oblachowanieFinisz = form.outer.outerColorFinish;
          this.configuredFlashing.typKolnierza = form.flashingType;
          this.flashingSetter.setTileHeight(this.configuredFlashing);
          this.configuredFlashing.cennik = 'KO';
          this.configuredFlashing.flashingCombination = true;
          // tslint:disable-next-line:max-line-length
          this.configuredFlashing.flashingCombinationCode = this.flashingSetter.generateFlashingCombinationCode(form.composition.verticalNumber,
            form.composition.horizontalNumber, form.flashingType, form.apronType);
          this.configuredFlashing.szerokosc = form.dimensions.widths[j];
          this.configuredFlashing.wysokosc = reverseHeightsArray[i];
          this.showWidthMessage = this.standardWidths.includes(form.dimensions.widths[j]);
          this.showHeightMessage = this.standardHeights.includes(reverseHeightsArray[i]);
          this.configuredFlashing.productName = this.flashingSetter.buildFlashingName(form.flashingType,
            form.dimensions.widths[j], reverseHeightsArray[i]);
          this.verticalAndHorizontalSpacingSetter(i, j, form, reverseHorizontalSpacingsArray);
          this.configuredFlashing.model = flashingModelsArray[modelsArrayIndex];
          this.configuredFlashing.rodzina = this.flashingSetter.setFlashingFamily(flashingModelsArray[modelsArrayIndex]);
          this.configuredFlashing.rodzaj = this.flashingSetter.setFlashingType(flashingModelsArray[modelsArrayIndex]);
          this.configuredFlashing.typFartucha = this.flashingSetter.setFlashingApronType(this.configuredFlashing.rodzina, form.apronType);
          this.configuredFlashing.wiatrownicaDlugosc = this.configuredFlashing.rodzina === 'KołnierzUszczelniający:KK'
            ? this.configuredFlashing.wiatrownicaDlugosc = Number(form.wiatrownicaDlugosc) : 0;
          this.configuredFlashing.kod = this.flashingSetter.generateFlashingCode(flashingModelsArray[modelsArrayIndex], form.flashingType,
            this.configuredFlashing.typFartucha, this.configuredFlashing.rozstawPoziom, this.configuredFlashing.rozstawPion,
            form.outer.outerMaterial, form.outer.outerColor, form.outer.outerColorFinish,
            form.dimensions.widths[j], reverseHeightsArray[i]);
          this.configuredFlashing.CenaDetaliczna = this.setFlashingPrice(this.configuredFlashing);
          this.setDisabled(this.configuredFlashing);
          this.setProductPath(form.composition.verticalNumber, form.composition.horizontalNumber);
          this.setExteriorPath(this.configuredFlashing, form.composition.verticalNumber, form.composition.horizontalNumber);
          this.configuredFlashingArray.push(this.configuredFlashing);
        }
      }
      this.reverseModelsArrayIndex = [...modelsIndexArray].reverse().reverse();
      this.summaryFlashingsPriceSetter(this.configuredFlashingArray);
    } else {
      this.configuredFlashing = new Flashing(null, null, null, 'I-KOŁNIERZ', 'NPL-KOŁNIERZ', '1.Nowy', null,
        0, 0, 'KołnierzUszczelniający', null, null, null, null, null, null, null,
        null, 0, null, 0, 0, 0, 0,
        [], [], null, false, null, []);
      this.configuredFlashing.model = this.flashingSetter.singleFlashingModelCreator(form.flashingType, form.apronType);
      // tslint:disable-next-line:max-line-length
      this.configuredFlashing.productName = this.flashingSetter.buildFlashingName(form.flashingType, form.dimensions.widths[0], form.dimensions.heights[0]);
      this.configuredFlashing.indeksAlgorytm = 'I-KOŁNIERZ';
      this.configuredFlashing.nazwaPLAlgorytm = 'NPL-KOŁNIERZ';
      this.configuredFlashing.status = '1. Nowy';
      this.configuredFlashing.szerokosc = form.dimensions.widths[0];
      this.configuredFlashing.wysokosc = form.dimensions.heights[0];
      this.showWidthMessage = this.standardWidths.includes(form.dimensions.widths[0]);
      this.showHeightMessage = this.standardHeights.includes(form.dimensions.heights[0]);
      this.configuredFlashing.grupaAsortymentowa = 'KołnierzUszczelniający';
      this.configuredFlashing.typ = 'KołnierzUszczelniający:Pojedynczy';
      this.configuredFlashing.geometria = form.flashingType;
      this.configuredFlashing.rodzaj = 'KołnierzUszczelniający:K-1';
      this.configuredFlashing.rodzina = 'KołnierzUszczelniający:K1';
      this.configuredFlashing.oblachowanieMaterial = form.outer.outerMaterial;
      this.configuredFlashing.oblachowanieKolor = form.outer.outerColor;
      this.configuredFlashing.oblachowanieFinisz = form.outer.outerColorFinish;
      this.configuredFlashing.typKolnierza = form.flashingType;
      this.configuredFlashing.wiatrownicaDlugosc = 0;
      this.configuredFlashing.typFartucha = form.apronType;
      this.flashingSetter.setTileHeight(this.configuredFlashing);
      this.configuredFlashing.rozstawPoziom = 0;
      this.configuredFlashing.rozstawPion = 0;
      this.configuredFlashing.cennik = 'KO';
      this.configuredFlashing.flashingCombination = false;
      this.configuredFlashing.flashingCombinationCode = null;
      this.configuredFlashing.kod = this.flashingSetter.generateFlashingCode(null, form.flashingType, form.apronType,
        this.configuredFlashing.rozstawPoziom, this.configuredFlashing.rozstawPion, form.outer.outerMaterial, form.outer.outerColor,
        form.outer.outerColorFinish, form.dimensions.widths[0], form.dimensions.heights[0]);
      this.configuredFlashing.CenaDetaliczna = this.setFlashingPrice(this.configuredFlashing);
      this.setDisabled(this.configuredFlashing);
      this.setExteriorPath(this.configuredFlashing, form.composition.verticalNumber, form.composition.horizontalNumber);
      this.setProductPath(form.composition.verticalNumber, form.composition.horizontalNumber);
    }
  }

  verticalAndHorizontalSpacingSetter(i: number, j: number, form: any, reverseHorizontalSpacingsArray: number[]) {
    if (i < 1) {
      this.configuredFlashing.rozstawPoziom = j === 0
        ? Number(form.dimensions.verticalSpacings[j]) : Number(form.dimensions.verticalSpacings[j - 1]);
      this.configuredFlashing.rozstawPion = 0;
    } else {
      this.configuredFlashing.rozstawPion = i === 0
        ? Number(reverseHorizontalSpacingsArray[i]) : Number(reverseHorizontalSpacingsArray[i - 1]);
      this.configuredFlashing.rozstawPoziom = j === 0
        ? Number(form.dimensions.verticalSpacings[j]) : Number(form.dimensions.verticalSpacings[j - 1]);
    }
  }

  private setFlashingPrice(configuredFlashing: Flashing) {
    let flashingPrice = 0;
    let isStandard = false;
    let index = -1;
    for (let i = 0; i < this.flashingModels.length; i++) {
      if (this.flashingModels[i].flashingModel === configuredFlashing.model) {
        index = i;
      }
    }
    const flashingToCalculations = this.flashingModels[index];
    for (const standardFlashing of this.flashingsFromDataBase) {
      if (standardFlashing.kod === configuredFlashing.kod) {
        flashingPrice = standardFlashing.CenaDetaliczna;
        isStandard = true;
      }
    }
    if (index > -1 && !isStandard) {
      if (configuredFlashing.typKolnierza) {
        flashingPrice += this.getFlashingCircuit(configuredFlashing) * flashingToCalculations[configuredFlashing.typKolnierza];
      }
      if (configuredFlashing.typFartucha) {
        flashingPrice += configuredFlashing.szerokosc * flashingToCalculations[configuredFlashing.typFartucha];
      }
      if (configuredFlashing.oblachowanieMaterial) {
        flashingPrice += this.getFlashingCircuit(configuredFlashing) * flashingToCalculations[configuredFlashing.oblachowanieMaterial];
      }
      if (configuredFlashing.oblachowanieKolor) {
        flashingPrice += this.getFlashingCircuit(configuredFlashing) * flashingToCalculations[configuredFlashing.oblachowanieKolor];
      }
      if (configuredFlashing.oblachowanieFinisz) {
        flashingPrice += this.getFlashingCircuit(configuredFlashing) * flashingToCalculations[configuredFlashing.oblachowanieFinisz];
      }
    }
    // console.log(flashingPrice);
    return flashingPrice;
  }

  summaryFlashingsPriceSetter(flashings: Flashing[]) {
    this.summaryFlashingsPrice = 0;
    flashings.forEach(flashing => this.summaryFlashingsPrice += flashing.CenaDetaliczna);
  }

  widthsControlsArrayMaker() {
    this.removingOldControls(this.widths);
    if (this.form) {
      const numberOfControls = this.form.get('composition.verticalNumber').value;
      for (let i = 0; i < numberOfControls; i++) {
        this.widths.push(new FormControl(this.configuredFlashing.szerokosc));
      }
    }
  }

  heightsControlsArrayMaker() {
    this.removingOldControls(this.heights);
    if (this.form) {
      const numberOfControls = this.form.get('composition.horizontalNumber').value;
      for (let i = 0; i < numberOfControls; i++) {
        this.heights.push(new FormControl(this.configuredFlashing.wysokosc));
      }
    }
  }

  verticalSpacingControlsMaker() {
    this.removingOldControls(this.verticalSpacings);
    if (this.form) {
      const numberOfControls = this.form.get('composition.verticalNumber').value;
      for (let i = 0; i < numberOfControls - 1; i++) {
        this.verticalSpacings.push(new FormControl());
      }
    }
  }

  horizontalSpacingControlsMaker() {
    this.removingOldControls(this.horizontalSpacings);
    if (this.form) {
      const numberOfControls = this.form.get('composition.horizontalNumber').value;
      for (let i = 0; i < numberOfControls - 1; i++) {
        this.horizontalSpacings.push(new FormControl());
      }
    }
  }

  removingOldControls(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  // VALIDATORS
  validateFlashingType<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let errors = {
        'empty flashingType': true
      };
      this.configOptionsLoaded$.pipe(takeUntil(this.isDestroyed$)).subscribe(loaded => {
        if (loaded) {
          for (const option of this.configOptions.flashingTypes) {
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

  validateApronType<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let errors = {
        'empty apronType': true
      };
      this.configOptionsLoaded$.pipe(takeUntil(this.isDestroyed$)).subscribe(loaded => {
        if (loaded) {
          for (const option of this.configOptions.apronTypes) {
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

  validateDimensions<AsyncValidatorFn>(group: FormGroup) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let errors = {
        'wrong dimensions': true
      };
      for (const width of group.controls.widths.value) {
        if (!isNaN(width)) {
          errors = null;
        }
      }
      for (const height of group.controls.heights.value) {
        if (!isNaN(height)) {
          errors = null;
        }
      }
      for (const vertical of group.controls.verticalSpacings.value) {
        if (!isNaN(vertical)) {
          errors = null;
        }
      }
      for (const horizontal of group.controls.horizontalSpacings.value) {
        if (!isNaN(horizontal)) {
          errors = null;
        }
      }
      observer.next(errors);
      observer.complete();
    });
  }

  getFlashingCircuit(configuredFlashing) {
    return 2 * configuredFlashing.szerokosc + 2 * configuredFlashing.wysokosc;
  }

  private setProductPath(verticalNumber, horizontalNumber) {
    this.path = String(verticalNumber + 'x' + horizontalNumber + '.jpg');
  }

  private setExteriorPath(configuredFlashing: Flashing, verticalNumber, horizontalNumber) {
    if (configuredFlashing) {
      if (configuredFlashing.model === '' || configuredFlashing.model === null) {
        this.exteriorPath = 'H9-A7022P-1x1.jpg';
      } else {
        const model = configuredFlashing.model.split(':')[1];
        let outerMaterialCode = '';
        if (configuredFlashing.oblachowanieMaterial === '' || configuredFlashing.oblachowanieMaterial === null) {
          outerMaterialCode = 'A';
        } else {
          switch (configuredFlashing.oblachowanieMaterial) {
            case 'Aluminium':
              outerMaterialCode = 'A';
              break;
            case 'Miedź':
              outerMaterialCode = 'C';
              break;
            case 'TytanCynk':
              outerMaterialCode = 'T';
              break;
            default:
              outerMaterialCode = 'A';
          }
        }

        let outerColorCode = '';
        if (configuredFlashing.oblachowanieKolor === '' || configuredFlashing.oblachowanieKolor === null) {
          outerColorCode = '7022';
        } else {
          if (configuredFlashing.oblachowanieKolor.split(':')[0] === 'Aluminium') {
            outerColorCode = configuredFlashing.oblachowanieKolor.substring(configuredFlashing.oblachowanieKolor.length - 4);
          }
          if (configuredFlashing.oblachowanieKolor === 'Miedź:Natur') {
            outerColorCode = '0000';
          }
          if (configuredFlashing.oblachowanieKolor === 'TytanCynk:Natur') {
            outerColorCode = '0000';
          }
          if (configuredFlashing.oblachowanieKolor === '') {
            outerColorCode = '7022';
          }
        }

        let outerFinishCode = '';
        if (configuredFlashing.oblachowanieFinisz === '' || configuredFlashing.oblachowanieFinisz === null) {
          outerFinishCode = 'P';
        } else {
          switch (configuredFlashing.oblachowanieFinisz) {
            case 'Aluminium:Półmat':
              outerFinishCode = 'P';
              break;
            case 'Aluminium:Mat':
              outerFinishCode = 'M';
              break;
            case 'Aluminium:Połysk':
              outerFinishCode = 'B';
              break;
            case 'Aluminium:Natur':
              outerFinishCode = '0';
              break;
            default:
              outerFinishCode = 'P';
          }
        }
        this.exteriorPath = String(model + '-' + outerMaterialCode + outerColorCode + outerFinishCode + '-' + verticalNumber + 'x' + horizontalNumber + '.jpg');
      }
    } else {
      this.exteriorPath = 'H9-A7022P-1x1.jpg';
    }
  }

  closeAllHovers(htmlDivElements: HTMLDivElement[]) {
    this.flashingTypeVisible = false;
    this.apronTypeVisible = false;
    this.outerMaterialVisible = false;
    this.compositionVisible = false;
    this.dimensionsVisible = false;
    for (const divElement of htmlDivElements) {
      divElement.style.maxHeight = '0';
      divElement.style.transition = 'all .7s ease-in-out';
    }
  }

  private onHoverClick(divEle: HTMLDivElement, length: number, visibility: boolean) {
    if (!visibility) {
      divEle.style.maxHeight = '0';
      divEle.style.transition = 'all .7s ease-in-out';
    } else {
      divEle.style.maxHeight = length * 105 + 120 + 'px';
      divEle.style.transition = 'all .7s ease-in-out';
    }
    const scrollCorrection = window.scrollY === 0 ? 200 : window.scrollY;
    window.scrollTo({top: divEle.getBoundingClientRect().top - scrollCorrection, behavior: 'smooth'});
  }

  onFlashingTypeHover(flashingType: HTMLDivElement) {
    this.flashingTypeVisible = !this.flashingTypeVisible;
    this.onHoverClick(flashingType, this.apronTypes.length, this.flashingTypeVisible);
  }

  onApronTypeHover(apronType: HTMLDivElement) {
    this.apronTypeVisible = !this.apronTypeVisible;
    this.onHoverClick(apronType, this.apronTypes.length, this.apronTypeVisible);
  }

  onOuterMaterialHover(outerMaterial: HTMLDivElement) {
    this.outerMaterialVisible = !this.outerMaterialVisible;
    const length = this.outerColors.length + this.outerMaterials.length + this.outerColorFinishes.length + 1;
    this.onHoverClick(outerMaterial, length, this.outerMaterialVisible);
  }

  onCompositionHover(composition: HTMLDivElement) {
    this.compositionVisible = !this.compositionVisible;
    this.onHoverClick(composition, 3, this.compositionVisible);
  }

  onDimensionsHover(dimension: HTMLDivElement) {
    this.dimensionsVisible = !this.dimensionsVisible;
    const verticalNumberOfControls = this.form.get('composition.verticalNumber').value;
    const horizontalNumberOfControls = this.form.get('composition.horizontalNumber').value;
    if (verticalNumberOfControls > 1 || horizontalNumberOfControls > 1) {
      this.columns = [];
      this.divs = [];
      this.dimensionsPopup = true;
      this.changeDetector.detectChanges();
      this.dimPresentTDS.forEach(td => this.columns.push(td));
      if (this.dimPresentDivsEqual) {
        this.dimPresentDivsEqual.forEach(div => this.divs.push(div));
      }
      if (this.dimPresentDivs) {
        this.dimPresentDivs.forEach(div => this.divs.push(div));
      }
      if (this.dimPresentDivsH1) {
        this.dimPresentDivsH1.forEach(h1 => this.divs.push(h1));
      }
      if (this.dimPresentDivsW1) {
        this.dimPresentDivsW1.forEach(w1 => this.divs.push(w1));
      }
    } else {
      const rows = this.widths.length +
        this.heights.length +
        this.horizontalSpacings.length +
        this.verticalSpacings.length + 2;
      this.onHoverClick(dimension, rows, this.dimensionsVisible);
    }
  }

  calcWidthInputSize() {
    const numberOfControls = this.form.get('composition.verticalNumber').value;
    if (numberOfControls > 3) {
      this.widthsSize = 70 / numberOfControls;
      this.verticalsSize = 70 / numberOfControls;
    }
  }

  hideDimensionsPopup() {
    if (this.dimensionsPopup) {
      this.dimensionsPopup = false;
    }
  }

  setBackgroundImage(option: string) {
    const twoParts = option.split(':');
    let fileName = '';
    if (twoParts[1] === undefined || twoParts[1] === 'TRUE') {
      fileName = twoParts[0];
    } else {
      fileName = twoParts[1];
    }
    if (option === 'Miedź:Natur') {
      fileName = 'Miedź-Kolor';
    }
    if (option === 'TytanCynk:Natur') {
      fileName = 'TytanCynk-Kolor';
    }
    return {
      ['background-image']: 'url("assets/img/configurator/flashing_configurator/central_options_pictures/' + fileName + '.png")',
      ['background-size']: 'contain',
      ['background-repeat']: 'no-repeat'
    };
  }

  private widthsHeightsAndSpacingsSetter(elementIndex, width, height, horizontalSpacing, verticalSpacing) {
    this.divs[elementIndex].nativeElement.style.marginLeft = verticalSpacing / 10 + 'rem';
    this.divs[elementIndex].nativeElement.style.marginTop = horizontalSpacing / 10 + 'rem';
    // this.columns[elementIndex].nativeElement.style.width = width / 10 + 'rem';
    this.divs[elementIndex].nativeElement.style.width = width / 10 + 'rem';
    // this.columns[elementIndex].nativeElement.style.height = height / 10 + 'rem';
    this.divs[elementIndex].nativeElement.style.height = height / 10 + 'rem';
  }

  builtNameForTranslation(option: string) {
    return String('FLASHINGS-DATA.' + option);
  }

  returnCurrencyName(currency: string) {
    if (currency === 'EUR') {
      return '€';
    } else {
      return 'zł';
    }
  }

  navigateToShop() {
    const flashingInfo = new Subject();
    const flashingInfoChange$ = flashingInfo.asObservable();
    flashingInfo.next([
      this.configuredFlashing.model,
      this.configuredFlashing.szerokosc,
      this.configuredFlashing.wysokosc]);
    console.log(this.shopFlashingLink);
    this.router.navigate(['/' + this.shopFlashingLink]);
  }

  closeCopyLinkPopUp() {
    this.chooseConfigNamePopup = false;
    this.copyLinkToConfigurationPopup = false;
  }

  resetConfigForm() {
    this.router.navigate(['/' + this.flashingsConfigurator]);
  }

  onSubmit() {
    // TODO napisać funkcję do zapisu konfiguracji kołnierzy
    if (this.configuredFlashingArray.length === 0) {
      this.newFlashingConfig = {
        products: {
          windows: null,
          flashings: [{
            id: this.flashingId,
            quantity: 1,
            flashing: this.configuredFlashing,
            flashingFormName: this.formName,
            flashingFormData: this.form.value,
            configLink: String(this.router['location']._platformLocation.location.origin
              + '/' + this.globalId
              + '/' + this.formName
              + '/' + this.configuredFlashing.kod)
          }],
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
    } else {
      const temporaryFlashingConfigsArray: FlashingConfig[] = [];
      let id = 0;
      for (const flashing of this.configuredFlashingArray) {
        if (this.configuredFlashingIDsArray[id] === undefined) {
          this.configuredFlashingIDsArray[id] = id + 1;
        }
        temporaryFlashingConfigsArray.push(
          {
            id: this.configuredFlashingIDsArray[id],
            quantity: 1,
            flashing,
            flashingFormName: this.formName,
            flashingFormData: this.form.value,
            configLink: String(this.router['location']._platformLocation.location.origin
              + '/' + this.globalId
              + '/' + this.formName
              + '/' + this.configuredFlashing.kod)
          });
        id++;
      }
      this.newFlashingConfig = {
        products: {
          windows: null,
          flashings: temporaryFlashingConfigsArray,
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
    }
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
        this.newFlashingConfig.userId = this.highestUserId;
        // wersja 1 lub 2
        if (this.userConfigs.length !== 0) {
          this.userConfigs.push(this.newFlashingConfig);
          this.loading = false;
          this.chooseConfigNamePopup = true;
          // wersja 1
        } else {
          this.newFlashingConfig.products.flashings.forEach(element2 => element2.configLink = String(
            this.router['location']._platformLocation.location.origin + this.router.url
            + '/' + this.newFlashingConfig.globalId
            + '/' + element2.flashingFormName
            + '/' + element2.flashing.kod));
          this.store.dispatch(new AddGlobalConfiguration(this.currentUser, this.newFlashingConfig))
            .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
          this.router.navigate(['/' + this.configurationSummary]);
          this.loading = false;
        }
      });
    } else {
      // wersja 2
      const temporaryLink = String(
        this.router['location']._platformLocation.location.origin
        + '/' + this.newFlashingConfig.globalId
        + '/' + this.formName
        + '/' + this.configuredFlashing.kod);
      if (this.flashingId === 1) {
        if (this.configuredFlashingArray.length === 0) {
          // tslint:disable-next-line:max-line-length
          this.store.dispatch(new AddFlashingConfiguration(this.globalConfiguration, this.configuredFlashing,
            this.formName, this.form.value, temporaryLink))
            .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        } else {
          this.store.dispatch(new AddFlashingConfigurations(this.globalConfiguration,
            this.newFlashingConfig.products.flashings)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        }
        // wersja 3
      } else {
        if (this.configuredFlashingArray.length === 0) {
          this.store.dispatch(new UpdateFlashingConfiguration(this.globalConfiguration, this.flashingId, this.configuredFlashing))
            .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        } else {
          this.store.dispatch(new UpdateFlashingConfigurations(this.globalConfiguration,
            this.newFlashingConfig.products.flashings)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        }
        this.store.dispatch(new UpdateFlashingFormByFormName(this.globalConfiguration, this.formName, this.form.value))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      }
      this.router.navigate(['/' + this.configurationSummary]);
      this.loading = false;
    }
  }

  chooseConfigId() {
    // wersja 1
    if (this.configFormId === undefined) {
      this.store.dispatch(new AddGlobalConfiguration(this.currentUser, this.newFlashingConfig))
        .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      // wersja 2
    } else {
      const temporaryLink = String(
        this.router['location']._platformLocation.location.origin
        + '/' + this.newFlashingConfig.globalId
        + '/' + this.formName
        + '/' + this.configuredFlashing.kod);
      this.configId = String('configuration-' + this.configFormId);
      this.globalConfiguration = this.configurations.find(config => config.userId === this.configFormId && config.user === this.currentUser);
      if (this.configuredFlashingArray.length === 0) {
        // tslint:disable-next-line:max-line-length
        this.store.dispatch(new AddFlashingConfiguration(this.globalConfiguration, this.configuredFlashing,
          this.formName, this.form.value, temporaryLink)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      } else {
        this.store.dispatch(new AddFlashingConfigurations(this.globalConfiguration,
          this.newFlashingConfig.products.flashings)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      }
    }
    this.chooseConfigNamePopup = false;
    this.router.navigate(['/' + this.configurationSummary]);
  }

  hidePopup() {
    this.chooseConfigNamePopup = false;
  }

  saveCopyLinkPopUp() {
    let temporaryUrl = '';
    this.loading = true;
    this.copyLinkToConfigurationPopup = true;
    // zapis konfiguracji z pojedynczym kołnierzem
    if (this.configuredFlashingArray.length === 0) {
      this.newFlashingConfig = {
        products: {
          windows: null,
          flashings: [{
            id: this.flashingId,
            quantity: 1,
            flashing: this.configuredFlashing,
            flashingFormName: this.formName,
            flashingFormData: this.form.value,
            configLink: String(this.router['location']._platformLocation.location.origin
              + '/' + this.globalId
              + '/' + this.formName
              + '/' + this.configuredFlashing.kod)
          }],
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
        temporaryUrl = this.router['location']._platformLocation.location.origin
          + '/' + this.globalId
          + '/' + this.formName
          + '/' + this.configuredFlashing.kod;
        if (this.flashingId === 1) {
          this.store.dispatch(new AddFlashingConfiguration(this.globalConfiguration, this.configuredFlashing,
            this.formName, this.form.value, temporaryUrl)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
          // wersja 3
        } else {
          this.store.dispatch(new UpdateFlashingConfiguration(this.globalConfiguration, this.flashingId, this.configuredFlashing))
            .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        }
        // wersja 1
      } else {
        this.newFlashingConfig.products.flashings.forEach(element2 => element2.configLink = String(
          this.router['location']._platformLocation.location.origin + this.router.url
          + '/' + this.newFlashingConfig.globalId
          + '/' + element2.flashingFormName
          + '/' + element2.flashing.kod));
        this.store.dispatch(new AddGlobalConfiguration('anonym', this.newFlashingConfig))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        temporaryUrl = this.router['location']._platformLocation.location.origin + this.router.url
          + '/' + this.newFlashingConfig.globalId
          + '/' + this.newFlashingConfig.products.flashings[0].flashingFormName
          + '/' + this.newFlashingConfig.products.flashings[0].flashing.kod;
      }
      this.urlToSaveConfiguration = temporaryUrl;
      this.loading = false;
      // zapis konfiguracji z kołnierzami w kombi
    } else {
      const temporaryFlashingConfigsArray: FlashingConfig[] = [];
      let id = 0;
      for (const flashing of this.configuredFlashingArray) {
        if (this.configuredFlashingIDsArray[id] === undefined) {
          this.configuredFlashingIDsArray[id] = id + 1;
        }
        temporaryFlashingConfigsArray.push(
          {
            id: this.configuredFlashingIDsArray[id],
            quantity: 1,
            flashing,
            flashingFormName: this.formName,
            flashingFormData: this.form.value,
            configLink: String(this.router['location']._platformLocation.location.origin
              + '/' + this.globalId
              + '/' + this.formName
              + '/' + this.configuredFlashing.kod)
          });
        id++;
      }
      this.newFlashingConfig = {
        products: {
          windows: null,
          flashings: temporaryFlashingConfigsArray,
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
      if (this.configId === this.globalId) {
        // wersja 2
        if (this.flashingId === 1) {
          this.store.dispatch(new AddFlashingConfigurations(this.globalConfiguration, temporaryFlashingConfigsArray))
            .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
          // wersja 3
        } else {
          this.store.dispatch(new UpdateFlashingConfigurations(this.globalConfiguration, temporaryFlashingConfigsArray))
            .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        }
        temporaryUrl = this.router['location']._platformLocation.location.origin
          + '/' + this.globalId
          + '/' + this.formName
          + '/' + this.configuredFlashing.kod;
        // wersja 1
      } else {
        this.newFlashingConfig.products.flashings.forEach(element2 => element2.configLink = String(
          this.router['location']._platformLocation.location.origin + this.router.url
          + '/' + this.newFlashingConfig.globalId
          + '/' + element2.flashingFormName
          + '/' + element2.flashing.kod));
        this.store.dispatch(new AddGlobalConfiguration('anonym', this.newFlashingConfig))
          .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
        temporaryUrl = this.router['location']._platformLocation.location.origin + this.router.url
          + '/' + this.newFlashingConfig.globalId
          + '/' + this.newFlashingConfig.products.flashings[0].flashingFormName
          + '/' + this.newFlashingConfig.products.flashings[0].flashing.kod;
      }
    }
    this.urlToSaveConfiguration = temporaryUrl;
    this.loading = false;
  }

  openModal(text: string, event: MouseEvent) {
    this.modal.open(text, event);
  }

  closeModal(text: string) {
    this.modal.close(text);
  }

  // DISABLE INPUT SETTER LOGIC
  resetAllArrays(flashingTypes: { option: string; disabled: boolean }[], apronTypes: { option: string; disabled: boolean }[],
                 lShapeds: { option: string; disabled: boolean }[], outerMaterials: { option: string; disabled: boolean }[],
                 outerColors: { option: string; disabled: boolean }[], outerColorFinishes: { option: string; disabled: boolean }[]) {
    for (const flashingType of flashingTypes) {
      flashingType.disabled = null;
    }
    for (const apronType of apronTypes) {
      apronType.disabled = null;
    }
    for (const lShaped of lShapeds) {
      lShaped.disabled = null;
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
  }

  setDisabled(configuredFlashing: Flashing) {
    this.resetAllArrays(this.flashingTypes, this.apronTypes, this.lShaped, this.outerMaterials, this.outerColors, this.outerColorFinishes);
    this.excludeOptions$.pipe(takeUntil(this.isDestroyed$)).subscribe(exclusions => {
      const excludedOptions = [];
      // tslint:disable-next-line:forin
      for (const configuratedOption in configuredFlashing) {
        for (const exclusionObject of exclusions) {
          if (exclusionObject.selectedOption === configuredFlashing[configuratedOption]) {
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
      this.setDisabledOptions(excludedOptions, this.flashingTypes, this.apronTypes, this.lShaped, this.outerMaterials,
        this.outerColors, this.outerColorFinishes);
    });
  }

  private setDisabledOptions(excludedOptions: string[], flashingTypes: { option: string; disabled: boolean }[],
                             apronTypes: { option: string; disabled: boolean }[], lShaped: { option: string; disabled: boolean }[],
                             outerMaterials: { option: string; disabled: boolean }[], outerColors: { option: string; disabled: boolean }[],
                             outerColorFinishes: { option: string; disabled: boolean }[]) {
    for (const excludedOption of excludedOptions) {
      for (const flashingType of flashingTypes) {
        if (flashingType.option === excludedOption) {
          flashingType.disabled = true;
        }
      }
      for (const apronType of apronTypes) {
        if (apronType.option === excludedOption) {
          apronType.disabled = true;
        }
      }
      for (const lShapedElement of lShaped) {
        if (lShapedElement.option === excludedOption) {
          lShapedElement.disabled = true;
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
    }
  }

  chosenConfigID() {
    console.log(this.configFormId);
  }
}
