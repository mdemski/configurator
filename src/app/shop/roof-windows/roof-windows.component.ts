import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {filter, map, takeUntil} from 'rxjs/operators';
import {Select, Store} from '@ngxs/store';
import {RoofWindowState} from '../../store/roof-window/roof-window.state';
import {Observable, Subject} from 'rxjs';
import _ from 'lodash';
import {AddProductToCart} from '../../store/cart/cart.actions';
import {CartState} from '../../store/cart/cart.state';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-roof-windows',
  templateUrl: './roof-windows.component.html',
  styleUrls: ['./roof-windows.component.scss']
})
export class RoofWindowsComponent implements OnInit, OnDestroy {
  filters: {
    windowName: string,
    windowGlazings: string[],
    windowOpeningTypes: string[],
    windowMaterials: string[],
    windowWidthFrom: number,
    windowWidthTo: number,
    windowHeightFrom: number,
    windowHeightTo: number
  };
  isFiltering = false;
  @Select(RoofWindowState.roofWindows) roofWindows$: Observable<RoofWindowSkylight[]>;
  @Select(CartState) cart$: Observable<any>;
  roofWindowsList: RoofWindowSkylight[] = [];
  filteredRoofWindowsList: RoofWindowSkylight[] = [];
  private isDestroyed$ = new Subject();
  page = 1;
  pageSize = 10;
  sortBy = 'popularity';
  cardPresentation = true;
  sortTableBy = 'popularityInTable';
  pageTableSize = 20;
  filtrationForm: FormGroup;
  nameToggler = true;
  widthToggler = true;
  heightToggler = true;
  materialToggler = true;
  glazingToggler = true;
  ventilationToggler = true;
  priceToggler = true;
  filterObject = {
    name: '',
    width: '',
    height: '',
    material: '',
    glazing: '',
    ventilation: '',
    price: ''
  };

  constructor(private store: Store, public router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.pageSize = this.getNumberInRow();
    this.isFiltering = true;
    this.roofWindows$.pipe(takeUntil(this.isDestroyed$)).subscribe(roofWindows => this.roofWindowsList = roofWindows);
    this.filteredRoofWindowsList = this.roofWindowsList;
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
    this.filtrationForm = this.fb.group({
      name: new FormControl(),
      width: new FormControl(),
      height: new FormControl(),
      material: new FormControl(),
      glazing: new FormControl(),
      ventilation: new FormControl(),
      price: new FormControl()
    });
    this.filtrationForm.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      map(data => {
        this.filterObject.name = data.name;
        this.filterObject.width = data.width;
        this.filterObject.height = data.height;
        this.filterObject.material = data.material;
        this.filterObject.glazing = data.glazing;
        this.filterObject.ventilation = data.ventilation;
        this.filterObject.price = data.price;
      })).subscribe(() => this.filterTable(this.filterObject));
    this.isFiltering = false;
    this.sortArray();
  }

  filtersInput(filtersObject: any) {
    this.isFiltering = true;
    this.filters = filtersObject;
    let numberOfGlazingNull = 0;
    let filteredByGlazing: RoofWindowSkylight[];
    let numberOfOpeningNull = 0;
    let filteredByOpening: RoofWindowSkylight[];
    let numberOfMaterialNull = 0;
    let filteredByMaterial: RoofWindowSkylight[];
    this.filters.windowGlazings.forEach(glazing => {
      if (glazing === null) {
        numberOfGlazingNull++;
      }
    });
    this.filters.windowOpeningTypes.forEach(opening => {
      if (opening === null) {
        numberOfOpeningNull++;
      }
    });
    this.filters.windowMaterials.forEach(material => {
      if (material === null) {
        numberOfMaterialNull++;
      }
    });
    if (numberOfGlazingNull === this.filters.windowGlazings.length) {
      filteredByGlazing = this.roofWindowsList;
    } else {
      filteredByGlazing = this.roofWindowsList
        .filter(window => this.filters.windowGlazings.includes(window.glazingToCalculation));
    }
    if (numberOfOpeningNull === this.filters.windowOpeningTypes.length) {
      filteredByOpening = filteredByGlazing;
    } else {
      filteredByOpening = filteredByGlazing
        .filter(window => this.filters.windowOpeningTypes.includes(window.otwieranie));
    }
    if (numberOfMaterialNull === this.filters.windowMaterials.length) {
      filteredByMaterial = filteredByOpening;
    } else {
      filteredByMaterial = filteredByOpening
        .filter(window => this.filters.windowMaterials.includes(window.stolarkaMaterial));
    }
    this.filteredRoofWindowsList = filteredByMaterial.filter(window => {
      let nameFound = true;
      let widthFound = true;
      let heightFound = true;
      if (this.filters.windowName) {
        nameFound = window.productName.toString().trim().toLowerCase().indexOf(this.filters.windowName.toLowerCase()) !== -1;
      }
      if (this.filters.windowWidthFrom !== undefined && this.filters.windowWidthTo !== undefined) {
        // widths
        if (this.filters.windowWidthFrom <= this.filters.windowWidthTo) {
          widthFound = window.szerokosc >= this.filters.windowWidthFrom && window.szerokosc <= this.filters.windowWidthTo;
        }
        if (this.filters.windowWidthTo < 20 && this.filters.windowWidthFrom > 10) {
          widthFound = window.szerokosc >= this.filters.windowWidthFrom;
        }
        if (this.filters.windowWidthFrom < 10 && this.filters.windowWidthTo > 20) {
          widthFound = window.szerokosc <= this.filters.windowWidthTo;
        }
        if (this.filters.windowWidthFrom < 10 && this.filters.windowWidthTo < 20) {
          widthFound = true;
        }
      }
      if (this.filters.windowHeightFrom !== undefined && this.filters.windowHeightTo !== undefined) {
        // heights
        if (this.filters.windowHeightFrom <= this.filters.windowHeightTo) {
          heightFound = window.wysokosc >= this.filters.windowHeightFrom && window.wysokosc <= this.filters.windowHeightTo;
        }
        if (this.filters.windowHeightTo < 20 && this.filters.windowHeightFrom > 10) {
          heightFound = window.wysokosc >= this.filters.windowHeightFrom;
        }
        if (this.filters.windowHeightFrom < 10 && this.filters.windowHeightTo > 20) {
          heightFound = window.wysokosc <= this.filters.windowHeightTo;
        }
        if (this.filters.windowHeightFrom < 10 && this.filters.windowHeightTo < 20) {
          heightFound = true;
        }
      }
      return nameFound && widthFound && heightFound;
    });
    this.sortArray();
    this.isFiltering = false;
  }

  ngOnDestroy() {
    this.isDestroyed$.next(null);
  }

  getNumberInRow() {
    const containerWidth = Number(window.getComputedStyle(document.getElementsByClassName('md-container')[0]).width.slice(0, -2));
    return Math.floor(containerWidth / 300);
  }

  sortArray() {
    switch (this.sortTableBy) {
      case 'popularityInTable':
        this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['iloscSprzedanychRok'], ['asc']);
        break;
      case 'priceAscInTable':
        this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['CenaDetaliczna'], ['asc']);
        break;
      case 'priceDescInTable':
        this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['CenaDetaliczna'], ['desc']);
        break;
      case 'nameAscInTable':
        this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['windowName'], ['asc']);
        break;
      case 'nameDescInTable':
        this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['windowName'], ['desc']);
        break;
      default:
        this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['iloscSprzedanychRok'], ['asc']);
        break;
    }
  }

  addToCart(product) {
    this.store.dispatch(new AddProductToCart(product, 1)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
  }

  changePresentation() {
    this.cardPresentation = !this.cardPresentation;
    if (this.cardPresentation) {
      this.filters.windowName = '';
      this.filters.windowGlazings = [];
      this.filters.windowMaterials = [];
      this.filters.windowOpeningTypes = [];
      this.filters.windowHeightFrom = 0;
      this.filters.windowHeightTo = 999;
      this.filters.windowWidthFrom = 0;
      this.filters.windowWidthTo = 0;
      this.filtersInput(this.filters);
    }
  }

  sortTableArray() {
    switch (this.sortBy) {
      case 'popularity':
        this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['iloscSprzedanychRok'], ['asc']);
        break;
      case 'priceAsc':
        this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['CenaDetaliczna'], ['asc']);
        break;
      case 'priceDesc':
        this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['CenaDetaliczna'], ['desc']);
        break;
      case 'nameAsc':
        this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['windowName'], ['asc']);
        break;
      case 'nameDesc':
        this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['windowName'], ['desc']);
        break;
      default:
        this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['iloscSprzedanychRok'], ['asc']);
        break;
    }
  }

  getTableRows() {
    return 20;
  }

  sortByName() {
    this.nameToggler = !this.nameToggler;
    const product = this.nameToggler ? 'asc' : 'desc';
    this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['productName'], product);
  }

  sortByWidth() {
    this.widthToggler = !this.widthToggler;
    const product = this.widthToggler ? 'asc' : 'desc';
    this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['szerokosc'], product);
  }

  sortByHeight() {
    this.heightToggler = !this.heightToggler;
    const product = this.heightToggler ? 'asc' : 'desc';
    this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['wysokosc'], product);
  }

  sortByMaterial() {
    this.materialToggler = !this.materialToggler;
    const product = this.materialToggler ? 'asc' : 'desc';
    this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['stolarkaMaterial'], product);
  }

  sortByGlazing() {
    this.glazingToggler = !this.glazingToggler;
    const product = this.glazingToggler ? 'asc' : 'desc';
    this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['pakietSzybowy'], product);
  }

  sortByVentilation() {
    this.ventilationToggler = !this.ventilationToggler;
    const product = this.ventilationToggler ? 'asc' : 'desc';
    this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['wentylacja'], product);
  }

  sortByPrice() {
    this.priceToggler = !this.priceToggler;
    const product = this.priceToggler ? 'asc' : 'desc';
    this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['CenaDetaliczna'], product);
  }

  private filterTable(filterObject: { material: string; price: string; ventilation: string; name: string; width: string; glazing: string; height: string }) {
    this.isFiltering = true;
    this.filteredRoofWindowsList = this.roofWindowsList;
    this.filteredRoofWindowsList = this.filteredRoofWindowsList.filter(window => {
      let nameFound = true;
      let widthFound = true;
      let heightFound = true;
      let materialFound = true;
      let glazingFound = true;
      let ventilationFound = true;
      let priceFound = true;
      if (filterObject.name) {
        nameFound = window.productName.toString().trim().toLowerCase().indexOf(filterObject.name.toLowerCase()) !== -1;
      }
      if (filterObject.width) {
        widthFound = window.szerokosc.toString().trim().toLowerCase().indexOf(filterObject.width.toLowerCase()) !== -1;
      }
      if (filterObject.height) {
        heightFound = window.wysokosc.toString().trim().toLowerCase().indexOf(filterObject.height.toLowerCase()) !== -1;
      }
      if (filterObject.material) {
        materialFound = window.stolarkaMaterial.toString().trim().toLowerCase().indexOf(filterObject.material.toLowerCase()) !== -1;
      }
      if (filterObject.glazing) {
        glazingFound = window.pakietSzybowy.toString().trim().toLowerCase().indexOf(filterObject.glazing.toLowerCase()) !== -1;
      }
      if (filterObject.ventilation) {
        ventilationFound = window.wentylacja.toString().trim().toLowerCase().indexOf(filterObject.ventilation.toLowerCase()) !== -1;
      }
      if (filterObject.price) {
        priceFound = window.CenaDetaliczna.toString().trim().toLowerCase().indexOf(filterObject.price.toLowerCase()) !== -1;
      }
      return nameFound && widthFound && heightFound && materialFound && glazingFound && ventilationFound && priceFound;
    });
    this.isFiltering = false;
  }
}
