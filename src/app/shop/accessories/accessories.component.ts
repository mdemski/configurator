import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AccessoryState} from '../../store/accessory/accessory.state';
import {Observable, Subject} from 'rxjs';
import {Accessory} from '../../models/accessory';
import {CartState} from '../../store/cart/cart.state';
import {filter, takeUntil} from 'rxjs/operators';
import {AddProductToCart} from '../../store/cart/cart.actions';
import _ from 'lodash';

@Component({
  selector: 'app-accessories',
  templateUrl: './accessories.component.html',
  styleUrls: ['./accessories.component.scss']
})
export class AccessoriesComponent implements OnInit, OnDestroy {
  @Select(AccessoryState.accessories) accessories$: Observable<Accessory[]>;
  @Select(CartState) cart$: Observable<any>;
  private isDestroyed$ = new Subject();
  filters: {
    accessoryName: string,
    accessoryType: string[],
    accessoryKind: string[],
    accessoryMaterialType: string[],
    accessoryMaterialColor: string[],
    accessoryWidthFrom: number,
    accessoryWidthTo: number,
    accessoryHeightFrom: number,
    accessoryHeightTo: number
  };
  accessoriesList: Accessory[] = [];
  filteredAccessoriesList: Accessory[] = [];
  searchText: string;
  isFiltering = false;
  page = 1;
  pageSize = 10;
  sortBy = 'popularity';

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.pageSize = this.getNumberInRow();
    this.isFiltering = true;
    this.accessories$.pipe(takeUntil(this.isDestroyed$)).subscribe(accessories => this.accessoriesList = accessories);
    this.filteredAccessoriesList = this.accessoriesList;
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
    this.isFiltering = false;
    this.sortArray();
  }

  ngOnDestroy() {
    this.isDestroyed$.next();
  }

  getNumberInRow() {
    const containerWidth = Number(window.getComputedStyle(document.getElementsByClassName('md-container')[0]).width.slice(0, -2));
    return Math.floor(containerWidth / 300);
  }

  filterInput(filtersObject: any) {
    this.isFiltering = true;
    this.filters = filtersObject;
    let numberOfTypeNull = 0;
    let filteredByType: Accessory[];
    let numberOfKindNull = 0;
    let filteredByKind: Accessory[];
    let numberOfMaterialTypeNull = 0;
    let filteredByMaterialType: Accessory[];
    let numberOfMaterialColorNull = 0;
    let filteredByMaterialColor: Accessory[];
    this.filters.accessoryType.forEach(type => {
      if (type === null) {
        numberOfTypeNull++;
      }
    });
    this.filters.accessoryKind.forEach(kind => {
      if (kind === null) {
        numberOfKindNull++;
      }
    });
    this.filters.accessoryMaterialType.forEach(materialType => {
      if (materialType === null) {
        numberOfMaterialTypeNull++;
      }
    });
    this.filters.accessoryMaterialColor.forEach(materialColor => {
      if (materialColor === null) {
        numberOfMaterialColorNull++;
      }
    });
    if (numberOfTypeNull === this.filters.accessoryType.length) {
      filteredByType = this.accessoriesList;
    } else {
      filteredByType = this.accessoriesList
        .filter(accessory => this.filters.accessoryType.includes(accessory.typ));
    }
    if (numberOfKindNull === this.filters.accessoryKind.length) {
      filteredByKind = filteredByType;
    } else {
      filteredByKind = filteredByType
        .filter(accessory => this.filters.accessoryKind.includes(accessory.rodzaj));
    }
    if (numberOfMaterialTypeNull === this.filters.accessoryMaterialType.length) {
      filteredByMaterialType = filteredByKind;
    } else {
      filteredByMaterialType = filteredByKind
        .filter(accessory => this.filters.accessoryMaterialType.includes(accessory.typTkaniny))
        .filter(accessory => this.filters.accessoryMaterialType.includes(accessory.oblachowanieMaterial))
        .filter(accessory => accessory.typTkaniny !== null || accessory.oblachowanieMaterial !== null);
    }
    if (numberOfMaterialColorNull === this.filters.accessoryMaterialColor.length) {
      filteredByMaterialColor = filteredByMaterialType;
    } else {
      filteredByMaterialColor = filteredByMaterialType
        .filter(accessory => this.filters.accessoryMaterialColor.includes(accessory.kolorTkaniny))
        .filter(accessory => this.filters.accessoryMaterialColor.includes(accessory.oblachowanieKolor))
        .filter(accessory => accessory.kolorTkaniny !== null || accessory.oblachowanieKolor !== null);
    }
    this.filteredAccessoriesList = filteredByMaterialColor.filter(accessory => {
      let nameFound = true;
      let widthFound = true;
      let heightFound = true;
      if (this.filters.accessoryName) {
        nameFound = accessory.productName.toString().trim().toLowerCase().indexOf(this.filters.accessoryName.toLowerCase()) !== -1;
      }
      if (this.filters.accessoryWidthFrom !== undefined && this.filters.accessoryWidthTo !== undefined) {
        // widths
        if (this.filters.accessoryWidthFrom <= this.filters.accessoryWidthTo) {
          widthFound = accessory.szerokosc >= this.filters.accessoryWidthFrom && accessory.szerokosc <= this.filters.accessoryWidthTo;
        }
        if (this.filters.accessoryWidthTo < 20 && this.filters.accessoryWidthFrom > 10) {
          widthFound = accessory.szerokosc >= this.filters.accessoryWidthFrom;
        }
        if (this.filters.accessoryWidthFrom < 10 && this.filters.accessoryWidthTo > 20) {
          widthFound = accessory.szerokosc <= this.filters.accessoryWidthTo;
        }
        if (this.filters.accessoryWidthFrom < 10 && this.filters.accessoryWidthTo < 20) {
          widthFound = true;
        }
      }
      if (this.filters.accessoryHeightFrom !== undefined && this.filters.accessoryHeightTo !== undefined) {
        // heights
        if (this.filters.accessoryHeightFrom <= this.filters.accessoryHeightTo) {
          heightFound = accessory.wysokosc >= this.filters.accessoryHeightFrom && accessory.wysokosc <= this.filters.accessoryHeightTo;
        }
        if (this.filters.accessoryHeightTo < 20 && this.filters.accessoryHeightFrom > 10) {
          heightFound = accessory.wysokosc >= this.filters.accessoryHeightFrom;
        }
        if (this.filters.accessoryHeightFrom < 10 && this.filters.accessoryHeightTo > 20) {
          heightFound = accessory.wysokosc <= this.filters.accessoryHeightTo;
        }
        if (this.filters.accessoryHeightFrom < 10 && this.filters.accessoryHeightTo < 20) {
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
        this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['iloscSprzedanychRok'], ['asc']);
        break;
      case 'priceAsc':
        this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['CenaDetaliczna'], ['asc']);
        break;
      case 'priceDesc':
        this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['CenaDetaliczna'], ['desc']);
        break;
      case 'nameAsc':
        this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['accessoryName'], ['asc']);
        break;
      case 'nameDesc':
        this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['accessoryName'], ['desc']);
        break;
      default:
        this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['iloscSprzedanychRok'], ['asc']);
        break;
    }
  }

  addToCart(product) {
    this.store.dispatch(new AddProductToCart(product, 1)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
  }

}
