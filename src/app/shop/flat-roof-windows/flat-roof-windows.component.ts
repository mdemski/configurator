import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {CartState} from '../../store/cart/cart.state';
import {Observable, Subject} from 'rxjs';
import {FlatRoofWindowState} from '../../store/flat-roof-window/flat-roof-window.state';
import {FlatRoofWindow} from '../../models/flat-roof-window';
import {filter, map, takeUntil} from 'rxjs/operators';
import _ from 'lodash';
import {AddProductToCart} from '../../store/cart/cart.actions';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-flat-roof-windows',
  templateUrl: './flat-roof-windows.component.html',
  styleUrls: ['./flat-roof-windows.component.scss']
})
export class FlatRoofWindowsComponent implements OnInit, OnDestroy {
  filters: {
    flatName: string,
    flatGlazings: string[],
    flatOpeningTypes: string[],
    flatWidthFrom: number,
    flatWidthTo: number,
    flatHeightFrom: number,
    flatHeightTo: number
  };
  isFiltering = false;
  @Select(FlatRoofWindowState.flats) flatRoofWindows$: Observable<FlatRoofWindow[]>;
  @Select(CartState) cart$: Observable<any>;
  flatRoofWindowList: { product: FlatRoofWindow, id: number }[] = [];
  filteredFlatRoofWindowList: { product: FlatRoofWindow, id: number }[] = [];
  private isDestroyed$ = new Subject();
  page = 1;
  pageSize = 10;
  pageTableSize = 20;
  quantityForm: FormGroup;
  filtrationForm: FormGroup;
  nameToggler = true;
  glazingToggler = true;
  openingToggler = true;
  widthToggler = true;
  heightToggler = true;
  priceToggler = true;
  sortBy = 'popularity';
  sortTableBy = 'popularityInTable';
  cardPresentation = true;
  filterObject = {
    name: '',
    glazing: '',
    opening: '',
    width: '',
    height: '',
    price: ''
  };

  constructor(private store: Store, public router: Router, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.pageSize = this.getNumberInRow();
    this.pageTableSize = this.getTableRows();
    this.isFiltering = true;
    this.flatRoofWindows$.pipe(takeUntil(this.isDestroyed$)).subscribe(flatRoofWindows => {
      flatRoofWindows.forEach((product, index) => {
        this.flatRoofWindowList.push({product, id: index});
      });
    });
    this.filteredFlatRoofWindowList = this.flatRoofWindowList;
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
    this.quantityForm = new FormGroup({});
    this.filtrationForm = this.fb.group({
      name: new FormControl(),
      glazing: new FormControl(),
      opening: new FormControl(),
      width: new FormControl(),
      height: new FormControl(),
      price: new FormControl()
    });
    this.filtrationForm.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      map(data => {
        this.filterObject.name = data.name;
        this.filterObject.glazing = data.glazing;
        this.filterObject.opening = data.opening;
        this.filterObject.width = data.width;
        this.filterObject.height = data.height;
        this.filterObject.price = data.price;
      })).subscribe(() => this.filterTable(this.filterObject));
    this.isFiltering = false;
    this.sortArray();
  }

  ngOnDestroy() {
    this.isDestroyed$.next(null);
  }

  filtersInput(filtersObject: any) {
    this.isFiltering = true;
    this.filters = filtersObject;
    let numberOfGlazingNull = 0;
    let filteredByGlazing: { product: FlatRoofWindow, id: number }[];
    let numberOfOpeningNull = 0;
    let filteredByOpening: { product: FlatRoofWindow, id: number }[];
    this.filters.flatGlazings.forEach(glazing => {
      if (glazing === null) {
        numberOfGlazingNull++;
      }
    });
    this.filters.flatOpeningTypes.forEach(opening => {
      if (opening === null) {
        numberOfOpeningNull++;
      }
    });
    if (numberOfGlazingNull === this.filters.flatGlazings.length) {
      filteredByGlazing = this.flatRoofWindowList;
    } else {
      filteredByGlazing = this.flatRoofWindowList
        .filter(flatRoofWindow => this.filters.flatGlazings.includes(flatRoofWindow.product.glazingToCalculation));
    }
    if (numberOfOpeningNull === this.filters.flatOpeningTypes.length) {
      filteredByOpening = filteredByGlazing;
    } else {
      filteredByOpening = filteredByGlazing
        .filter(flatRoofWindow => this.filters.flatOpeningTypes.includes(flatRoofWindow.product.otwieranie));
    }
    this.filteredFlatRoofWindowList = filteredByOpening.filter(flatRoofWindow => {
      let nameFound = true;
      let widthFound = true;
      let heightFound = true;
      if (this.filters.flatName) {
        nameFound = flatRoofWindow.product.productName.toString().trim().toLowerCase().indexOf(this.filters.flatName.toLowerCase()) !== -1;
      }
      if (this.filters.flatWidthFrom !== undefined && this.filters.flatWidthTo !== undefined) {
        // widths
        if (this.filters.flatWidthFrom <= this.filters.flatWidthTo) {
          widthFound = flatRoofWindow.product.szerokosc >= this.filters.flatWidthFrom && flatRoofWindow.product.szerokosc <= this.filters.flatWidthTo;
        }
        if (this.filters.flatWidthTo < 20 && this.filters.flatWidthFrom > 10) {
          widthFound = flatRoofWindow.product.szerokosc >= this.filters.flatWidthFrom;
        }
        if (this.filters.flatWidthFrom < 10 && this.filters.flatWidthTo > 20) {
          widthFound = flatRoofWindow.product.szerokosc <= this.filters.flatWidthTo;
        }
        if (this.filters.flatWidthFrom < 10 && this.filters.flatWidthTo < 20) {
          widthFound = true;
        }
      }
      if (this.filters.flatHeightFrom !== undefined && this.filters.flatHeightTo !== undefined) {
        // heights
        if (this.filters.flatHeightFrom <= this.filters.flatHeightTo) {
          heightFound = flatRoofWindow.product.wysokosc >= this.filters.flatHeightFrom && flatRoofWindow.product.wysokosc <= this.filters.flatHeightTo;
        }
        if (this.filters.flatHeightTo < 20 && this.filters.flatHeightFrom > 10) {
          heightFound = flatRoofWindow.product.wysokosc >= this.filters.flatHeightFrom;
        }
        if (this.filters.flatHeightFrom < 10 && this.filters.flatHeightTo > 20) {
          heightFound = flatRoofWindow.product.wysokosc <= this.filters.flatHeightTo;
        }
        if (this.filters.flatHeightFrom < 10 && this.filters.flatHeightTo < 20) {
          heightFound = true;
        }
      }
      return nameFound && widthFound && heightFound;
    });
    this.sortArray();
    this.isFiltering = false;
  }

  sortArray() {
    switch (this.sortBy) {
      case 'popularity':
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.iloscSprzedanychRok'], ['asc']);
        break;
      case 'priceAsc':
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.CenaDetaliczna'], ['asc']);
        break;
      case 'priceDesc':
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.CenaDetaliczna'], ['desc']);
        break;
      case 'nameAsc':
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.productName'], ['asc']);
        break;
      case 'nameDesc':
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.productName'], ['desc']);
        break;
      default:
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.iloscSprzedanychRok'], ['asc']);
        break;
    }
  }

  getNumberInRow() {
    const containerWidth = Number(window.getComputedStyle(document.getElementsByClassName('md-container')[0]).width.slice(0, -2));
    return Math.floor(containerWidth / 300);
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
        this.filters.flatName = '';
        this.filters.flatGlazings = [];
        this.filters.flatOpeningTypes = [];
        this.filters.flatWidthFrom = 0;
        this.filters.flatWidthTo = 999;
        this.filters.flatHeightFrom = 0;
        this.filters.flatHeightTo = 999;
        this.filtersInput(this.filters);
      }
    }
  }

  private loadQuantityData() {
    this.filteredFlatRoofWindowList.forEach((flat, index) => {
      this.quantityForm.addControl('quantity' + index, new FormControl(1));
    });
  }

  getTableRows() {
    return 20;
  }

  sortByName() {
    this.nameToggler = !this.nameToggler;
    const product = this.nameToggler ? 'asc' : 'desc';
    this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.productName'], product);
  }

  sortByGlazing() {
    this.glazingToggler = !this.glazingToggler;
    const product = this.glazingToggler ? 'asc' : 'desc';
    this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.pakietSzybowy'], product);
  }

  sortByOpening() {
    this.openingToggler = !this.openingToggler;
    const product = this.openingToggler ? 'asc' : 'desc';
    this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.otwieranie'], product);
  }

  sortByWidth() {
    this.widthToggler = !this.widthToggler;
    const product = this.widthToggler ? 'asc' : 'desc';
    this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.szerokosc'], product);
  }

  sortByHeight() {
    this.heightToggler = !this.heightToggler;
    const product = this.heightToggler ? 'asc' : 'desc';
    this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.wysokosc'], product);
  }

  sortByPrice() {
    this.priceToggler = !this.priceToggler;
    const product = this.priceToggler ? 'asc' : 'desc';
    this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.CenaDetaliczna'], product);
  }

  sortTableArray() {
    switch (this.sortTableBy) {
      case 'popularityInTable':
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.iloscSprzedanychRok'], ['asc']);
        break;
      case 'priceAscInTable':
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.CenaDetaliczna'], ['asc']);
        break;
      case 'priceDescInTable':
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.CenaDetaliczna'], ['desc']);
        break;
      case 'nameAscInTable':
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.productName'], ['asc']);
        break;
      case 'nameDescInTable':
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.productName'], ['desc']);
        break;
      default:
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['product.iloscSprzedanychRok'], ['asc']);
        break;
    }
  }

  private filterTable(filterObject: { price: string; name: string; width: string; glazing: string; opening: string; height: string }) {
    this.isFiltering = true;
    this.filteredFlatRoofWindowList = this.flatRoofWindowList;
    this.filteredFlatRoofWindowList = this.filteredFlatRoofWindowList.filter(data => {
      const flat = data.product;
      let nameFound = true;
      let glazingFound = true;
      let openingFound = true;
      let widthFound = true;
      let heightFound = true;
      let priceFound = true;
      if (filterObject.name) {
        nameFound = flat.productName.toString().trim().toLowerCase().indexOf(filterObject.name.toLowerCase()) !== -1;
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
        glazingFound = flat.pakietSzybowy.toString().trim().toLowerCase().indexOf(searchGlazingValue.toLowerCase()) !== -1;
      }
      if (filterObject.opening) {
        openingFound = flat.otwieranie.toString().trim().toLowerCase().indexOf(filterObject.opening.toLowerCase()) !== -1;
      }
      if (filterObject.width) {
        widthFound = flat.szerokosc.toString().trim().toLowerCase().indexOf(filterObject.width.toLowerCase()) !== -1;
      }
      if (filterObject.height) {
        heightFound = flat.wysokosc.toString().trim().toLowerCase().indexOf(filterObject.height.toLowerCase()) !== -1;
      }
      if (filterObject.price) {
        priceFound = flat.CenaDetaliczna.toString().trim().toLowerCase().indexOf(filterObject.price.toLowerCase()) !== -1;
      }
      return nameFound && glazingFound && openingFound && widthFound && heightFound && priceFound;
    });
    this.isFiltering = false;
  }
}
