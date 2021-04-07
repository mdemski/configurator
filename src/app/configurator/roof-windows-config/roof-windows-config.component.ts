import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject, Observable, Observer, Subject, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {ConfigurationDistributorService} from '../../services/configuration-distributor.service';
import {ConfigurationDataService} from '../../services/configuration-data.service';
import {AuthService} from '../../services/auth.service';
import {WindowDynamicValuesSetterService} from '../../services/window-dynamic-values-setter.service';
import _ from 'lodash';
import {filter, map, tap} from 'rxjs/operators';
import {IpService} from '../../services/ip.service';

@Component({
  selector: 'app-roof-windows-config',
  templateUrl: './roof-windows-config.component.html',
  styleUrls: ['./roof-windows-config.component.scss']
})
export class RoofWindowsConfigComponent implements OnInit, OnDestroy {

  // TODO przygotować strumień i service do publikowania tej danej po aplikacji
  constructor(private authService: AuthService,
              private configData: ConfigurationDataService,
              private configDist: ConfigurationDistributorService,
              private windowValuesSetter: WindowDynamicValuesSetterService,
              private ip: IpService,
              private router: Router,
              private activeRouter: ActivatedRoute,
              private fb: FormBuilder,
              public translate: TranslateService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  form: FormGroup;
  configId: number;
  user: string;
  dimensions;
  configuredWindow: RoofWindowSkylight;
  tempConfiguredWindow: RoofWindowSkylight;
  windowModelsToCalculatePrice = [];
  standardWidths = [55, 66, 78, 94, 114, 134];
  showWidthMessage = false;
  standardHeights = [78, 98, 118, 140, 160];
  showHeightMessage = false;
  popupConfig = true;
  private materialVisible = false;
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
  exclusions = [];
  sets = [];
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
  formData$;
  subscription: Subscription;
  coats$ = new Subject<any[]>();
  extras$ = new Subject<any[]>();
  glazingName$ = new BehaviorSubject('Okno:E01');

  static setDimensions(dimensions) {
    return dimensions;
  }

  // 'width': new FormControl(78, [this.validateWidth.bind(this), Validators.required]), własnym walidator
  ngOnInit(): void {
    this.authService.isLogged ? this.authService.user.subscribe(user => this.user = user.email)
      // @ts-ignore
      : this.ip.getIpAddress().subscribe(userIp => this.user = userIp.ip);
    this.activeRouter.params.subscribe(param => {
      if (param['configId'] !== undefined) {
        this.configId = param['configId'];
      } else {
        this.configId = 1;
      }
    });
    this.configData.fetchAllData().subscribe(() => {
      this.windowModelsToCalculatePrice = this.configData.models;
      this.availableOptions = this.configData.availableOptions;
      this.exclusions = this.configData.exclusions;
      this.sets = this.configData.sets;
      this.glazingTypes = this.objectMaker(this.configData.glazingTypes);
      this.materials = this.objectMaker(this.configData.materials);
      this.openingTypes = this.objectMaker(this.configData.openingTypes);
      this.innerColors = this.objectMaker(this.configData.innerColors);
      this.outerMaterials = this.objectMaker(this.configData.outerMaterials);
      // this.outerColors = this.objectMaker(this.configData.outerColor);
      this.outerColorFinishes = this.objectMaker(this.configData.outerColorFinishes);
      this.coatsFromFile = this.objectMaker(this.configData.coats);
      this.dimensions = RoofWindowsConfigComponent.setDimensions(this.configData.dimensions);
      this.extrasFromFile = this.objectMaker(this.configData.extras);
      this.ventilations = this.objectMaker(this.configData.ventialtions);
      this.handles = this.objectMaker(this.configData.handles);
      this.handleColors = this.objectMaker(this.configData.handleColors);
      this.coats$.next(this.coatsFromFile);
      this.extras$.next(this.extrasFromFile);
    });
    // TODO get next id from database
    this.configuredWindow = new RoofWindowSkylight(
      '999', null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, false, 0, [], [],
      [], [], 0, 0, 0, 5, null, null, null, 0);
    this.form = this.fb.group({
      material: new FormControl(null, [], [this.validateMaterials.bind(this)]),
      openingType: new FormControl(null, [], [this.validateOpenings.bind(this)]),
      control: new FormControl(null),
      glazing: new FormControl('dwuszybowy', [], [this.validateGlazing.bind(this)]),
      width: new FormControl(78),
      height: new FormControl(118),
      innerColor: new FormControl(null, [], [this.validateInnerColor.bind(this)]),
      outer: new FormGroup({
        outerMaterial: new FormControl(null),
        outerColor: new FormControl('Aluminium:RAL7022'),
        outerColorFinish: new FormControl(null)
      }, [], [this.validateOuterMaterial.bind(this)]),
      ventilation: new FormControl('NawiewnikNeoVent', [], [this.validateVentilation.bind(this)]),
      closure: new FormGroup({
        handle: new FormControl(null, [], [this.validateHandle.bind(this)]),
        handleColor: new FormControl(null)
      })
    });
    this.coats$.pipe(
      filter(data => !!data),
      map(coats => this.fb.array(coats.map(x => new FormControl(false))))
    ).subscribe(coatsFormArray => {
      this.form.addControl('coats', coatsFormArray);
    });
    this.extras$.pipe(
      filter(data => !!data),
      map(extras => this.fb.array(extras.map(x => new FormControl(false))))
    ).subscribe(extrasFormArray => {
      this.form.addControl('extras', extrasFormArray);
    });
    this.translate.get('LINK').subscribe(text => {
      this.shopRoofWindowLink = text.shopRoofWindows;
    });
    this.translate.get('LINK').subscribe(text => {
      this.configurationSummary = text.configurationSummary;
    });
    this.formData$ = this.form.valueChanges; // strumień z danymi z formularza
    this.formData$.pipe(
      filter((form: any) => form.material != null),
      tap(() => {
        const checkboxCoatControl = this.coats as FormArray;
        this.subscription = checkboxCoatControl.valueChanges.subscribe(checkbox => {
          checkboxCoatControl.setValue(checkboxCoatControl.value.map((value, i) =>
            value ? this.coatsFromFile[i].option : false), {emitEvent: false});
        });
      }),
      tap(() => {
        const checkboxExtraControl = this.extras as FormArray;
        this.subscription = checkboxExtraControl.valueChanges.subscribe(checkbox => {
          checkboxExtraControl.setValue(checkboxExtraControl.value.map((value, i) =>
            value ? this.extrasFromFile[i].option : false), {emitEvent: false});
        });
      }),
      tap((form: any) => {
        this.windowValuesSetter.glazingTypeSetter(form.material, form.glazing, form.coats, 'Okno').subscribe(glazingName => {
          this.glazingName$.next(glazingName);
        });
      }),
      map((form) => {
        this.setConfiguredValues(form);
      })).subscribe();
    this.tempConfiguredWindow = new RoofWindowSkylight(
      '999', null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, false, 0, [], [], [],
      [], 1000, 1, 0.5, 5, null, null, null, 0);
  }

  // TODO przygotować wczytywanie konfiguracji jeśli Klient wraca do poprawy danej konfiguracji

  ngOnDestroy() {
    // TODO odsubskrybować się ze wszystkich strumieni oprócz http - ten strumień zamyka się sam
  }

  get coats(): FormArray {
    return this.form.get('coats') as FormArray;
  }

  get extras(): FormArray {
    return this.form.get('extras') as FormArray;
  }

  setConfiguredValues(form) {
    this.configuredWindow.model = this.setModels(
      form.material,
      form.openingType,
      form.ventilation);
    if (form.material &&
      form.openingType) {
      this.popupConfig = true;
    }
    this.glazingName$.subscribe(pakietSzybowy => {
      this.configuredWindow.pakietSzybowy = pakietSzybowy;
    });
    this.configuredWindow.glazingToCalculation = form.glazing;
    this.configuredWindow.status = 'Nowy';
    this.configuredWindow.szerokosc = form.width;
    this.showWidthMessage = this.standardWidths.includes(form.width);
    this.configuredWindow.wysokosc = form.height;
    this.showHeightMessage = this.standardHeights.includes(form.height);
    this.windowValuesSetter.setModelName(this.configuredWindow);
    this.configuredWindow.grupaAsortymentowa = 'Okna dachowe';
    this.configuredWindow.indeksAlgorytm = 'I-OKNO';
    this.configuredWindow.nazwaPLAlgorytm = 'NPL-OKNO';
    this.configuredWindow.typ = this.getSubCategory(form.openingType);
    this.configuredWindow.geometria = this.getGeometry(form.material);
    this.configuredWindow.otwieranie = form.openingType;
    this.configuredWindow.wentylacja = form.ventilation;
    this.configuredWindow.stolarkaMaterial = form.material;
    this.configuredWindow.stolarkaKolor = form.innerColor;
    this.configuredWindow.oblachowanieMaterial = form.outer.outerMaterial;
    this.configuredWindow.rodzina = this.getFamily(this.configuredWindow.stolarkaMaterial, this.configuredWindow.otwieranie);
    this.configuredWindow.rodzaj = this.getType(this.configuredWindow.stolarkaMaterial, this.configuredWindow.otwieranie);
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
    this.configuredWindow.kod = this.generateCode(this.configuredWindow.stolarkaMaterial, this.configuredWindow.otwieranie,
      this.configuredWindow.wentylacja, this.configuredWindow.pakietSzybowy, this.configuredWindow.stolarkaKolor,
      this.configuredWindow.oblachowanieMaterial, this.configuredWindow.oblachowanieKolor, this.configuredWindow.oblachowanieFinisz,
      this.configuredWindow.szerokosc, this.configuredWindow.wysokosc);
    this.configuredWindow.CenaDetaliczna = this.priceCalculation(this.configuredWindow);
    this.windowValuesSetter.setUwAndUgValues(this.configuredWindow);
    this.setDisabled(this.configuredWindow);
    console.log(this.configuredWindow);
  }

  //


  priceCalculation(configuredWindow) {
    // ... spread operator pozwala niezagnieżdżać jendego elementu w drugi
    // tempArray.push({...data[book], id: book});
    let windowPrice = 0;
    let index = -1;
    for (let i = 0; i < this.windowModelsToCalculatePrice.length; i++) {
      if (this.windowModelsToCalculatePrice[i].windowModel === configuredWindow.model) {
        index = i;
      }
    }
    const windowToCalculations = this.windowModelsToCalculatePrice[index];
    if (index > -1) {
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

  setModels(material: string, openingType: string, ventilation: string) {
    let model = '';
    switch (material) {
      case 'DrewnoSosna':
        model = 'Okno:IS';
        break;
      case 'PVC':
        model = 'Okno:IG';
        break;
    }
    switch (openingType) {
      case 'Okno:Obrotowe':
        model += 'O';
        break;
      case 'Okno:Uchylno-przesuwne':
        model += 'K';
        break;
      case 'Okno:NieotwieraneFIP':
        model += 'X';
        break;
      case 'Okno:ElektrycznePilot':
        model += 'C1';
        break;
      case 'Okno:ElektrycznePrzełącznik':
        model += 'C2';
        break;
      case 'Okno:Wysokoosiowe':
        model += 'W';
        break;
      case 'KolankoDrewno:NieotwieraneFIP':
        model = 'Kolanko:IKDN';
        break;
      case 'KolankoDrewno:Uchylne':
        model = 'Kolanko:IKDU';
        break;
      case 'KolankoPVC:UchylnoRozwierneLewe':
        model = 'Kolanko:KPVCL';
        break;
      case 'KolankoPVC:UchylnoRozwiernePrawe':
        model = 'Kolanko:KPVCP';
        break;
      case 'KolankoPVC:Uchylne':
        model = 'Kolanko:KPVCU';
        break;
      case 'KolankoPVC:NieotwieraneFIX':
        model = 'Kolanko:KPVCN';
        break;
    }

    switch (ventilation) {
      case 'NawiewnikNeoVent':
        if (openingType === 'KolankoPVC:UchylnoRozwierneLewe' ||
          openingType === 'KolankoPVC:UchylnoRozwiernePrawe' ||
          openingType === 'KolankoPVC:Uchylne' ||
          openingType === 'KolankoPVC:NieotwieraneFIX') {
          model += '';
        } else {
          model += 'V';
        }
        break;
      case 'MaskownicaNeoVent':
        if (openingType === 'KolankoPVC:UchylnoRozwierneLewe' ||
          openingType === 'KolankoPVC:UchylnoRozwiernePrawe' ||
          openingType === 'KolankoPVC:Uchylne' ||
          openingType === 'KolankoPVC:NieotwieraneFIX') {
          model += '';
        } else {
          model += 'M';
        }
        break;
      case 'Brak':
        if (openingType === 'KolankoPVC:UchylnoRozwierneLewe' ||
          openingType === 'KolankoPVC:UchylnoRozwiernePrawe' ||
          openingType === 'KolankoPVC:Uchylne' ||
          openingType === 'KolankoPVC:NieotwieraneFIX') {
          model += '';
        } else {
          model += 'X';
        }
        break;
    }
    return model;
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
      this.configData.fetchAllData().subscribe(() => {
        options = this.configData.materials;
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
      this.configData.fetchAllData().subscribe(() => {
        options = this.configData.openingTypes;
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
      this.configData.fetchAllData().subscribe(() => {
        options = this.configData.glazingTypes;
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
      this.configData.fetchAllData().subscribe(() => {
        options = this.configData.innerColors;
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
      this.configData.fetchAllData().subscribe(() => {
        materialOptions = this.configData.outerMaterials;
        // colorOptions = this.configData.outerColor;
        finishOptions = this.configData.outerColorFinishes;
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
      this.configData.fetchAllData().subscribe(() => {
        options = this.configData.ventialtions;
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
      this.configData.fetchAllData().subscribe(() => {
        options = this.configData.handles;
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
    this.tempConfiguredWindow.grupaAsortymentowa = 'Okna dachowe';
    this.tempConfiguredWindow.windowCoats = ['zewnetrznaHartowana', false, false, false, false, false, false, false, false];
    this.tempConfiguredWindow.dostepneRozmiary = ['78x118'];
    this.tempConfiguredWindow.geometria = 'Okno:IS';
    this.tempConfiguredWindow.rodzaj = 'OknoDachowe:ISO';
    this.tempConfiguredWindow.pakietSzybowy = 'Okno:E02';
    this.tempConfiguredWindow.glazingToCalculation = 'dwuszybowy';
    this.tempConfiguredWindow.zamkniecieTyp = 'Okno:ExtraSecure';
    this.tempConfiguredWindow.zamkniecieKolor = 'Okno:RAL7048';
    this.tempConfiguredWindow.windowHardware = false;
    this.tempConfiguredWindow.wysokosc = 119;
    this.tempConfiguredWindow.szerokosc = 79;
    this.tempConfiguredWindow.stolarkaMaterial = 'DrewnoSosna';
    this.tempConfiguredWindow.stolarkaKolor = 'Drewno:Bezbarwne';
    this.tempConfiguredWindow.rodzina = 'OknoDachowe:IS';
    this.tempConfiguredWindow.model = 'Okno:ISOV';
    this.tempConfiguredWindow.uszczelki = 2;
    this.tempConfiguredWindow.windowName = 'ISOV E2 79x119';
    this.tempConfiguredWindow.otwieranie = 'Okno:Obrotowe';
    this.tempConfiguredWindow.oblachowanieKolor = 'RAL9999';
    this.tempConfiguredWindow.oblachowanieFinisz = 'Aluminium:Półmat';
    this.tempConfiguredWindow.oblachowanieMaterial = 'Aluminium';
    this.tempConfiguredWindow.CenaDetaliczna = 1332.80;
    this.tempConfiguredWindow.typ = 'obrotowe';
    this.tempConfiguredWindow.windowUG = 1;
    this.tempConfiguredWindow.windowUW = 1.2;
    this.tempConfiguredWindow.linkiDoZdjec = ['https://www.okpol.pl/wp-content/uploads/2017/02/1_ISO.jpg'];
    this.tempConfiguredWindow.listaDodatkow = ['Okno:Zasuwka', false, false];
    this.tempConfiguredWindow.wentylacja = 'NawiewnikNeoVent';
    this.tempConfiguredWindow.numberOfGlasses = 2;
    this.tempConfiguredWindow.kolorTworzywWew = 'Okno:RAL7048';
    this.tempConfiguredWindow.kolorTworzywZew = 'Okno:RAL7048';
    this.tempConfiguredWindow.kod = '1O-ISO-V-E02-KL00-A7022P-079119-OKPO01';
    this.configDist.addWindowToConfigurationsArray(this.user, this.tempConfiguredWindow, this.configId);
    // TODO zapisz dane do Firebase przed emisją żeby nie utracić konfiguracji
    // TODO przygotować model konfiguracji w której będą przechowywane: okno, kołnierz, roleta - a później publikować tablice
    this.router.navigate(['/' + this.configurationSummary]);
  }

  // CALCULATIONS
  getSubCategory(openingType: string) {
    let type = '';
    switch (openingType) {
      case 'Okno:Obrotowe':
        type = 'obrotowe';
        break;
      case 'Okno:Uchylno-przesuwne':
        type = 'uchylno-przesuwne';
        break;
      case 'Okno:Wysokoosiowe':
        type = 'wysokoosiowe';
        break;
      case 'Okno:ElektrycznePilot':
        type = 'elektryczne';
        break;
      case 'Okno:ElektrycznePrzełącznik':
        type = 'elektryczne';
        break;
      case 'KolankoDrewno:Uchylne':
        type = 'kolankowe drewniane';
        break;
      case 'KolankoDrewno:NieotwieraneFIP':
        type = 'kolankowe drewniane';
        break;
      case 'KolankoPVC:UchylnoRozwierneLewe':
        type = 'kolankowe PVC';
        break;
      case 'KolankoPVC:UchylnoRozwiernePrawe':
        type = 'kolankowe PVC';
        break;
      case 'KolankoPVC:Uchylne':
        type = 'kolankowe PVC';
        break;
      case 'KolankoPVC:NieotwieraneFIX':
        type = 'kolankowe PVC';
        break;
      case 'Okno:NieotwieraneFIP':
        type = 'fip';
        break;
    }
    return type;
  }

  getGeometry(material: string) {
    let geometry = '';
    switch (material) {
      case 'DrewnoSosna':
        geometry = 'IS';
        break;
      case 'PVC':
        geometry = 'IG2';
        break;
    }
    return geometry;
  }

  getType(material: string, openingType: string) {
    let type = 'OknoDachowe:';
    switch (material) {
      case 'DrewnoSosna':
        material = 'IS';
        break;
      case 'PVC':
        material = 'IG';
        break;
    }
    switch (openingType) {
      case 'Okno:Obrotowe':
        type += 'O';
        break;
      case 'Okno:Uchylno-przesuwne':
        type += 'K';
        break;
      case 'Okno:NieotwieraneFIP':
        type += 'X';
        break;
      case 'Okno:ElektrycznePilot':
        type += 'C1';
        break;
      case 'Okno:ElektrycznePrzełącznik':
        type += 'C2';
        break;
      case 'Okno:Wysokoosiowe':
        type += 'W';
        break;
      case 'KolankoDrewno:NieotwieraneFIP':
        type = 'OknoKolankowe:IKD';
        break;
      case 'KolankoDrewno:Uchylne':
        type = 'OknoKolankowe:IKD';
        break;
      case 'KolankoPVC:UchylnoRozwierneLewe':
        type = 'OknoKolankowe:KPVC';
        break;
      case 'KolankoPVC:UchylnoRozwiernePrawe':
        type = 'OknoKolankowe:KPVC';
        break;
      case 'KolankoPVC:Uchylne':
        type = 'OknoKolankowe:KPVC';
        break;
      case 'KolankoPVC:NieotwieraneFIX':
        type = 'OknoKolankowe:KPVC';
        break;
    }
    return type;
  }

  getFamily(material: string, openingType: string) {
    let family = 'OknoDachowe:';
    switch (material) {
      case 'DrewnoSosna':
        material = 'IS';
        break;
      case 'PVC':
        material = 'IG';
        break;
    }
    switch (openingType) {
      case 'KolankoDrewno:NieotwieraneFIP':
        family = 'OknoKolankowe:IS';
        break;
      case 'KolankoDrewno:Uchylne':
        family = 'OknoKolankowe:IS';
        break;
      case 'KolankoPVC:UchylnoRozwierneLewe':
        family = 'OknoKolankowe:88MD';
        break;
      case 'KolankoPVC:UchylnoRozwiernePrawe':
        family = 'OknoKolankowe:88MD';
        break;
      case 'KolankoPVC:Uchylne':
        family = 'OknoKolankowe:88MD';
        break;
      case 'KolankoPVC:NieotwieraneFIX':
        family = 'OknoKolankowe:88MD';
        break;
    }
    return family;
  }

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

  private generateCode(material: string, openingType: string, ventilation: string,
                       glazingType: string, innerColor: string, outerMaterial: string,
                       outerColor: string, outerFinish: string, width: number, height: number) {
    let model = '';
    switch (material) {
      case 'DrewnoSosna':
        model = 'IS';
        break;
      case 'PVC':
        model = 'IG';
        break;
    }
    switch (openingType) {
      case 'Okno:Obrotowe':
        model += 'O';
        break;
      case 'Okno:Uchylno-przesuwne':
        model += 'K';
        break;
      case 'Okno:NieotwieraneFIP':
        model += 'X';
        break;
      case 'Okno:ElektrycznePilot':
        model += 'C1';
        break;
      case 'Okno:ElektrycznePrzełącznik':
        model += 'C2';
        break;
      case 'Okno:Wysokoosiowe':
        model += 'W';
        break;
      case 'KolankoDrewno:NieotwieraneFIP':
        model = 'IKDN';
        break;
      case 'KolankoDrewno:Uchylne':
        model = 'IKDU';
        break;
      case 'KolankoPVC:UchylnoRozwierneLewe':
        model = 'KPVCL';
        break;
      case 'KolankoPVC:UchylnoRozwiernePrawe':
        model = 'KPVCP';
        break;
      case 'KolankoPVC:Uchylne':
        model = 'KPVCU';
        break;
      case 'KolankoPVC:NieotwieraneFIX':
        model = 'KPVCN';
        break;
    }

    switch (ventilation) {
      case 'NawiewnikNeoVent':
        if (openingType === 'KolankoPVC:UchylnoRozwierneLewe' ||
          openingType === 'KolankoPVC:UchylnoRozwiernePrawe' ||
          openingType === 'KolankoPVC:Uchylne' ||
          openingType === 'KolankoPVC:NieotwieraneFIX') {
          model += '';
        } else {
          if (openingType === 'Okno:ElektrycznePilot' ||
            openingType === 'KolankoDrewno:Uchylne' ||
            openingType === 'KolankoDrewno:NieotwieraneFIP' ||
            openingType === 'Okno:ElektrycznePrzełącznik') {
            model += 'V';
          } else {
            model += '-V';
          }
        }
        break;
      case 'MaskownicaNeoVent':
        if (openingType === 'KolankoPVC:UchylnoRozwierneLewe' ||
          openingType === 'KolankoPVC:UchylnoRozwiernePrawe' ||
          openingType === 'KolankoPVC:Uchylne' ||
          openingType === 'KolankoPVC:NieotwieraneFIX') {
          model += '';
        } else {
          if (openingType === 'Okno:ElektrycznePilot' ||
            openingType === 'KolankoDrewno:Uchylne' ||
            openingType === 'KolankoDrewno:NieotwieraneFIP' ||
            openingType === 'Okno:ElektrycznePrzełącznik') {
            model += 'M';
          } else {
            model += '-M';
          }
        }
        break;
      case 'Brak':
        if (openingType === 'KolankoPVC:UchylnoRozwierneLewe' ||
          openingType === 'KolankoPVC:UchylnoRozwiernePrawe' ||
          openingType === 'KolankoPVC:Uchylne' ||
          openingType === 'KolankoPVC:NieotwieraneFIX') {
          model += '';
        } else {
          if (openingType === 'Okno:ElektrycznePilot' ||
            openingType === 'KolankoDrewno:Uchylne' ||
            openingType === 'KolankoDrewno:NieotwieraneFIP' ||
            openingType === 'Okno:ElektrycznePrzełącznik') {
            model += 'X';
          } else {
            model += '-X';
          }
        }
        break;
    }

    let materialCode = '';
    if (material === 'DrewnoSosna') {
      materialCode = 'KL00';
    } else {
      materialCode = 'WSWS';
    }

    let outerMaterialCode = '';
    switch (outerMaterial) {
      case 'Aluminium':
        outerMaterialCode = 'A';
        break;
      case 'Miedż':
        outerMaterialCode = 'C';
        break;
      case 'TytanCynk':
        outerMaterialCode = 'T';
        break;
    }

    let outerColorCode = '';
    switch (outerColor) {
      case 'Aluminium:RAL7022':
        outerColorCode = '7022';
        break;
      case 'Aluminium:RAL7016':
        outerColorCode = '7016';
        break;
      case 'Miedź:Natur':
        outerColorCode = '0000';
        break;
      case 'TytanCynk:Natur':
        outerColorCode = '0000';
        break;
    }

    let outerFinishCode = '';
    switch (outerFinish) {
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
    }

    let widthCode;
    if (width < 100) {
      widthCode = '0' + width;
    } else {
      widthCode = width;
    }

    let heightCode;
    if (height < 100) {
      heightCode = '0' + height;
    } else {
      heightCode = height;
    }

    const glazingCode = glazingType.split(':')[1];

    // '1O-ISO-V-E02-KL00-A7022P-078118-OKPO01';
    return '1O-' + model + '-' + glazingCode + '-' + materialCode +
      '-' + outerMaterialCode + outerColorCode + outerFinishCode +
      '-' + widthCode + heightCode + '-OKPO01';
  }

  // CSS STYLING
  setBackgroundImage(value: string) {
    return {
      ['background-image']: 'url("assets/img/configurator/window_configurator/central_navigation_pictures/' + value + '.png")',
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

  // DISABLE INPUT SETTER LOGIC
  setDisabled(configuredWindow: RoofWindowSkylight) {
    this.resetAllArrays(this.materials, this.openingTypes, this.innerColors, this.outerMaterials, this.outerColors, this.outerColorFinishes,
      this.glazingTypes, this.coatsFromFile, this.extrasFromFile, this.ventilations, this.handles, this.handleColors);
    // tslint:disable-next-line:forin
    for (const configurationOption in configuredWindow) {
      const selectedOption = configuredWindow[configurationOption];
      // configuredWindow[configurationOption] zwaraca wartości wybrane w trakcie konfiguracji odpowiadające
      for (const exclusion of this.exclusions) {
        const tempExclusionValue = exclusion[selectedOption]; // tu są zwracane wartości wykluczeń
        if (_.isNumber(tempExclusionValue) && tempExclusionValue > 0) {
          this.setDisabledOptions(tempExclusionValue, selectedOption,
            this.materials, this.openingTypes, this.innerColors,
            this.outerMaterials, this.outerColors, this.outerColorFinishes,
            this.glazingTypes, this.coatsFromFile, this.extrasFromFile, this.ventilations,
            this.handles, this.handleColors, this.exclusions);
        }
      }
      for (const set of this.sets) {
        const tempSetValue = set[selectedOption]; // tu są zwracane wartości setów np. 30, selectedOption zwraca np. "Aluminium:RAL7022"
        if (_.isNumber(tempSetValue)) {
          // this.setSetsDisabledOptions(tempSetValue, selectedOption,
          //   this.materials, this.openingTypes, this.innerColors,
          //   this.outerMaterials, this.outerColors, this.outerColorFinishes,
          //   this.glazingTypes, this.coats, this.extras, this.ventilations,
          //   this.handles, this.handleColors, this.sets);
        }
      }
    }
  }

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

  // tslint:disable-next-line:max-line-length
  setDisabledOptions(exNumber: number, selectedOption: string, materials: { option: string; disabled: boolean }[], openingTypes: { option: string; disabled: boolean }[],
                     innerColors: { option: string; disabled: boolean }[], outerMaterials: { option: string; disabled: boolean }[],
                     outerColors: { option: string; disabled: boolean }[], outerColorFinishes: { option: string; disabled: boolean }[],
                     glazingTypes: { option: string; disabled: boolean }[], coats: { option: string; disabled: boolean }[],
                     extras: { option: string; disabled: boolean }[], ventilations: { option: string; disabled: boolean }[],
                     handles: { option: string; disabled: boolean }[], handleColors: { option: string; disabled: boolean }[], exclusions) {
    for (const exclusion of exclusions) {
      let exName = '';
      if (Object.values(exclusion)[0] === exNumber) {
        exName = Object.keys(exclusion)[0];
      }
      for (const material of materials) {
        if (material.option === exName && material.option !== selectedOption) {
          material.disabled = true;
        }
      }
      for (const openingType of openingTypes) {
        if (openingType.option === exName && openingType.option !== selectedOption) {
          openingType.disabled = true;
        }
      }
      for (const innerColor of innerColors) {
        if (innerColor.option === exName && innerColor.option !== selectedOption) {
          innerColor.disabled = true;
        }
      }
      for (const outerMaterial of outerMaterials) {
        if (outerMaterial.option === exName && outerMaterial.option !== selectedOption) {
          outerMaterial.disabled = true;
        }
      }
      for (const outerColor of outerColors) {
        if (outerColor.option === exName && outerColor.option !== selectedOption) {
          outerColor.disabled = true;
        }
      }
      for (const outerColorFinish of outerColorFinishes) {
        if (outerColorFinish.option === exName && outerColorFinish.option !== selectedOption) {
          outerColorFinish.disabled = true;
        }
      }
      for (const glazingType of glazingTypes) {
        if (glazingType.option === exName && glazingType.option !== selectedOption) {
          glazingType.disabled = true;
        }
      }
      for (const coat of coats) {
        if (coat.option === exName && coat.option !== selectedOption) {
          coat.disabled = true;
        }
      }
      for (const extra of extras) {
        if (extra.option === exName && extra.option !== selectedOption) {
          extra.disabled = true;
        }
      }
      for (const ventilation of ventilations) {
        if (ventilation.option === exName && ventilation.option !== selectedOption) {
          ventilation.disabled = true;
        }
      }
      for (const handle of handles) {
        if (handle.option === exName && handle.option !== selectedOption) {
          handle.disabled = true;
        }
      }
      for (const handleColor of handleColors) {
        if (handleColor.option === exName && handleColor.option !== selectedOption) {
          handleColor.disabled = true;
        }
      }
    }
  }

  // tslint:disable-next-line:max-line-length
  setSetsDisabledOptions(setNumber: number, selectedOption: string, materials: { option: string; disabled: boolean }[], openingTypes: { option: string; disabled: boolean }[],
                         innerColors: { option: string; disabled: boolean }[], outerMaterials: { option: string; disabled: boolean }[],
                         outerColors: { option: string; disabled: boolean }[], outerColorFinishes: { option: string; disabled: boolean }[],
                         glazingTypes: { option: string; disabled: boolean }[], chosenCoats: { option: string; disabled: boolean }[],
                         chosenExtras: { option: string; disabled: boolean }[], ventilations: { option: string; disabled: boolean }[],
                         handles: { option: string; disabled: boolean }[], handleColors: { option: string; disabled: boolean }[], sets) {
    for (const set of sets) {
      if (setNumber > 0 && Object.values(set)[0] === setNumber) {
        const optionToChange = Object.keys(set)[0];
        console.log(setNumber); // zwraca wartości liczbowe w setach
        console.log(optionToChange); // zwraca nazwy watości w setach
        for (const material of materials) {
          if (material.option === optionToChange && setNumber !== set[selectedOption]) {
            material.disabled = true;
          }
        }
        for (const openingType of openingTypes) {
          if (openingType.option === optionToChange && setNumber !== set[selectedOption]) {
            openingType.disabled = true;
          }
        }
        for (const innerColor of innerColors) {
          if (innerColor.option === optionToChange && setNumber !== set[selectedOption]) {
            innerColor.disabled = true;
          }
        }
        for (const outerMaterial of outerMaterials) {
          if (outerMaterial.option === optionToChange && setNumber !== set[selectedOption]) {
            outerMaterial.disabled = true;
          }
        }
        for (const outerColor of outerColors) {
          if (outerColor.option === optionToChange && setNumber !== set[selectedOption]) {
            outerColor.disabled = true;
          }
        }
        for (const outerColorFinish of outerColorFinishes) {
          if (outerColorFinish.option === optionToChange && setNumber !== set[selectedOption]) {
            outerColorFinish.disabled = true;
          }
        }
        for (const glazingType of glazingTypes) {
          if (glazingType.option === optionToChange && setNumber !== set[selectedOption]) {
            glazingType.disabled = true;
          }
        }
        for (const chosenCoat of chosenCoats) {
          if (chosenCoat.option === optionToChange && setNumber !== set[selectedOption]) {
            chosenCoat.disabled = true;
          }
        }
        for (const chosenExtra of chosenExtras) {
          if (chosenExtra.option === optionToChange && setNumber !== set[selectedOption]) {
            chosenExtra.disabled = true;
          }
        }
        for (const ventilation of ventilations) {
          if (ventilation.option === optionToChange && setNumber !== set[selectedOption]) {
            ventilation.disabled = true;
          }
        }
        for (const handle of handles) {
          if (handle.option === optionToChange && setNumber !== set[selectedOption]) {
            handle.disabled = true;
          }
        }
        for (const handleColor of handleColors) {
          if (handleColor.option === optionToChange && setNumber !== set[selectedOption]) {
            handleColor.disabled = true;
          }
        }
      }
    }
  }
}
