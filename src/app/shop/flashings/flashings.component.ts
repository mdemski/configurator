import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {FlashingState} from '../../store/flashing/flashing.state';
import {Observable, Subject} from 'rxjs';
import {Flashing} from '../../models/flashing';
import {CartState} from '../../store/cart/cart.state';
import {filter, takeUntil} from 'rxjs/operators';
import _ from 'lodash';
import {AddProductToCart} from '../../store/cart/cart.actions';

@Component({
  selector: 'app-flashings',
  templateUrl: './flashings.component.html',
  styleUrls: ['./flashings.component.scss']
})
export class FlashingsComponent implements OnInit, OnDestroy {
  @Select(FlashingState.flashings) flashings$: Observable<Flashing[]>;
  @Select(CartState) cart$: Observable<any>;
  private isDestroyed$ = new Subject();
  isFiltering = false;
  filters: {
    flashingName: string,
    flashingType: string[],
    flashingRoofing: string[],
    flashingCombination: string[],
    flashingMaterialType: string[],
    flashingMaterialColor: string[],
    flashingWidthFrom: number,
    flashingWidthTo: number,
    flashingHeightFrom: number,
    flashingHeightTo: number
  };
  flashingsList: Flashing[] = [];
  filteredFlashingsList: Flashing[] = [];
  searchText: string;
  page = 1;
  pageSize = 10;
  sortBy = 'popularity';
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.pageSize = this.getNumberInRow();
    this.isFiltering = true;
    this.flashings$.pipe(takeUntil(this.isDestroyed$)).subscribe(flashings => this.flashingsList = flashings);
    this.filteredFlashingsList = this.flashingsList;
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
    this.sortArray();
    this.isFiltering = false;
  }

  ngOnDestroy() {
    this.isDestroyed$.next();
  }

  filtersInput(filtersObject: any) {
    this.isFiltering = true;
    this.filters = filtersObject;
    let numberOfTypeNull = 0;
    let filteredByType: Flashing[];
    let numberOfRoofingNull = 0;
    let filteredByRoofing: Flashing[];
    let numberOfCombinationNull = 0;
    let filteredByCombination: Flashing[];
    let numberOfMaterialTypeNull = 0;
    let filteredByMaterialType: Flashing[];
    let numberOfMaterialColorNull = 0;
    let filteredByMaterialColor: Flashing[];
    this.filters.flashingType.forEach(type => {
      if (type === null) {
        numberOfTypeNull++;
      }
    });
    this.filters.flashingRoofing.forEach(roofing => {
      if (roofing === null) {
        numberOfRoofingNull++;
      }
    });
    this.filters.flashingCombination.forEach(combination => {
      if (combination === null) {
        numberOfCombinationNull++;
      }
    });
    this.filters.flashingMaterialType.forEach(materialType => {
      if (materialType === null) {
        numberOfMaterialTypeNull++;
      }
    });
    this.filters.flashingMaterialColor.forEach(materialColor => {
      if (materialColor === null) {
        numberOfMaterialColorNull++;
      }
    });
    if (numberOfTypeNull === this.filters.flashingType.length) {
      filteredByType = this.flashingsList;
    } else {
      filteredByType = this.flashingsList
        .filter(flashing => this.filters.flashingType.includes(flashing.geometria));
    }
    if (numberOfRoofingNull === this.filters.flashingRoofing.length) {
      filteredByRoofing = filteredByType;
    } else {
      filteredByRoofing = filteredByType
        .filter(flashing => {
          for (const roofingTyp of flashing.roofing) {
            this.filters.flashingRoofing.includes(roofingTyp);
          }
        });
    }
    if (numberOfCombinationNull === this.filters.flashingCombination.length) {
      filteredByCombination = filteredByRoofing;
    } else {
      filteredByCombination = filteredByRoofing
        .filter(flashing => this.filters.flashingCombination.includes(flashing.flashingCombinationCode));
    }
    if (numberOfMaterialTypeNull === this.filters.flashingMaterialType.length) {
      filteredByMaterialType = filteredByCombination;
    } else {
      filteredByMaterialType = filteredByCombination
        .filter(flashing => this.filters.flashingMaterialType.includes(flashing.oblachowanieMaterial));
    }
    if (numberOfMaterialColorNull === this.filters.flashingMaterialColor.length) {
      filteredByMaterialColor = filteredByMaterialType;
    } else {
      filteredByMaterialColor = filteredByMaterialType
        .filter(flashing => this.filters.flashingMaterialColor.includes(flashing.oblachowanieKolor));
    }
    this.filteredFlashingsList = filteredByMaterialColor.filter(flashing => {
      let nameFound = true;
      let widthFound = true;
      let heightFound = true;
      if (this.filters.flashingName) {
        nameFound = flashing.productName.toString().trim().toLowerCase().indexOf(this.filters.flashingName.toLowerCase()) !== -1;
      }
      if (this.filters.flashingWidthFrom !== undefined && this.filters.flashingWidthTo !== undefined) {
        // widths
        if (this.filters.flashingWidthFrom <= this.filters.flashingWidthTo) {
          widthFound = flashing.szerokosc >= this.filters.flashingWidthFrom && flashing.szerokosc <= this.filters.flashingWidthTo;
        }
        if (this.filters.flashingWidthTo < 20 && this.filters.flashingWidthFrom > 10) {
          widthFound = flashing.szerokosc >= this.filters.flashingWidthFrom;
        }
        if (this.filters.flashingWidthFrom < 10 && this.filters.flashingWidthTo > 20) {
          widthFound = flashing.szerokosc <= this.filters.flashingWidthTo;
        }
        if (this.filters.flashingWidthFrom < 10 && this.filters.flashingWidthTo < 20) {
          widthFound = true;
        }
      }
      if (this.filters.flashingHeightFrom !== undefined && this.filters.flashingHeightTo !== undefined) {
        // heights
        if (this.filters.flashingHeightFrom <= this.filters.flashingHeightTo) {
          heightFound = flashing.wysokosc >= this.filters.flashingHeightFrom && flashing.wysokosc <= this.filters.flashingHeightTo;
        }
        if (this.filters.flashingHeightTo < 20 && this.filters.flashingHeightFrom > 10) {
          heightFound = flashing.wysokosc >= this.filters.flashingHeightFrom;
        }
        if (this.filters.flashingHeightFrom < 10 && this.filters.flashingHeightTo > 20) {
          heightFound = flashing.wysokosc <= this.filters.flashingHeightTo;
        }
        if (this.filters.flashingHeightFrom < 10 && this.filters.flashingHeightTo < 20) {
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
        this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['iloscSprzedanychRok'], ['asc']);
        break;
      case 'priceAsc':
        this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['CenaDetaliczna'], ['asc']);
        break;
      case 'priceDesc':
        this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['CenaDetaliczna'], ['desc']);
        break;
      case 'nameAsc':
        this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['accessoryName'], ['asc']);
        break;
      case 'nameDesc':
        this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['accessoryName'], ['desc']);
        break;
      default:
        this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['iloscSprzedanychRok'], ['asc']);
        break;
    }
  }

  addToCart(product) {
    this.store.dispatch(new AddProductToCart(product, 1)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
  }
}
