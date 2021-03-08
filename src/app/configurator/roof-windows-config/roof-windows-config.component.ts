import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {ConfigurationDataService} from '../../services/configuration-data.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Observer, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {ConfigurationDistributorService} from '../../services/configuration-distributor.service';
import {AuthService} from '../../services/auth.service';
import {WindowDynamicValuesSetterService} from '../../services/window-dynamic-values-setter.service';

@Component({
  selector: 'app-roof-windows-config',
  templateUrl: './roof-windows-config.component.html',
  styleUrls: ['./roof-windows-config.component.scss']
})
export class RoofWindowsConfigComponent implements OnInit {
  loginUser: string;
  dimensions;
  configuredWindow: RoofWindowSkylight;
  tempConfiguredWindow: RoofWindowSkylight;
  windowModelsToCalculatePrice = [];
  standardWidths = [55, 66, 78, 94, 114, 134];
  showWidthMessage = false;
  standardHeights = [78, 98, 118, 140, 160];
  showHeightMessage = false;
  availableOptions = [];
  chosenCoats = [];
  chosenExtras = [];
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
  shopRoofWindowLink: string;
  configurationSummary: string;

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

  // 'width': new FormControl(78, [this.validateWidth.bind(this), Validators.required]), własnym walidator
  ngOnInit(): void {
    this.authService.isLogged ? this.authService.user.subscribe(user => this.loginUser = user.email) : this.loginUser = null;
    this.configData.fetchAllData().subscribe(() => {
      this.windowModelsToCalculatePrice = this.configData.models;
      this.availableOptions = this.configData.availableOptions;
      this.glazingTypes = this.configData.glazingTypes;
      this.materials = this.configData.materials;
      this.openingTypes = this.configData.openingTypes;
      this.innerColors = this.configData.innerColors;
      this.outerMaterials = this.configData.outerMaterials;
      // this.outerColors = this.configData.outerColor;
      this.outerColorFinishes = this.configData.outerColorFinishes;
      this.coats = this.configData.coats;
      this.dimensions = RoofWindowsConfigComponent.setDimensions(this.configData.dimensions);
      this.extras = this.configData.extras;
      this.ventilations = this.configData.ventialtions;
      this.handles = this.configData.handles;
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
      'material': new FormControl(null, [], [this.validateMaterials.bind(this)]),
      'openingType': new FormControl(null, [], [this.validateOpenings.bind(this)]),
      'control': new FormControl(null),
      'glazing': new FormControl('doubleGlazing', [], [this.validateGlazing.bind(this)]),
      'coats': new FormControl(null),
      'width': new FormControl(78),
      'height': new FormControl(118),
      'innerColor': new FormControl(null, [], [this.validateInnerColor.bind(this)]),
      'outer': new FormGroup({
        'outerMaterial': new FormControl(null),
        'outerColor': new FormControl(null),
        'outerColorFinish': new FormControl('semiMatFinish')
      }, [], [this.validateOuterMaterial.bind(this)]),
      'extras': new FormControl(null),
      'ventilation': new FormControl('ventilationNeoVent', [], [this.validateVentilation.bind(this)]),
      'handle': new FormControl(null, [], [this.validateHandle.bind(this)])
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

  static setDimensions(dimensions) {
    return dimensions;
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
    this.configuredWindow.pakietSzybowy = this.windowConfigurationForm.value.glazing;
    this.configuredWindow.szerokosc = this.windowConfigurationForm.value.width;
    this.showWidthMessage = this.standardWidths.includes(this.windowConfigurationForm.value.width);
    this.configuredWindow.wysokosc = this.windowConfigurationForm.value.height;
    this.showHeightMessage = this.standardHeights.includes(this.windowConfigurationForm.value.height);
    this.windowValuesSetter.setModelName(this.configuredWindow);
    // this.configuredWindow.windowName =
    //   this.configuredWindow.model + ' '
    //   + this.configuredWindow.pakietSzybowy + ' '
    //   + this.configuredWindow.szerokosc + 'x'
    //   + this.configuredWindow.wysokosc;
    this.configuredWindow.grupaAsortymentowa = 'Okna dachowe';
    this.configuredWindow.typ = this.getSubCategory(this.windowConfigurationForm.value.openingType);
    this.configuredWindow.geometria = this.getGeometry(this.windowConfigurationForm.value.material);
    this.configuredWindow.otwieranie = this.windowConfigurationForm.value.openingType;
    this.configuredWindow.wentylacja = this.windowConfigurationForm.value.ventilation;
    this.configuredWindow.stolarkaMaterial = this.windowConfigurationForm.value.material;
    this.configuredWindow.stolarkaKolor = this.windowConfigurationForm.value.innerColor;
    this.configuredWindow.rodzina = 'gładki';
    this.configuredWindow.oblachowanieMaterial = this.windowConfigurationForm.controls.outer.value.outerMaterial;
    this.configuredWindow.oblachowanieKolor = this.windowConfigurationForm.controls.outer.value.outerColor;
    this.configuredWindow.oblachowanieFinisz = this.windowConfigurationForm.controls.outer.value.outerColorFinish;
    this.configuredWindow.zamkniecieTyp = this.windowConfigurationForm.value.handle;
    this.configuredWindow.zamkniecieKolor = this.windowConfigurationForm.value.handle;
    this.configuredWindow.windowHardware = false;
    this.configuredWindow.dostepneRozmiary = this.chosenExtras;
    this.configuredWindow.windowCoats = this.chosenCoats;
    this.configuredWindow.CenaDetaliczna = this.priceCalculation(this.configuredWindow);

    this.windowValuesSetter.setUwAndUgValues(this.configuredWindow);
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
    this.configuredWindow.dostepneRozmiary = this.chosenExtras;
    this.setConfiguredValues();
  }


  priceCalculation(configuredWindow) {
    // ... spread operator pozwala niezagnieżdżać jendego elementu w drugi
    // tempArray.push({...data[book], id: book});
    let windowPrice = 0;
    let index = -1;
    for (let i = 0; i < this.windowModelsToCalculatePrice.length; i++) {
      if (this.windowModelsToCalculatePrice[i].model === configuredWindow.windowModel) {
        index = i;
      }
    }
    const windowToCalculations = this.windowModelsToCalculatePrice[index];
    if (index > -1) {
      if (configuredWindow.windowGlazing) {
        windowPrice += this.getWindowCircuit(configuredWindow) * windowToCalculations[configuredWindow.windowGlazing];
      }
      for (const coat of this.chosenCoats) {
        windowPrice += +windowToCalculations[coat];
      }
      if (configuredWindow.windowMaterialColor) {
        windowPrice += this.getWindowCircuit(configuredWindow) * windowToCalculations[configuredWindow.windowMaterialColor];
      }
      if (configuredWindow.windowOuterMaterial) {
        windowPrice += this.getWindowCircuit(configuredWindow) * windowToCalculations[configuredWindow.windowOuterMaterial];
      }
      if (configuredWindow.windowOuterColor) {
        windowPrice += this.getWindowCircuit(configuredWindow) * windowToCalculations[configuredWindow.windowOuterColor];
      }
      if (configuredWindow.windowOuterFinish) {
        windowPrice += this.getWindowCircuit(configuredWindow) * windowToCalculations[configuredWindow.windowOuterFinish];
      }
      for (const extra of this.chosenExtras) {
        windowPrice += +windowToCalculations[extra];
      }
      if (configuredWindow.windowVentilation) {
        windowPrice += +windowToCalculations[configuredWindow.windowVentilation];
      }
      if (configuredWindow.windowHandleType) {
        windowPrice += +windowToCalculations[configuredWindow.windowHandleType];
      }
      if (windowToCalculations) {
        this.minWidth = windowToCalculations.minWidth;
        this.maxWidth = windowToCalculations.maxWidth;
        this.minHeight = windowToCalculations.minHeight;
        this.maxHeight = windowToCalculations.maxHeight;
      }
    }
    return windowPrice;
  }

  setModels(material: string, openingType: string, ventilation: string) {
    let model = '';
    switch (material) {
      case 'materialWood':
        model = 'IS';
        break;
      case 'materialPVC':
        model = 'IG';
        break;
    }
    switch (openingType) {
      case 'centrePivot':
        model += 'O';
        break;
      case 'topHung':
        model += 'K';
        break;
      case 'fix':
        model += 'X';
        break;
      case 'electric':
        if (this.windowConfigurationForm.value.control === 'remote-control') {
          model = 'C1';
        } else {
          model = 'C2';
        }
        break;
      case 'highAxle':
        model += 'W';
        break;
    }

    if (material === 'materialWood' && openingType === 'lShapedU') {
      model = 'IKDU';
    }
    if (material === 'materialWood' && openingType === 'lShapedX') {
      model = 'IKDN';
    }
    if (material === 'materialPVC' && openingType === 'lShapedU') {
      model = 'KPVCU';
    }
    if (material === 'materialPVC' && openingType === 'lShapedX') {
      model = 'KPVCN';
    }
    if (material === 'materialPVC' && openingType === 'lShapedL') {
      model = 'KPVCL';
    }
    if (material === 'materialPVC' && openingType === 'lShapedP') {
      model = 'KPVCP';
    }

    switch (ventilation) {
      case 'ventilationNeoVent':
        model += 'V';
        break;
      case 'ventilationNeoCover':
        model += 'M';
        break;
      case 'noVentilation':
        model += 'X';
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
      let colorOptions = [];
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
    this.tempConfiguredWindow.pakietSzybowy = 'doubleGlazing';
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
    return 2 * configuredWindow.windowWidth + 2 * configuredWindow.windowHeight;
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
    return String('ROOF-WINDOWS-CONFIG.' + option);
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
    this.onHoverClick(handleOptions, this.handles.length, this.handleVisible);
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
}
