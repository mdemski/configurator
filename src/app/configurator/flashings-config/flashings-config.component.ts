import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit, QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
import {LoadConfigurationService} from '../../services/load-configuration.service';
import {ConfigurationDataService} from '../../services/configuration-data.service';
import {TranslateService} from '@ngx-translate/core';
import {combineLatest, Observable, ObservedValueOf, Observer, Subject} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CrudFirebaseService} from '../../services/crud-firebase-service';
import {map, pairwise, takeUntil} from 'rxjs/operators';
import {SingleConfiguration} from '../../models/single-configuration';
import {Flashing} from '../../models/flashing';
import {FormArray, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors} from '@angular/forms';
import {FlashingConfig} from '../../models/flashing-config';
import {HighestIdGetterService} from '../../services/highest-id-getter.service';
import {ModalService} from '../../modal/modal.service';
import {FlashingValueSetterService} from '../../services/flashing-value-setter.service';
import {DatabaseService} from '../../services/database.service';

@Component({
  selector: 'app-flashings-config',
  templateUrl: './flashings-config.component.html',
  styleUrls: ['./flashings-config.component.scss']
})
export class FlashingsConfigComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private activeRouter: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private changeDetector: ChangeDetectorRef,
              private authService: AuthService,
              private dataBase: DatabaseService,
              private loadData: LoadConfigurationService,
              private flashingSetter: FlashingValueSetterService,
              private configData: ConfigurationDataService,
              private crud: CrudFirebaseService,
              private hd: HighestIdGetterService,
              private modal: ModalService,
              public translate: TranslateService) {
    this.loading = true;
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
    this.paramsUserFetchData$ = combineLatest(this.authService.returnUser(), this.activeRouter.params,
      this.configData.fetchAllFlashingsData(), this.crud.readAllConfigurationsFromMongoDB()
    ).pipe(
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

  @ViewChildren('dimensionsPresentationDivs') dimPresentDivs: QueryList<ElementRef>;
  @ViewChildren('dimensionsPresentationDivsEqual') dimPresentDivsEqual: QueryList<ElementRef>;
  @ViewChildren('dimensionsPresentationDivsH1') dimPresentDivsH1: QueryList<ElementRef>;
  @ViewChildren('dimensionsPresentationDivsW1') dimPresentDivsW1: QueryList<ElementRef>;
  @ViewChildren('dimensionsPresentationTD') dimPresentTDS: QueryList<ElementRef>;

  // tslint:disable-next-line:max-line-length
  private paramsUserFetchData$: Observable<{ params: ObservedValueOf<Observable<Params>>; user: string; fetch: any; configurations: SingleConfiguration[] }>;
  private isDestroyed$ = new Subject();
  private tempConfigFlashing: Flashing;
  private flashingId: number;
  private columns: ElementRef[] = [];
  private divs: ElementRef[] = [];
  private tablePresentation: ElementRef = null;
  reverseModelsArrayIndex: number[];
  summaryFlashingsPrice: number;
  form: FormGroup;
  configuredFlashing: Flashing;
  configuredFlashingArray: Flashing[];
  flashingsFromDataBase: Flashing[];
  loading = false;
  flashingModels = [];
  flashingTypes: {}[];
  lShaped: {};
  apronTypes: {}[];
  availableOptions: {}[];
  verticalSpacingsFromFile: {}[];
  horizontalSpacingsFromFile: {}[];
  dimensionsFromFile;
  outerMaterials: {}[];
  outerColors: {}[];
  outerColorFinishes: {}[];
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
  private temporaryConfig: SingleConfiguration;
  dimensionsPopup = false;
  widthsSize: any;
  verticalsSize: any;

  private static setDimensions(dimensions) {
    return dimensions;
  }

  private static objectsMaker(availableOptionsArray: string[]): {}[] {
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

  private static objectMaker(option: string): {} {
    return {
      option,
      disabled: null
    };
  }

  ngOnInit(): void {
    this.minVerticalNumber = 1;
    this.minHorizontalNumber = 1;
    this.maxVerticalNumber = 10;
    this.maxHorizontalNumber = 10;
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
      270, ['78x118', '78x140'], ['assets/img/products/flashings.jpg'], 'PL', false, null);
    this.paramsUserFetchData$.pipe(
      takeUntil(this.isDestroyed$),
      map((data: { params: ObservedValueOf<Observable<Params>>; user: string; fetch: any }) => {
        this.flashingModels = data.fetch.models;
        this.flashingTypes = FlashingsConfigComponent.objectsMaker(data.fetch.flashingTypes);
        this.lShaped = FlashingsConfigComponent.objectsMaker(data.fetch.lShapeds);
        this.availableOptions = FlashingsConfigComponent.objectsMaker(data.fetch.availableOptions);
        this.verticalSpacingsFromFile = data.fetch.verticalSpacings;
        this.horizontalSpacingsFromFile = data.fetch.horizontalSpacings;
        this.dimensionsFromFile = FlashingsConfigComponent.setDimensions(data.fetch.dimensions);
        this.apronTypes = FlashingsConfigComponent.objectsMaker(data.fetch.apronTypes);
        this.outerMaterials = FlashingsConfigComponent.objectsMaker(data.fetch.outerMaterials);
        this.outerColors = FlashingsConfigComponent.objectsMaker(data.fetch.outerColor);
        this.outerColorFinishes = FlashingsConfigComponent.objectsMaker(data.fetch.outerColorFinishes);
        this.currentUser = data.user;
        this.formName = data.params.formName;
        this.flashingCode = data.params.productCode;
        this.configId = data.params.configId === undefined ? '-1' : data.params.configId;
      })).subscribe(() => {
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
              // TODO przestawić wyjściowo na 1 i 1
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
        });
        this.formChanges();
        this.loading = false;
      } else {
        this.loadData.getFlashingConfigurationByFormName(this.formName)
          .pipe(takeUntil(this.isDestroyed$))
          .subscribe((flashingConfiguration: FlashingConfig) => {
            this.configuredFlashing = flashingConfiguration.flashing;
            this.flashingId = flashingConfiguration.id;
            const flashingFormData = flashingConfiguration.flashingFormData;
            this.form = this.fb.group({
              flashingType: new FormControl(flashingFormData.type, [], [this.validateFlashingType.bind(this)]),
              apronType: new FormControl(flashingFormData.apronType, [], [this.validateApronType.bind(this)]),
              outer: new FormGroup({
                outerMaterial: new FormControl(flashingFormData.outerMaterial),
                outerColor: new FormControl(flashingFormData.outerColor),
                outerColorFinish: new FormControl(flashingFormData.outerColorFinish),
              }),
              composition: new FormGroup({
                verticalNumber: new FormControl(flashingFormData.verticalNumber),
                horizontalNumber: new FormControl(flashingFormData.horizontalNumber),
              }),
              dimensions: new FormGroup({
                widths: new FormArray(flashingFormData.widths),
                heights: new FormArray(flashingFormData.heights),
                verticalSpacings: new FormArray(flashingFormData.verticalSpacings),
                horizontalSpacings: new FormArray(flashingFormData.horizontalSpacings),
              }),
              lShaped: new FormControl(flashingFormData.lShaped),
              windchestLenght: new FormControl(flashingFormData.windchestLenght)
            });
            this.formChanges();
            this.loading = false;
          });
      }
    });
    this.dataBase.fetchFlashings().pipe(takeUntil(this.isDestroyed$)).subscribe(flashings => {
      this.flashingsFromDataBase = flashings;
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.shopFlashingLink = text.shopFlashigns;
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.configurationSummary = text.configurationSummary;
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.flashingsConfigurator = text.configuratorFlashings;
    });
  }

  // TODO poprawić edycję wymiarów tabeli na bazie wpisywanych wartości w wymiarach kołnierzy i odstępów
  ngAfterViewInit() {
    // this.dimensionsPresentation = this.dimPresent;
    // console.log(this.dimensionsPresentation);
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }

  get dimensions() {
    return this.form.get('dimensions') as FormGroup;
  }

  get widths() {
    // To działa, bo zwraca tablice z FormControlkami
    return this.dimensions.get('widths') as FormArray;
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
    this.widthsControlsArrayMaker();
    this.heightsControlsArrayMaker();
    this.verticalSpacingControlsMaker();
    this.horizontalSpacingControlsMaker();
    this.form.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      pairwise(),
      map(([prevForm, form]: [any, any]) => {
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
      flashingModelsArray = this.flashingSetter.flashingsArrayOfModelsCreator(form.composition.verticalNumber, form.composition.horizontalNumber, form.lShaped, form.flashingType);
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
            [], [], null, false, null);
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
          this.configuredFlashing.flashingName = this.flashingSetter.buildFlashingName(form.flashingType,
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
          this.configuredFlashingArray.push(this.configuredFlashing);
        }
      }
      this.reverseModelsArrayIndex = [...modelsIndexArray].reverse().reverse();
      console.log(this.reverseModelsArrayIndex);
    } else {
      this.configuredFlashing.model = this.flashingSetter.singleFlashingModelCreator(form.flashingType, form.apronType);
      // tslint:disable-next-line:max-line-length
      this.configuredFlashing.flashingName = this.flashingSetter.buildFlashingName(form.flashingType, form.dimensions.widths[0], form.dimensions.heights[0]);
      this.configuredFlashing.indeksAlgorytm = 'I-KOŁNIERZ';
      this.configuredFlashing.nazwaPLAlgorytm = 'NPL-KOŁNIERZ';
      this.configuredFlashing.status = '1. Nowy';
      this.configuredFlashing.szerokosc = form.dimensions.widths[0];
      this.configuredFlashing.wysokosc = form.dimensions.heights[0];
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
    }
    this.summaryFlashingsPriceSetter(this.configuredFlashingArray);
    console.log(this.configuredFlashingArray);
    console.log(this.configuredFlashing);
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
    // console.log(isStandard);
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
      let options = [];
      let errors = {
        'empty flashingType': true
      };
      this.configData.fetchAllFlashingsData().pipe(takeUntil(this.isDestroyed$)).subscribe(data => {
        options = data.flashingTypes;
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
      this.configData.fetchAllFlashingsData().pipe(takeUntil(this.isDestroyed$)).subscribe(data => {
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

  validateApronType<AsyncValidatorFn>(control: FormControl) {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      let options = [];
      let errors = {
        'empty apronType': true
      };
      this.configData.fetchAllFlashingsData().pipe(takeUntil(this.isDestroyed$)).subscribe(data => {
        options = data.apronTypes;
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

  closeAllHovers(htmlDivElements: HTMLDivElement[]) {
    this.flashingTypeVisible = false;
    this.apronTypeVisible = false;
    this.outerMaterialVisible = false;
    this.compositionVisible = false;
    this.dimensionsVisible = false;
    for (const element of htmlDivElements) {
      element.style.maxHeight = '0';
      element.style.transition = 'all .7s ease-in-out';
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
    window.scrollTo({top: 0, behavior: 'smooth'});
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
      this.dimPresentTDS.forEach(element => this.columns.push(element));
      if (this.dimPresentDivsEqual) {
        this.dimPresentDivsEqual.forEach(element => this.divs.push(element));
      }
      if (this.dimPresentDivs) {
        this.dimPresentDivs.forEach(element => this.divs.push(element));
      }
      if (this.dimPresentDivsH1) {
        this.dimPresentDivsH1.forEach(element => this.divs.push(element));
      }
      if (this.dimPresentDivsW1) {
        this.dimPresentDivsW1.forEach(element => this.divs.push(element));
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
    return {
      ['background-image']: 'url("assets/img/configurator/flashing_configurator/central_options_pictures/' + fileName + '.png")',
      ['background-size']: 'contain',
      ['background-repeat']: 'no-repeat'
    };
  }

  private widthsHeightsAndSpacingsSetter(elementIndex, width, height, horizontalSpacing, verticalSpacing) {
    console.log(this.divs);
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

  navigateToShop() {
    const flashingInfo = new Subject();
    const flashingInfoChange$ = flashingInfo.asObservable();
    flashingInfo.next([
      this.configuredFlashing.model,
      this.configuredFlashing.szerokosc,
      this.configuredFlashing.wysokosc]);
    this.router.navigate(['/' + this.shopFlashingLink]);
  }

  chooseConfigId(configForm: any) {
    // TODO sprawdzić poprawność działania tej metody
    let chosenId;
    if (configForm.value.configFormId === undefined) {
      chosenId = this.highestUserId;
    } else {
      chosenId = parseInt(configForm.value.configFormId, 10);
    }
    if (chosenId === this.highestUserId) {
      this.crud.createConfigurationForUser(this.currentUser, this.temporaryConfig)
        .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      this.router.navigate(['/' + this.configurationSummary]);
    } else {
      // TODO zamienić na configuredFlashing
      this.crud.createFlashingConfigurationIntoConfigurationById(String('configuration-' + chosenId),
        this.tempConfigFlashing, this.formName, this.form.value)
        .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
      this.router.navigate(['/' + this.configurationSummary]);
    }
    this.chooseConfigNamePopup = false;
    this.router.navigate(['/' + this.configurationSummary]);
  }

  closeCopyLinkPopUp() {
    this.copyLinkToConfigurationPopup = false;
  }

  resetConfigForm() {
    this.router.navigate(['/' + this.flashingsConfigurator]);
  }

  onSubmit() {
    // TODO napisać funkcję do zapisu konfiguracji kołnierzy
  }

  saveCopyLinkPopUp() {
    this.loading = true;
    this.copyLinkToConfigurationPopup = true;
    this.paramsUserFetchData$.pipe(takeUntil(this.isDestroyed$)).subscribe(data => {
      this.temporaryConfig = {
        products: {
          windows: null,
          flashings: [{
            id: 1,
            quantity: 1,
            flashing: this.configuredFlashing,
            flashingFormName: this.formName,
            flashingFormData: this.form.value
          }],
          accessories: null,
          verticals: null,
          flats: null
        },
        globalId: this.hd.getHighestGlobalIdFormMongoDB(data.configurations),
        created: new Date(),
        lastUpdate: new Date(),
        user: 'anonym',
        userId: 0,
        name: 'temporary',
        active: true
      };
    });
    this.urlToSaveConfiguration = this.router['location']._platformLocation.location.origin + this.router.url
      + '/' + this.temporaryConfig.globalId
      + '/' + this.temporaryConfig.products.flashings[0].flashingFormName
      + '/' + this.temporaryConfig.products.flashings[0].flashing.kod;
    this.crud.createConfigurationForUser('anonym', this.temporaryConfig).subscribe(console.log);
    this.loading = false;
  }

  openModal(text: string, event: MouseEvent) {
    this.modal.open(text, event);
  }

  closeModal(text: string) {
    this.modal.close(text);
  }
}
