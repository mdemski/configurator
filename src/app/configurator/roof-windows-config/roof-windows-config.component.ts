import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Observer, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {ConfigurationDistributorService} from '../../services/configuration-distributor.service';
import {ConfigurationDataService} from '../../services/configuration-data.service';
import {AuthService} from '../../services/auth.service';
import {WindowDynamicValuesSetterService} from '../../services/window-dynamic-values-setter.service';
import _ from 'lodash';

@Component({
  selector: 'app-roof-windows-config',
  templateUrl: './roof-windows-config.component.html',
  styleUrls: ['./roof-windows-config.component.scss']
})
export class RoofWindowsConfigComponent implements OnInit {

  // TODO przygotować strumień i service do publikowania tej danej po aplikacji
  constructor(private authService: AuthService,
              private configData: ConfigurationDataService,
              private configDist: ConfigurationDistributorService,
              private windowValuesSetter: WindowDynamicValuesSetterService,
              private router: Router,
              public translate: TranslateService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  loginUser: string;
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
  windowConfigurationForm: FormGroup;
  availableOptions = [];
  chosenCoats = [];
  chosenExtras = [];
  exclusions = [];
  sets = [];
  materials = [];
  openingTypes = [];
  innerColors = [];
  outerMaterials = [];
  outerColors = [];
  outerColorFinishes = [];
  glazingTypes = [];
  coats = [];
  extras = [];
  ventilations = [];
  handles = [];
  handleColors = [];
  shopRoofWindowLink: string;
  configurationSummary: string;

  static setDimensions(dimensions) {
    return dimensions;
  }

  // 'width': new FormControl(78, [this.validateWidth.bind(this), Validators.required]), własnym walidator
  ngOnInit(): void {
    this.authService.isLogged ? this.authService.user.subscribe(user => this.loginUser = user.email) : this.loginUser = null;
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
      this.coats = this.objectMaker(this.configData.coats);
      this.dimensions = RoofWindowsConfigComponent.setDimensions(this.configData.dimensions);
      this.extras = this.objectMaker(this.configData.extras);
      this.ventilations = this.objectMaker(this.configData.ventialtions);
      this.handles = this.objectMaker(this.configData.handles);
      this.handleColors = this.objectMaker(this.configData.handleColors);
    });
    // TODO get next id from database
    this.configuredWindow = new RoofWindowSkylight(
      '999',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      false,
      0,
      [],
      [],
      [],
      [],
      0,
      0,
      0,
      5,
      null,
      null,
      null,
      0);
    this.windowConfigurationForm = new FormGroup({
      material: new FormControl(null, [], [this.validateMaterials.bind(this)]),
      openingType: new FormControl(null, [], [this.validateOpenings.bind(this)]),
      control: new FormControl(null),
      glazing: new FormControl('dwuszybowy', [], [this.validateGlazing.bind(this)]),
      coats: new FormControl(null),
      width: new FormControl(78),
      height: new FormControl(118),
      innerColor: new FormControl(null, [], [this.validateInnerColor.bind(this)]),
      outer: new FormGroup({
        outerMaterial: new FormControl(null),
        outerColor: new FormControl('Aluminium:RAL7022'),
        outerColorFinish: new FormControl('Aluminium:Półmat')
      }, [], [this.validateOuterMaterial.bind(this)]),
      extras: new FormControl(null),
      ventilation: new FormControl('NawiewnikNeoVent', [], [this.validateVentilation.bind(this)]),
      closure: new FormGroup({
        handle: new FormControl(null, [], [this.validateHandle.bind(this)]),
        handleColor: new FormControl(null)
      })
    });
    this.tempConfiguredWindow = new RoofWindowSkylight(
      '999',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      false,
      0,
      [],
      [],
      [],
      [],
      1000,
      1,
      0.5,
      5,
      null,
      null,
      null,
      0);
    this.translate.get('LINK').subscribe(text => {
      this.shopRoofWindowLink = text.shopRoofWindows;
    });
    this.translate.get('LINK').subscribe(text => {
      this.configurationSummary = text.configurationSummary;
    });
  }

  setConfiguredValues() {
    this.configuredWindow.model = this.setModels(
      this.windowConfigurationForm.value.material,
      this.windowConfigurationForm.value.openingType,
      this.windowConfigurationForm.value.ventilation);
    if (this.windowConfigurationForm.value.material &&
      this.windowConfigurationForm.value.openingType) {
      this.popupConfig = true;
    }
    // TODO poprawić oznaczenie pakietu szybowego
    this.windowValuesSetter.glazingTypeSetter(
      this.windowConfigurationForm.value.material,
      this.windowConfigurationForm.value.glazing,
      this.chosenCoats,
      'okno').subscribe(glazingModel => this.configuredWindow.pakietSzybowy = 'Okno:' + glazingModel);
    this.configuredWindow.glazingToCalculation = this.windowConfigurationForm.value.glazing;
    this.configuredWindow.status = 'Nowy';
    this.configuredWindow.szerokosc = this.windowConfigurationForm.value.width;
    this.showWidthMessage = this.standardWidths.includes(this.windowConfigurationForm.value.width);
    this.configuredWindow.wysokosc = this.windowConfigurationForm.value.height;
    this.showHeightMessage = this.standardHeights.includes(this.windowConfigurationForm.value.height);
    this.windowValuesSetter.setModelName(this.configuredWindow);
    this.configuredWindow.grupaAsortymentowa = 'Okna dachowe';
    this.configuredWindow.typ = this.getSubCategory(this.windowConfigurationForm.value.openingType);
    this.configuredWindow.geometria = this.getGeometry(this.windowConfigurationForm.value.material);
    this.configuredWindow.otwieranie = this.windowConfigurationForm.value.openingType;
    this.configuredWindow.wentylacja = this.windowConfigurationForm.value.ventilation;
    this.configuredWindow.stolarkaMaterial = this.windowConfigurationForm.value.material;
    this.configuredWindow.stolarkaKolor = this.windowConfigurationForm.value.innerColor;
    this.configuredWindow.oblachowanieMaterial = this.windowConfigurationForm.controls.outer.value.outerMaterial;
    this.configuredWindow.rodzina = 'OknoDachowe:' + this.getGeometry(this.configuredWindow.stolarkaMaterial);
    this.configuredWindow.oblachowanieKolor = this.windowConfigurationForm.controls.outer.value.outerColor;
    this.configuredWindow.oblachowanieFinisz = this.windowConfigurationForm.controls.outer.value.outerColorFinish;
    this.configuredWindow.zamkniecieTyp = this.windowConfigurationForm.controls.closure.value.handle;
    this.configuredWindow.zamkniecieKolor = this.windowConfigurationForm.controls.closure.value.handleColor;
    this.configuredWindow.uszczelki = 2;
    this.configuredWindow.windowCoats = this.chosenCoats;
    this.configuredWindow.listaDodatkow = this.chosenExtras;
    this.configuredWindow.kolorTworzywWew = this.configuredWindow.zamkniecieKolor === 'Okno:RAL7048' ? 'Okno:RAL7048' : 'Okno:RAL9016';
    this.configuredWindow.kolorTworzywZew = 'RAL7048';
    this.configuredWindow.windowHardware = false;
    this.configuredWindow.numberOfGlasses = this.configuredWindow.glazingToCalculation === 'dwuszybowy' ? 2 : 3;
    this.configuredWindow.kod = this.generateCode(this.configuredWindow.stolarkaMaterial, this.configuredWindow.otwieranie,
      this.configuredWindow.wentylacja, this.configuredWindow.glazingToCalculation, this.chosenExtras, this.configuredWindow.stolarkaKolor,
      this.configuredWindow.oblachowanieMaterial, this.configuredWindow.oblachowanieKolor, this.configuredWindow.oblachowanieFinisz,
      this.configuredWindow.szerokosc, this.configuredWindow.wysokosc);
    this.configuredWindow.CenaDetaliczna = this.priceCalculation(this.configuredWindow);
    this.windowValuesSetter.setUwAndUgValues(this.configuredWindow);
    this.setDisabled(this.configuredWindow);
    // console.log(this.configuredWindow);
  }

  setConfiguredCoats(value) {
    const index = this.chosenCoats.indexOf(value);
    if (index > -1) {
      this.chosenCoats.splice(index, 1);
    } else {
      this.chosenCoats.push(value);
    }
    this.configuredWindow.windowCoats = this.chosenCoats;
    this.setConfiguredValues();
  }

  setConfiguredExtras(extra: any) {
    const index = this.chosenExtras.indexOf(extra);
    if (index > -1) {
      this.chosenExtras.splice(index, 1);
    } else {
      this.chosenExtras.push(extra);
    }
    this.configuredWindow.listaDodatkow = this.chosenExtras;
    this.setConfiguredValues();
  }


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
      for (const coat of this.chosenCoats) {
        windowPrice += +windowToCalculations[coat];
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
      for (const extra of this.chosenExtras) {
        windowPrice += +windowToCalculations[extra];
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
  inactiveOptionSetter() {

  }

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
    this.tempConfiguredWindow.windowCoats = ['toughenedOuter'];
    this.tempConfiguredWindow.dostepneRozmiary = ['hardware'];
    this.tempConfiguredWindow.geometria = 'IS';
    this.tempConfiguredWindow.pakietSzybowy = 'Okno:E02';
    this.tempConfiguredWindow.glazingToCalculation = 'dwuszybowy';
    this.tempConfiguredWindow.zamkniecieTyp = 'handleSecure7048';
    this.tempConfiguredWindow.zamkniecieKolor = 'handleSecure7048';
    this.tempConfiguredWindow.windowHardware = false;
    this.tempConfiguredWindow.wysokosc = 119;
    this.tempConfiguredWindow.szerokosc = 79;
    this.tempConfiguredWindow.stolarkaMaterial = 'materialWood';
    this.tempConfiguredWindow.stolarkaKolor = 'innerColorNatural';
    this.tempConfiguredWindow.rodzina = 'gładki';
    this.tempConfiguredWindow.model = 'ISOV';
    this.tempConfiguredWindow.uszczelki = null;
    this.tempConfiguredWindow.windowName = 'ISOV E2 79x119';
    this.tempConfiguredWindow.otwieranie = 'centrePivot';
    this.tempConfiguredWindow.oblachowanieKolor = 'RAL9999';
    this.tempConfiguredWindow.oblachowanieFinisz = 'semiMatFinish';
    this.tempConfiguredWindow.oblachowanieMaterial = 'aluminium';
    this.tempConfiguredWindow.CenaDetaliczna = 1332.80;
    this.tempConfiguredWindow.typ = 'obrotowe';
    this.tempConfiguredWindow.windowUG = 1;
    this.tempConfiguredWindow.windowUW = 1.2;
    this.tempConfiguredWindow.linkiDoZdjec = ['https://www.okpol.pl/wp-content/uploads/2017/02/1_ISO.jpg'];
    this.tempConfiguredWindow.wentylacja = 'ventilationNeoVent';
    this.tempConfiguredWindow.numberOfGlasses = 3;
    // TODO zapisz dane do Firebase przed emisją żeby nie utracić konfiguracji
    // TODO przygotować model konfiguracji w której będą przechowywane: okno, kołnierz, roleta - a później publikować tablice
    this.configDist.populateData(this.tempConfiguredWindow, null, null);
    this.router.navigate(['/' + this.configurationSummary]);
  }

  // CALCULATIONS
  getSubCategory(openingType: string) {
    let type = '';
    switch (openingType) {
      case 'centrePivot':
        type = 'obrotowe';
        break;
      case 'topHung':
        type = 'uchylno-przesuwne';
        break;
      case 'highAxle':
        type = 'wysokoosiowe';
        break;
      case 'electric':
        type = 'elektryczne';
        break;
      case 'lShapedX':
        type = 'kolankowe';
        break;
      case 'lShapedU':
        type = 'kolankowe';
        break;
      case 'lShapedP':
        type = 'kolankowe';
        break;
      case 'lShapedL':
        type = 'kolankowe';
        break;
      case 'fix':
        type = 'fix';
        break;
    }
    return type;
  }

  getGeometry(material: string) {
    let geometry = '';
    switch (material) {
      case 'materialWood':
        geometry = 'IS';
        break;
      case 'materialPVC':
        geometry = 'IG';
        break;
    }
    return geometry;
  }

  getWindowCircuit(configuredWindow) {
    return 2 * configuredWindow.szerokosc + 2 * configuredWindow.wysokosc;
  }

  private objectMaker(availableOptionsArray: string[]): {}[] {
    const objectsArray = [];
    for (const option of availableOptionsArray) {
      const tempObject = {
        option,
        disabled: true
      };
      objectsArray.push(tempObject);
    }
    return objectsArray;
  }

  private generateCode(material: string, openingType: string, ventilation: string,
                       glazingType: string, chosenCoats: string[], innerColor: string, outerMaterial: string,
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

    // TODO do poprawy zwraca pusty string subscribe poza scopem usuwa wartość
    let glazingCode = '';
    this.windowValuesSetter.glazingTypeSetter(material, glazingType, chosenCoats, 'okno')
      .subscribe(glazingName => glazingCode = glazingName);

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

    // '1O-ISO-V-E02-KL00-A7022P-078118-OKPO01';
    return '1O-' + model + '-' + glazingCode + '-' + materialCode +
      '-' + outerMaterialCode + outerColorCode + outerFinishCode +
      '-' + widthCode + heightCode + '-KONO01';
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
    this.onHoverClick(coatOptions, this.coats.length, this.coatsVisible);
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
    this.onHoverClick(extrasOptions, this.extras.length + 5, this.extrasVisible);
  }

  moveWidthOutput(outputWidth: HTMLOutputElement) {
    const width = this.windowConfigurationForm.value.width;
    const newWidth = Number((width - this.minWidth) * 100 / (this.maxWidth - this.minWidth));
    outputWidth.style.left = ((newWidth * 0.35) + (3.5 - newWidth * 0.07)) + 'rem';
  }

  moveHeightOutput(outputHeight: HTMLOutputElement) {
    const height = this.windowConfigurationForm.value.height;
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

  // TOO TESTS
  setDisabled(configuredWindow: RoofWindowSkylight) {
    this.resetAllArrays(this.materials, this.openingTypes, this.innerColors, this.outerMaterials, this.outerColors, this.outerColorFinishes,
      this.glazingTypes, this.chosenCoats, this.chosenExtras, this.ventilations, this.handles, this.handleColors);
    // tslint:disable-next-line:forin
    for (const configurationOption in configuredWindow) {
      const selectedOption = configuredWindow[configurationOption];
      // configuredWindow[configurationOption] zwaraca wartości wybrane w trakcie konfiguracji odpowiadające
      for (const exclusion of this.exclusions) {
        const tempExclusionValue = exclusion[selectedOption]; // tu są zwracane wartości wykluczeń
        if (_.isNumber(tempExclusionValue) && tempExclusionValue > 0) {
          this.setDisabledOptions(Object.keys(exclusion)[0],
            this.materials, this.openingTypes, this.innerColors,
            this.outerMaterials, this.outerColors, this.outerColorFinishes,
            this.glazingTypes, this.chosenCoats, this.chosenExtras, this.ventilations,
            this.handles, this.handleColors);
        }
      }
      for (const set of this.sets) {
        const tempSetValue = set[selectedOption]; // tu są zwracane wartości setów
        if (_.isNumber(tempSetValue) && tempSetValue > 0) {

        }
      }
    }
    // console.log(this.exclusions[configuredWindow[configurationOption][configurationOption]]);
    // console.log(singleOption.id);
    // singleOption.disabled = this.materials[0].disabled;
  }

  resetAllArrays(materials: { option: string; disabled: boolean }[], openingTypes: { option: string; disabled: boolean }[],
                 innerColors: { option: string; disabled: boolean }[], outerMaterials: { option: string; disabled: boolean }[],
                 outerColors: { option: string; disabled: boolean }[], outerColorFinishes: { option: string; disabled: boolean }[],
                 glazingTypes: { option: string; disabled: boolean }[], chosenCoats: { option: string; disabled: boolean }[],
                 chosenExtras: { option: string; disabled: boolean }[], ventilations: { option: string; disabled: boolean }[],
                 handles: { option: string; disabled: boolean }[], handleColors: { option: string; disabled: boolean }[]) {
    for (const material of materials) {
      material.disabled = false;
    }
    for (const openingType of openingTypes) {
      openingType.disabled = false;
    }
    for (const innerColor of innerColors) {
      innerColor.disabled = false;
    }
    for (const outerMaterial of outerMaterials) {
      outerMaterial.disabled = false;
    }
    for (const outerColor of outerColors) {
      outerColor.disabled = false;
    }
    for (const outerColorFinish of outerColorFinishes) {
      outerColorFinish.disabled = false;
    }
    for (const glazingType of glazingTypes) {
      glazingType.disabled = false;
    }
    for (const chosenCoat of chosenCoats) {
      chosenCoat.disabled = false;
    }
    for (const chosenExtra of chosenExtras) {
      chosenExtra.disabled = false;
    }
    for (const ventilation of ventilations) {
      ventilation.disabled = false;
    }
    for (const handle of handles) {
      handle.disabled = false;
    }
    for (const handleColor of handleColors) {
      handleColor.disabled = false;
    }
  }

  // tslint:disable-next-line:max-line-length
  setDisabledOptions(keyValue: string, materials: { option: string; disabled: boolean }[], openingTypes: { option: string; disabled: boolean }[],
                     innerColors: { option: string; disabled: boolean }[], outerMaterials: { option: string; disabled: boolean }[],
                     outerColors: { option: string; disabled: boolean }[], outerColorFinishes: { option: string; disabled: boolean }[],
                     glazingTypes: { option: string; disabled: boolean }[], chosenCoats: { option: string; disabled: boolean }[],
                     chosenExtras: { option: string; disabled: boolean }[], ventilations: { option: string; disabled: boolean }[],
                     handles: { option: string; disabled: boolean }[], handleColors: { option: string; disabled: boolean }[]) {
    for (const material of materials) {
      if (Object.keys(material)[0] === keyValue) {

        material.disabled = true;
      }
    }
    for (const openingType of openingTypes) {
      if (Object.keys(openingType)[0] === keyValue) {
        openingType.disabled = true;
      }
    }
    for (const innerColor of innerColors) {
      if (Object.keys(innerColor)[0] === keyValue) {
        innerColor.disabled = true;
      }
    }
    for (const outerMaterial of outerMaterials) {
      if (Object.keys(outerMaterial)[0] === keyValue) {
        outerMaterial.disabled = true;
      }
    }
    for (const outerColor of outerColors) {
      if (Object.keys(outerColor)[0] === keyValue) {
        outerColor.disabled = true;
      }
    }
    for (const outerColorFinish of outerColorFinishes) {
      if (Object.keys(outerColorFinish)[0] === keyValue) {
        outerColorFinish.disabled = true;
      }
    }
    for (const glazingType of glazingTypes) {
      if (Object.keys(glazingType)[0] === keyValue) {
        glazingType.disabled = true;
      }
    }
    for (const chosenCoat of chosenCoats) {
      if (Object.keys(chosenCoat)[0] === keyValue) {
        chosenCoat.disabled = true;
      }
    }
    for (const chosenExtra of chosenExtras) {
      if (Object.keys(chosenExtra)[0] === keyValue) {
        chosenExtra.disabled = true;
      }
    }
    for (const ventilation of ventilations) {
      if (Object.keys(ventilation)[0] === keyValue) {
        ventilation.disabled = true;
      }
    }
    for (const handle of handles) {
      if (Object.keys(handle)[0] === keyValue) {
        handle.disabled = true;
      }
    }
    for (const handleColor of handleColors) {
      if (Object.keys(handleColor)[0] === keyValue) {
        handleColor.disabled = true;
      }
    }
  }
}
