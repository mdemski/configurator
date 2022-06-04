import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {CartState} from '../../store/cart/cart.state';
import {Observable, Subject} from 'rxjs';
import {FlatRoofWindowState} from '../../store/flat-roof-window/flat-roof-window.state';
import {FlatRoofWindow} from '../../models/flat-roof-window';
import {filter, takeUntil} from 'rxjs/operators';
import _ from 'lodash';
import {AddProductToCart} from '../../store/cart/cart.actions';

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
  flatRoofWindowList: FlatRoofWindow[];
  filteredFlatRoofWindowList: FlatRoofWindow[];
  private isDestroyed$ = new Subject();
  page = 1;
  pageSize = 10;
  sortBy = 'popularity';

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.pageSize = this.getNumberInRow();
    this.isFiltering = true;
    this.flatRoofWindows$.pipe(takeUntil(this.isDestroyed$)).subscribe(flatRoofWindows => this.flatRoofWindowList = flatRoofWindows);
    this.filteredFlatRoofWindowList = this.flatRoofWindowList;
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
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
    let filteredByGlazing: FlatRoofWindow[];
    let numberOfOpeningNull = 0;
    let filteredByOpening: FlatRoofWindow[];
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
        .filter(flatRoofWindow => this.filters.flatGlazings.includes(flatRoofWindow.glazingToCalculation));
    }
    if (numberOfOpeningNull === this.filters.flatOpeningTypes.length) {
      filteredByOpening = filteredByGlazing;
    } else {
      filteredByOpening = filteredByGlazing
        .filter(flatRoofWindow => this.filters.flatOpeningTypes.includes(flatRoofWindow.otwieranie));
    }
    this.filteredFlatRoofWindowList = filteredByOpening.filter(flatRoofWindow => {
      let nameFound = true;
      let widthFound = true;
      let heightFound = true;
      if (this.filters.flatName) {
        nameFound = flatRoofWindow.productName.toString().trim().toLowerCase().indexOf(this.filters.flatName.toLowerCase()) !== -1;
      }
      if (this.filters.flatWidthFrom !== undefined && this.filters.flatWidthTo !== undefined) {
        // widths
        if (this.filters.flatWidthFrom <= this.filters.flatWidthTo) {
          widthFound = flatRoofWindow.szerokosc >= this.filters.flatWidthFrom && flatRoofWindow.szerokosc <= this.filters.flatWidthTo;
        }
        if (this.filters.flatWidthTo < 20 && this.filters.flatWidthFrom > 10) {
          widthFound = flatRoofWindow.szerokosc >= this.filters.flatWidthFrom;
        }
        if (this.filters.flatWidthFrom < 10 && this.filters.flatWidthTo > 20) {
          widthFound = flatRoofWindow.szerokosc <= this.filters.flatWidthTo;
        }
        if (this.filters.flatWidthFrom < 10 && this.filters.flatWidthTo < 20) {
          widthFound = true;
        }
      }
      if (this.filters.flatHeightFrom !== undefined && this.filters.flatHeightTo !== undefined) {
        // heights
        if (this.filters.flatHeightFrom <= this.filters.flatHeightTo) {
          heightFound = flatRoofWindow.wysokosc >= this.filters.flatHeightFrom && flatRoofWindow.wysokosc <= this.filters.flatHeightTo;
        }
        if (this.filters.flatHeightTo < 20 && this.filters.flatHeightFrom > 10) {
          heightFound = flatRoofWindow.wysokosc >= this.filters.flatHeightFrom;
        }
        if (this.filters.flatHeightFrom < 10 && this.filters.flatHeightTo > 20) {
          heightFound = flatRoofWindow.wysokosc <= this.filters.flatHeightTo;
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

  addToCart(product) {
    this.store.dispatch(new AddProductToCart(product, 1)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
  }

  sortArray() {
    switch (this.sortBy) {
      case 'popularity':
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['iloscSprzedanychRok'], ['asc']);
        break;
      case 'priceAsc':
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['CenaDetaliczna'], ['asc']);
        break;
      case 'priceDesc':
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['CenaDetaliczna'], ['desc']);
        break;
      case 'nameAsc':
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['windowName'], ['asc']);
        break;
      case 'nameDesc':
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['windowName'], ['desc']);
        break;
      default:
        this.filteredFlatRoofWindowList = _.orderBy(this.filteredFlatRoofWindowList, ['iloscSprzedanychRok'], ['asc']);
        break;
    }
  }

  getNumberInRow() {
    const containerWidth = Number(window.getComputedStyle(document.getElementsByClassName('md-container')[0]).width.slice(0, -2));
    return Math.floor(containerWidth / 300);
  }
}
