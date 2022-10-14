import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {RoofWindowState} from '../../store/roof-window/roof-window.state';
import {Observable, Subject} from 'rxjs';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {CartState} from '../../store/cart/cart.state';
import {SkylightState} from '../../store/skylight/skylight.state';
import {filter, map, takeUntil} from 'rxjs/operators';
import {AddProductToCart} from '../../store/cart/cart.actions';
import _ from 'lodash';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-reset-products',
  templateUrl: './reset-products.component.html',
  styleUrls: ['./reset-products.component.scss']
})
export class ResetProductsComponent implements OnInit {

  filters: {
    productName: string,
    productTypes: string[],
    productGlazings: string[],
    productOpeningTypes: string[],
    productMaterials: string[],
    productWidthFrom: number,
    productWidthTo: number,
    productHeightFrom: number,
    productHeightTo: number
  };
  isFiltering = false;
  @Select(RoofWindowState.roofWindows) roofWindows$: Observable<RoofWindowSkylight[]>;
  @Select(SkylightState.skylights) skylights$: Observable<RoofWindowSkylight[]>;
  @Select(CartState) cart$: Observable<any>;
  productsList: RoofWindowSkylight[] = [];
  filteredProductsList: RoofWindowSkylight[] = [];
  private isDestroyed$ = new Subject();
  page = 1;
  pageSize = 10;
  pageTableSize = 20;
  quantityForm: FormGroup;
  filtrationForm: FormGroup;
  nameToggler = true;
  typeToggler = true;
  glazingToggler = true;
  openingToggler = true;
  materialToggler = true;
  widthToggler = true;
  heightToggler = true;
  priceToggler = true;
  sortBy = 'popularity';
  sortTableBy = 'popularityInTable';
  cardPresentation = true;
  filterObject = {
    name: '',
    type: '',
    glazing: '',
    opening: '',
    material: '',
    width: '',
    height: '',
    price: ''
  };

  constructor(private store: Store, public router: Router, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.pageSize = this.getNumberInRow();
    this.isFiltering = true;
    this.roofWindows$.pipe(takeUntil(this.isDestroyed$),
      map(products => products.filter(product => product.grupaAsortymentowa === 'OknoDachoweReset'))).subscribe(roofWindows => this.productsList = roofWindows);
    this.skylights$.pipe(takeUntil(this.isDestroyed$),
      map(products => products.filter(product => product.grupaAsortymentowa === 'WyłazReset'))).subscribe(skylights => this.productsList.concat(skylights));
    this.filteredProductsList = this.productsList;
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
    this.quantityForm = new FormGroup({});
    this.filtrationForm = this.fb.group({
      name: new FormControl(),
      type: new FormControl(),
      glazing: new FormControl(),
      opening: new FormControl(),
      material: new FormControl(),
      width: new FormControl(),
      height: new FormControl(),
      price: new FormControl()
    });
    this.filtrationForm.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      map(data => {
        this.filterObject.name = data.name;
        this.filterObject.type = data.type;
        this.filterObject.glazing = data.glazing;
        this.filterObject.opening = data.opening;
        this.filterObject.material = data.material;
        this.filterObject.width = data.width;
        this.filterObject.height = data.height;
        this.filterObject.price = data.price;
      })).subscribe(() => this.filterTable(this.filterObject));
    this.isFiltering = false;
    this.sortArray();
  }

  filtersInput(filtersObject: any) {
    this.isFiltering = true;
    this.filters = filtersObject;
    let numberOfTypeNull = 0;
    let filteredByType: RoofWindowSkylight[];
    let numberOfGlazingNull = 0;
    let filteredByGlazing: RoofWindowSkylight[];
    let numberOfOpeningNull = 0;
    let filteredByOpening: RoofWindowSkylight[];
    let numberOfMaterialNull = 0;
    let filteredByMaterial: RoofWindowSkylight[];
    this.filters.productTypes.forEach(type => {
      if (type === null) {
        numberOfTypeNull++;
      }
    });
    this.filters.productGlazings.forEach(glazing => {
      if (glazing === null) {
        numberOfGlazingNull++;
      }
    });
    this.filters.productOpeningTypes.forEach(opening => {
      if (opening === null) {
        numberOfOpeningNull++;
      }
    });
    this.filters.productMaterials.forEach(material => {
      if (material === null) {
        numberOfMaterialNull++;
      }
    });
    if (numberOfTypeNull === this.filters.productTypes.length) {
      filteredByType = this.productsList;
    } else {
      filteredByType = this.productsList
        .filter(product => this.filters.productTypes.includes(product.typ));
    }
    if (numberOfGlazingNull === this.filters.productGlazings.length) {
      filteredByGlazing = filteredByType;
    } else {
      filteredByGlazing = filteredByType
        .filter(product => this.filters.productGlazings.includes(product.glazingToCalculation));
    }
    if (numberOfOpeningNull === this.filters.productOpeningTypes.length) {
      filteredByOpening = filteredByGlazing;
    } else {
      filteredByOpening = filteredByGlazing
        .filter(product => this.filters.productOpeningTypes.includes(product.otwieranie));
    }
    if (numberOfMaterialNull === this.filters.productMaterials.length) {
      filteredByMaterial = filteredByOpening;
    } else {
      filteredByMaterial = filteredByOpening
        .filter(product => this.filters.productMaterials.includes(product.stolarkaMaterial));
    }
    this.filteredProductsList = filteredByMaterial.filter(product => {
      let nameFound = true;
      let widthFound = true;
      let heightFound = true;
      if (this.filters.productName) {
        nameFound = product.productName.toString().trim().toLowerCase().indexOf(this.filters.productName.toLowerCase()) !== -1;
      }
      if (this.filters.productWidthFrom !== undefined && this.filters.productWidthTo !== undefined) {
        // widths
        if (this.filters.productWidthFrom <= this.filters.productWidthTo) {
          widthFound = product.szerokosc >= this.filters.productWidthFrom && product.szerokosc <= this.filters.productWidthTo;
        }
        if (this.filters.productWidthTo < 20 && this.filters.productWidthFrom > 10) {
          widthFound = product.szerokosc >= this.filters.productWidthFrom;
        }
        if (this.filters.productWidthFrom < 10 && this.filters.productWidthTo > 20) {
          widthFound = product.szerokosc <= this.filters.productWidthTo;
        }
        if (this.filters.productWidthFrom < 10 && this.filters.productWidthTo < 20) {
          widthFound = true;
        }
      }
      if (this.filters.productHeightFrom !== undefined && this.filters.productHeightTo !== undefined) {
        // heights
        if (this.filters.productHeightFrom <= this.filters.productHeightTo) {
          heightFound = product.wysokosc >= this.filters.productHeightFrom && product.wysokosc <= this.filters.productHeightTo;
        }
        if (this.filters.productHeightTo < 20 && this.filters.productHeightFrom > 10) {
          heightFound = product.wysokosc >= this.filters.productHeightFrom;
        }
        if (this.filters.productHeightFrom < 10 && this.filters.productHeightTo > 20) {
          heightFound = product.wysokosc <= this.filters.productHeightTo;
        }
        if (this.filters.productHeightFrom < 10 && this.filters.productHeightTo < 20) {
          heightFound = true;
        }
      }
      return nameFound && widthFound && heightFound;
    });
    this.sortArray();
    this.isFiltering = false;
  }

  getNumberInRow() {
    const containerWidth = Number(window.getComputedStyle(document.getElementsByClassName('md-container')[0]).width.slice(0, -2));
    return Math.floor(containerWidth / 300);
  }

  sortArray() {
    switch (this.sortBy) {
      case 'popularity':
        this.filteredProductsList = _.orderBy(this.filteredProductsList, ['iloscSprzedanychRok'], ['asc']);
        break;
      case 'priceAsc':
        this.filteredProductsList = _.orderBy(this.filteredProductsList, ['CenaDetaliczna'], ['asc']);
        break;
      case 'priceDesc':
        this.filteredProductsList = _.orderBy(this.filteredProductsList, ['CenaDetaliczna'], ['desc']);
        break;
      case 'nameAsc':
        this.filteredProductsList = _.orderBy(this.filteredProductsList, ['windowName'], ['asc']);
        break;
      case 'nameDesc':
        this.filteredProductsList = _.orderBy(this.filteredProductsList, ['windowName'], ['desc']);
        break;
      default:
        this.filteredProductsList = _.orderBy(this.filteredProductsList, ['iloscSprzedanychRok'], ['asc']);
        break;
    }
  }

  resize(i, delta: number) {
    this.quantityForm.get('quantity' + i).setValue(this.quantityForm.get('quantity' + i).value + delta);
  }

  decreaseQuantity(i) {
    if (this.quantityForm.get('quantity' + i).value === 1) {
      this.quantityForm.get('quantity' + i).setValue(1);
    } else {
      this.resize(i, -1);
    }
  }

  increaseQuantity(i) {
    this.resize(i, +1);
  }

  addToCart(product, quantity) {
    this.store.dispatch(new AddProductToCart(product, quantity)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
  }

  changePresentation() {
    this.cardPresentation = !this.cardPresentation;
    if (!this.cardPresentation) {
      this.loadQuantityData();
      if (this.filters) {
        this.filters.productName = '';
        this.filters.productTypes = [];
        this.filters.productGlazings = [];
        this.filters.productOpeningTypes = [];
        this.filters.productMaterials = [];
        this.filters.productWidthFrom = 0;
        this.filters.productWidthTo = 999;
        this.filters.productHeightFrom = 0;
        this.filters.productHeightTo = 999;
        this.filtersInput(this.filters);
      }
    }
  }

  private loadQuantityData() {
    this.filteredProductsList.forEach((product, index) => {
      this.quantityForm.addControl('quantity' + index, new FormControl(1));
    });
  }

  getTableRows() {
    return 20;
  }

  sortByName() {
    this.nameToggler = !this.nameToggler;
    const product = this.nameToggler ? 'asc' : 'desc';
    this.filteredProductsList = _.orderBy(this.filteredProductsList, ['productName'], product);
  }

  sortByType() {
    this.typeToggler = !this.typeToggler;
    const product = this.typeToggler ? 'asc' : 'desc';
    this.filteredProductsList = _.orderBy(this.filteredProductsList, ['grupaAsortymentowa'], product);
  }

  sortByGlazing() {
    this.glazingToggler = !this.glazingToggler;
    const product = this.glazingToggler ? 'asc' : 'desc';
    this.filteredProductsList = _.orderBy(this.filteredProductsList, ['pakietSzybowy'], product);
  }

  sortByOpening() {
    this.openingToggler = !this.openingToggler;
    const product = this.openingToggler ? 'asc' : 'desc';
    this.filteredProductsList = _.orderBy(this.filteredProductsList, ['otwieranie'], product);
  }

  sortByMaterial() {
    this.materialToggler = !this.materialToggler;
    const product = this.materialToggler ? 'asc' : 'desc';
    this.filteredProductsList = _.orderBy(this.filteredProductsList, ['stolarkaMaterial'], product);
  }

  sortByWidth() {
    this.widthToggler = !this.widthToggler;
    const product = this.widthToggler ? 'asc' : 'desc';
    this.filteredProductsList = _.orderBy(this.filteredProductsList, ['szerokosc'], product);
  }

  sortByHeight() {
    this.heightToggler = !this.heightToggler;
    const product = this.heightToggler ? 'asc' : 'desc';
    this.filteredProductsList = _.orderBy(this.filteredProductsList, ['wysokosc'], product);
  }

  sortByPrice() {
    this.priceToggler = !this.priceToggler;
    const product = this.priceToggler ? 'asc' : 'desc';
    this.filteredProductsList = _.orderBy(this.filteredProductsList, ['CenaDetaliczna'], product);
  }

  sortTableArray() {
    switch (this.sortTableBy) {
      case 'popularityInTable':
        this.filteredProductsList = _.orderBy(this.filteredProductsList, ['iloscSprzedanychRok'], ['asc']);
        break;
      case 'priceAscInTable':
        this.filteredProductsList = _.orderBy(this.filteredProductsList, ['CenaDetaliczna'], ['asc']);
        break;
      case 'priceDescInTable':
        this.filteredProductsList = _.orderBy(this.filteredProductsList, ['CenaDetaliczna'], ['desc']);
        break;
      case 'nameAscInTable':
        this.filteredProductsList = _.orderBy(this.filteredProductsList, ['productName'], ['asc']);
        break;
      case 'nameDescInTable':
        this.filteredProductsList = _.orderBy(this.filteredProductsList, ['productName'], ['desc']);
        break;
      default:
        this.filteredProductsList = _.orderBy(this.filteredProductsList, ['iloscSprzedanychRok'], ['asc']);
        break;
    }
  }

  private filterTable(filterObject: { material: string; price: string; name: string; width: string; glazing: string; type: string; opening: string; height: string }) {
    this.isFiltering = true;
    this.filteredProductsList = this.productsList;
    this.filteredProductsList = this.filteredProductsList.filter(product => {
      let nameFound = true;
      let typeFound = true;
      let glazingFound = true;
      let openingFound = true;
      let materialFound = true;
      let widthFound = true;
      let heightFound = true;
      let priceFound = true;
      if (filterObject.name) {
        nameFound = product.productName.toString().trim().toLowerCase().indexOf(filterObject.name.toLowerCase()) !== -1;
      }
      if (filterObject.type) {
        typeFound = product.grupaAsortymentowa.toString().trim().toLowerCase().indexOf(filterObject.type.toLowerCase()) !== -1;
      }
      if (filterObject.glazing) {
        let searchGlazingValue;
        if (filterObject.glazing.length < 3) {
          if (filterObject.glazing.includes('1')) {
            searchGlazingValue = filterObject.glazing.replace('1', '01');
          }
          if (filterObject.glazing.includes('2')) {
            searchGlazingValue = filterObject.glazing.replace('2', '02');
          }
          if (filterObject.glazing.includes('3')) {
            searchGlazingValue = filterObject.glazing.replace('3', '03');
          }
          if (filterObject.glazing.includes('4')) {
            searchGlazingValue = filterObject.glazing.replace('4', '04');
          }
          if (filterObject.glazing.includes('5')) {
            searchGlazingValue = filterObject.glazing.replace('5', '05');
          }
          if (filterObject.glazing.includes('6')) {
            searchGlazingValue = filterObject.glazing.replace('6', '06');
          }
          if (filterObject.glazing.includes('7')) {
            searchGlazingValue = filterObject.glazing.replace('7', '07');
          }
          if (filterObject.glazing.includes('8')) {
            searchGlazingValue = filterObject.glazing.replace('8', '08');
          }
          if (filterObject.glazing.includes('9')) {
            searchGlazingValue = filterObject.glazing.replace('9', '09');
          }
          if (!filterObject.glazing.includes('1') &&
            !filterObject.glazing.includes('2') &&
            !filterObject.glazing.includes('3') &&
            !filterObject.glazing.includes('4') &&
            !filterObject.glazing.includes('5') &&
            !filterObject.glazing.includes('6') &&
            !filterObject.glazing.includes('7') &&
            !filterObject.glazing.includes('8') &&
            !filterObject.glazing.includes('9')) {
            searchGlazingValue = filterObject.glazing;
          }
        } else {
          searchGlazingValue = filterObject.glazing;
        }
        glazingFound = product.pakietSzybowy.toString().trim().toLowerCase().indexOf(searchGlazingValue.toLowerCase()) !== -1;
      }
      if (filterObject.opening) {
        openingFound = product.otwieranie.toString().trim().toLowerCase().indexOf(filterObject.opening.toLowerCase()) !== -1;
      }
      if (filterObject.material) {
        materialFound = product.stolarkaMaterial.toString().trim().toLowerCase().indexOf(filterObject.material.toLowerCase()) !== -1;
      }
      if (filterObject.width) {
        widthFound = product.szerokosc.toString().trim().toLowerCase().indexOf(filterObject.width.toLowerCase()) !== -1;
      }
      if (filterObject.height) {
        heightFound = product.wysokosc.toString().trim().toLowerCase().indexOf(filterObject.height.toLowerCase()) !== -1;
      }
      if (filterObject.price) {
        priceFound = product.CenaDetaliczna.toString().trim().toLowerCase().indexOf(filterObject.price.toLowerCase()) !== -1;
      }
      return nameFound && typeFound && glazingFound && openingFound && materialFound && widthFound && heightFound && priceFound;
    });
    this.isFiltering = false;
  }
}
