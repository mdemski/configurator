import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {Select, Store} from '@ngxs/store';
import {SkylightState} from '../../store/skylight/skylight.state';
import {CartState} from '../../store/cart/cart.state';
import {filter, takeUntil} from 'rxjs/operators';
import {AddProductToCart} from '../../store/cart/cart.actions';
import _ from 'lodash';

@Component({
  selector: 'app-skylights',
  templateUrl: './skylights.component.html',
  styleUrls: ['./skylights.component.scss']
})
export class SkylightsComponent implements OnInit, OnDestroy {

  filters: {
    skylightName: string,
    skylightGlazings: string[],
    skylightOpeningTypes: string[],
    skylightMaterials: string[],
    skylightWidthFrom: number,
    skylightWidthTo: number,
    skylightHeightFrom: number,
    skylightHeightTo: number
  };
  isFiltering = false;
  @Select(SkylightState.skylights) skylights$: Observable<RoofWindowSkylight[]>;
  @Select(CartState) cart$: Observable<any>;
  skylights: RoofWindowSkylight[] = [];
  filteredSkylightList: RoofWindowSkylight[] = [];
  isDestroyed$ = new Subject();
  page = 1;
  pageSize = 10;
  sortBy = 'popularity';

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.pageSize = this.getNumberInRow();
    this.isFiltering = true;
    this.skylights$.pipe(takeUntil(this.isDestroyed$)).subscribe(skylights => this.skylights = skylights);
    this.filteredSkylightList = this.skylights;
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
    this.isFiltering = false;
    this.sortArray();
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
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
    this.filters.skylightGlazings.forEach(glazing => {
      if (glazing === null) {
        numberOfGlazingNull++;
      }
    });
    this.filters.skylightOpeningTypes.forEach(opening => {
      if (opening === null) {
        numberOfOpeningNull++;
      }
    });
    this.filters.skylightMaterials.forEach(material => {
      if (material === null) {
        numberOfMaterialNull++;
      }
    });
    if (numberOfGlazingNull === this.filters.skylightGlazings.length) {
      filteredByGlazing = this.skylights;
    } else {
      filteredByGlazing = this.skylights
        .filter(skylight => this.filters.skylightGlazings.includes(skylight.glazingToCalculation));
    }
    if (numberOfOpeningNull === this.filters.skylightOpeningTypes.length) {
      filteredByOpening = filteredByGlazing;
    } else {
      filteredByOpening = filteredByGlazing
        .filter(skylight => this.filters.skylightOpeningTypes.includes(skylight.otwieranie));
    }
    if (numberOfMaterialNull === this.filters.skylightMaterials.length) {
      filteredByMaterial = filteredByOpening;
    } else {
      filteredByMaterial = filteredByOpening
        .filter(skylight => this.filters.skylightMaterials.includes(skylight.stolarkaMaterial));
    }
    this.filteredSkylightList = filteredByMaterial.filter(skylight => {
      let nameFound = true;
      let widthFound = true;
      let heightFound = true;
      if (this.filters.skylightName) {
        nameFound = skylight.productName.toString().trim().toLowerCase().indexOf(this.filters.skylightName.toLowerCase()) !== -1;
      }
      if (this.filters.skylightWidthFrom !== undefined && this.filters.skylightWidthTo !== undefined) {
        // widths
        if (this.filters.skylightWidthFrom <= this.filters.skylightWidthTo) {
          widthFound = skylight.szerokosc >= this.filters.skylightWidthFrom && skylight.szerokosc <= this.filters.skylightWidthTo;
        }
        if (this.filters.skylightWidthTo < 20 && this.filters.skylightWidthFrom > 10) {
          widthFound = skylight.szerokosc >= this.filters.skylightWidthFrom;
        }
        if (this.filters.skylightWidthFrom < 10 && this.filters.skylightWidthTo > 20) {
          widthFound = skylight.szerokosc <= this.filters.skylightWidthTo;
        }
        if (this.filters.skylightWidthFrom < 10 && this.filters.skylightWidthTo < 20) {
          widthFound = true;
        }
      }
      if (this.filters.skylightHeightFrom !== undefined && this.filters.skylightHeightTo !== undefined) {
        // heights
        if (this.filters.skylightHeightFrom <= this.filters.skylightHeightTo) {
          heightFound = skylight.wysokosc >= this.filters.skylightHeightFrom && skylight.wysokosc <= this.filters.skylightHeightTo;
        }
        if (this.filters.skylightHeightTo < 20 && this.filters.skylightHeightFrom > 10) {
          heightFound = skylight.wysokosc >= this.filters.skylightHeightFrom;
        }
        if (this.filters.skylightHeightFrom < 10 && this.filters.skylightHeightTo > 20) {
          heightFound = skylight.wysokosc <= this.filters.skylightHeightTo;
        }
        if (this.filters.skylightHeightFrom < 10 && this.filters.skylightHeightTo < 20) {
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
        this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['iloscSprzedanychRok'], ['asc']);
        break;
      case 'priceAsc':
        this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['CenaDetaliczna'], ['asc']);
        break;
      case 'priceDesc':
        this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['CenaDetaliczna'], ['desc']);
        break;
      case 'nameAsc':
        this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['skylightName'], ['asc']);
        break;
      case 'nameDesc':
        this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['skylightName'], ['desc']);
        break;
      default:
        this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['iloscSprzedanychRok'], ['asc']);
        break;
    }
  }

  addToCart(product) {
    this.store.dispatch(new AddProductToCart(product, 1)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
  }

  getNumberInRow() {
    const containerWidth = Number(window.getComputedStyle(document.getElementsByClassName('md-container')[0]).width.slice(0, -2));
    return Math.floor(containerWidth / 300);
  }
}
