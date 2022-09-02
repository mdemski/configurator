import { Component, OnInit } from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {RoofWindowState} from '../../store/roof-window/roof-window.state';
import {Observable, Subject} from 'rxjs';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {CartState} from '../../store/cart/cart.state';
import {SkylightState} from '../../store/skylight/skylight.state';
import {filter, map, takeUntil} from 'rxjs/operators';
import {AddProductToCart} from '../../store/cart/cart.actions';
import _ from 'lodash';

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
  sortBy = 'popularity';

  constructor(private store: Store) {
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

  addToCart(product) {
    this.store.dispatch(new AddProductToCart(product, 1)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
  }
}
