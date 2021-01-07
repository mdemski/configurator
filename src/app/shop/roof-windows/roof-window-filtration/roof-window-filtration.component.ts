import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DatabaseService} from '../../../services/database.service';

@Component({
  selector: 'app-roof-window-filtration',
  templateUrl: './roof-window-filtration.component.html',
  styleUrls: ['./roof-window-filtration.component.scss']
})
export class RoofWindowFiltrationComponent implements OnInit {
  @Output() filters = new EventEmitter<any>();
  glassesToChoice: string[] = [];
  openingTypesToChoice: string[] = [];
  materialsToChoice: string[] = [];

  chosenGlasses: string[] = [];
  chosenOpeningTypes: string[] = [];
  chosenMaterial: string[] = [];

  filtersObject = {
    windowName: '',
    windowGlazing: [],
    windowOpeningType: [],
    windowMaterial: [],
    windowWidthFrom: '',
    windowWidthTo: '',
    windowHeightFrom: '',
    windowHeightTo: ''
  };
  windowName = new FormControl();
  windowGlazing = new FormControl();
  windowOpeningType = new FormControl();
  windowMaterial = new FormControl();
  windowWidthFrom = new FormControl();
  windowWidthTo = new FormControl();
  windowHeightFrom = new FormControl();
  windowHeightTo = new FormControl();

  constructor(private dataBase: DatabaseService) {
  }

  ngOnInit() {
    this.loadGlasses();
    this.loadOpeningTypes();
    this.loadMaterials();
  }

  // Filtering windows by windowName
  editValueToObjectFromName(windowName: FormControl) {
    this.filtersObject.windowName = windowName.value;
    this.search(this.filtersObject);
  }

  // Filtering windows by windowGlazing
  editValueToObjectFromGlazing(windowGlazing: string) {
    const index = this.chosenGlasses.indexOf(windowGlazing, 0);
    if (index > -1) {
      this.chosenGlasses.splice(index, 1);
    } else {
      this.chosenGlasses.push(windowGlazing);
    }
    this.filtersObject.windowGlazing = this.chosenGlasses;
    this.search(this.filtersObject);
  }

  // Filtering windows by opening type
  editValueToObjectFromOpening(opening: string) {
    const index = this.chosenOpeningTypes.indexOf(opening, 0);
    if (index > -1) {
      this.chosenOpeningTypes.splice(index, 1);
    } else {
      this.chosenOpeningTypes.push(opening);
    }
    this.filtersObject.windowOpeningType = this.chosenOpeningTypes;
    this.search(this.filtersObject);
  }

  // Filtering windows by material type
  editValueToObjectFromMaterial(material: string) {
    const index = this.chosenMaterial.indexOf(material, 0);
    if (index > -1) {
      this.chosenMaterial.splice(index, 1);
    } else {
      this.chosenMaterial.push(material);
    }
    this.filtersObject.windowMaterial = this.chosenMaterial;
    this.search(this.filtersObject);
  }

  editValueToObjectFromWidthFrom(windowWidthFrom: FormControl) {
    this.filtersObject.windowWidthFrom = windowWidthFrom.value;
    this.search(this.filtersObject);
  }

  editValueToObjectFromWidthTo(windowWidthTo: FormControl) {
    this.filtersObject.windowWidthTo = windowWidthTo.value;
    this.search(this.filtersObject);
  }

  editValueToObjectFromHeightFrom(windowHeightFrom: FormControl) {
    this.filtersObject.windowHeightFrom = windowHeightFrom.value;
    this.search(this.filtersObject);
  }

  editValueToObjectFromHeightTo(windowHeightTo: FormControl) {
    this.filtersObject.windowHeightTo = windowHeightTo.value;
    this.search(this.filtersObject);
  }

  search(filters: any): void {
    Object.keys(filters).forEach(key => filters[key] === '' ? delete filters[key] : key);
    this.filters.emit(filters);
  }

  // TODO zamienić nazwę na dwu i trzyszybowe w zależności od wyniku metody starts with
  private loadGlasses() {
    const glassesTemp = [];
    for (const window of this.dataBase.getAllRoofWindowsToShopList()) {
      glassesTemp.push(window.windowGlazing);
    }
    this.glassesToChoice = glassesTemp.filter((value, index, self) => self.indexOf(value) === index);
  }

  private loadOpeningTypes() {
    const openingTemp = [];
    for (const window of this.dataBase.getAllRoofWindowsToShopList()) {
      openingTemp.push(window.windowOpeningType);
    }
    this.openingTypesToChoice = openingTemp.filter((value, index, self) => self.indexOf(value) === index);
  }

  private loadMaterials() {
    const materialTemp = [];
    for (const window of this.dataBase.getAllRoofWindowsToShopList()) {
      materialTemp.push(window.windowMaterial);
    }
    this.materialsToChoice = materialTemp.filter((value, index, self) => self.indexOf(value) === index);
  }

  // Biggest window height for validation
  private getBiggestHeight() {
    let biggestHeight = 0;
    for (const window of this.dataBase.getAllRoofWindowsToShopList()) {
      if (window.windowHeight > biggestHeight) {
        biggestHeight = window.windowHeight;
      }
    }
    return biggestHeight;
  }

  // Biggest window width for validation
  private getBiggestWidth() {
    let biggestWidth = 0;
    for (const window of this.dataBase.getAllRoofWindowsToShopList()) {
      if (window.windowWidth > biggestWidth) {
        biggestWidth = window.windowWidth;
      }
    }
    return biggestWidth;
  }
}
