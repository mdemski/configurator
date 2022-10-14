import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AccessoryState} from '../../store/accessory/accessory.state';
import {Observable, Subject} from 'rxjs';
import {Accessory} from '../../models/accessory';
import {CartState} from '../../store/cart/cart.state';
import {filter, map, takeUntil} from 'rxjs/operators';
import {AddProductToCart} from '../../store/cart/cart.actions';
import _ from 'lodash';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

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
    accessoryFrameMatching: string[],
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
  pageTableSize = 20;
  quantityForm: FormGroup;
  filtrationForm: FormGroup;
  nameToggler = true;
  typeToggler = true;
  colorToggler = true;
  widthToggler = true;
  heightToggler = true;
  materialToggler = true;
  frameMatchingToggler = true;
  priceToggler = true;
  sortBy = 'popularity';
  sortTableBy = 'popularityInTable';
  cardPresentation = true;
  filterObject = {
    name: '',
    type: '',
    color: '',
    width: '',
    height: '',
    material: '',
    frameMatching: '',
    price: ''
  };

  constructor(private store: Store, public router: Router, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.pageSize = this.getNumberInRow();
    this.isFiltering = true;
    this.accessories$.pipe(takeUntil(this.isDestroyed$)).subscribe(accessories => this.accessoriesList = accessories);
    this.filteredAccessoriesList = this.accessoriesList;
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
    this.quantityForm = new FormGroup({});
    this.filtrationForm = this.fb.group({
      name: new FormControl(),
      type: new FormControl(),
      color: new FormControl(),
      width: new FormControl(),
      height: new FormControl(),
      material: new FormControl(),
      frameMatching: new FormControl(),
      price: new FormControl()
    });
    this.filtrationForm.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      map(data => {
        this.filterObject.name = data.name;
        this.filterObject.type = data.type;
        this.filterObject.color = data.color;
        this.filterObject.width = data.width;
        this.filterObject.height = data.height;
        this.filterObject.material = data.material;
        this.filterObject.frameMatching = data.frameMatching;
        this.filterObject.price = data.price;
      })).subscribe(() => this.filterTable(this.filterObject));
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
    let numberOfMaterialMatchingNull = 0;
    let filteredByFrameMatching: Accessory[];
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
    this.filters.accessoryFrameMatching.forEach(materialMatching => {
      if (materialMatching === null) {
        numberOfMaterialMatchingNull++;
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
    if (numberOfMaterialMatchingNull === this.filters.accessoryFrameMatching.length) {
      filteredByFrameMatching = filteredByMaterialType;
    } else {
      filteredByFrameMatching = filteredByMaterialType
        .filter(accessory => this.filters.accessoryFrameMatching.includes(accessory.frameMarching));
    }
    if (numberOfMaterialColorNull === this.filters.accessoryMaterialColor.length) {
      filteredByMaterialColor = filteredByFrameMatching;
    } else {
      filteredByMaterialColor = filteredByFrameMatching
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
        this.filters.accessoryName = '';
        this.filters.accessoryType = [];
        this.filters.accessoryKind = [];
        this.filters.accessoryMaterialType = [];
        this.filters.accessoryFrameMatching = [];
        this.filters.accessoryMaterialColor = [];
        this.filters.accessoryWidthFrom = 0;
        this.filters.accessoryWidthTo = 999;
        this.filters.accessoryHeightFrom = 0;
        this.filters.accessoryHeightTo = 999;
        this.filterInput(this.filters);
      }
    }
  }

  private loadQuantityData() {
    this.filteredAccessoriesList.forEach((accessory, index) => {
      this.quantityForm.addControl('quantity' + index, new FormControl(1));
    });
  }

  getTableRows() {
    return 20;
  }

  sortByName() {
    this.nameToggler = !this.nameToggler;
    const product = this.nameToggler ? 'asc' : 'desc';
    this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['productName'], product);
  }

  sortByType() {
    this.typeToggler = !this.typeToggler;
    const product = this.typeToggler ? 'asc' : 'desc';
    this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['typ'], product);
  }

  sortByColor() {
    this.colorToggler = !this.colorToggler;
    const product = this.colorToggler ? 'asc' : 'desc';
    this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['kolorTkaniny'], product);
  }

  sortByWidth() {
    this.widthToggler = !this.widthToggler;
    const product = this.widthToggler ? 'asc' : 'desc';
    this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['szerokosc'], product);
  }

  sortByHeight() {
    this.heightToggler = !this.heightToggler;
    const product = this.heightToggler ? 'asc' : 'desc';
    this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['wysokosc'], product);
  }

  sortByMaterial() {
    this.materialToggler = !this.materialToggler;
    const product = this.materialToggler ? 'asc' : 'desc';
    this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['typTkaniny'], product);
  }

  sortByFrameMatching() {
    this.materialToggler = !this.materialToggler;
    const product = this.materialToggler ? 'asc' : 'desc';
    this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['typTkaniny'], product);
  }

  sortByPrice() {
    this.priceToggler = !this.priceToggler;
    const product = this.priceToggler ? 'asc' : 'desc';
    this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['CenaDetaliczna'], product);
  }

  sortTableArray() {
    switch (this.sortTableBy) {
      case 'popularityInTable':
        this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['iloscSprzedanychRok'], ['asc']);
        break;
      case 'priceAscInTable':
        this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['CenaDetaliczna'], ['asc']);
        break;
      case 'priceDescInTable':
        this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['CenaDetaliczna'], ['desc']);
        break;
      case 'nameAscInTable':
        this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['productName'], ['asc']);
        break;
      case 'nameDescInTable':
        this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['productName'], ['desc']);
        break;
      default:
        this.filteredAccessoriesList = _.orderBy(this.filteredAccessoriesList, ['iloscSprzedanychRok'], ['asc']);
        break;
    }
  }

  private filterTable(filterObject: { frameMatching: string; color: string; material: string; price: string; name: string; width: string; type: string; height: string }) {
    this.isFiltering = true;
    this.filteredAccessoriesList = this.accessoriesList;
    this.filteredAccessoriesList = this.filteredAccessoriesList.filter(accessory => {
      let nameFound = true;
      let typeFound = true;
      let colorFound = true;
      let widthFound = true;
      let heightFound = true;
      let materialFound = true;
      let frameMatchingFound = true;
      let priceFound = true;
      if (filterObject.name) {
        nameFound = accessory.productName.toString().trim().toLowerCase().indexOf(filterObject.name.toLowerCase()) !== -1;
      }
      if (filterObject.type) {
        typeFound = accessory.typ.toString().trim().toLowerCase().indexOf(filterObject.type.toLowerCase()) !== -1;
      }
      if (filterObject.width) {
        widthFound = accessory.szerokosc.toString().trim().toLowerCase().indexOf(filterObject.width.toLowerCase()) !== -1;
      }
      if (filterObject.height) {
        heightFound = accessory.wysokosc.toString().trim().toLowerCase().indexOf(filterObject.height.toLowerCase()) !== -1;
      }
      if (filterObject.material) {
        materialFound = accessory.typTkaniny.toString().trim().toLowerCase().indexOf(filterObject.material.toLowerCase()) !== -1;
      }
      if (filterObject.color) {
        colorFound = accessory.kolorTkaniny.toString().trim().toLowerCase().indexOf(filterObject.color.toLowerCase()) !== -1;
      }
      if (filterObject.frameMatching) {
        if (accessory.dopasowanieRoletySzerokosc === null && accessory.dopasowanieRoletyDlugosc !== null) {
          frameMatchingFound = accessory.dopasowanieRoletyDlugosc.toString().trim().toLowerCase().indexOf(filterObject.frameMatching.toLowerCase()) !== -1;
        }
        if (accessory.dopasowanieRoletyDlugosc === null && accessory.dopasowanieRoletySzerokosc !== null) {
          frameMatchingFound = accessory.dopasowanieRoletySzerokosc.toString().trim().toLowerCase().indexOf(filterObject.frameMatching.toLowerCase()) !== -1
        }
        if (accessory.dopasowanieRoletyDlugosc !== null && accessory.dopasowanieRoletySzerokosc !== null) {
          frameMatchingFound = accessory.dopasowanieRoletySzerokosc.toString().trim().toLowerCase().indexOf(filterObject.frameMatching.toLowerCase()) !== -1 ||
            accessory.dopasowanieRoletyDlugosc.toString().trim().toLowerCase().indexOf(filterObject.frameMatching.toLowerCase()) !== -1;
        }
        if (accessory.dopasowanieRoletyDlugosc === null && accessory.dopasowanieRoletySzerokosc === null) {
          frameMatchingFound = true;
        }
      }
      if (filterObject.price) {
        priceFound = accessory.CenaDetaliczna.toString().trim().toLowerCase().indexOf(filterObject.price.toLowerCase()) !== -1;
      }
      return nameFound && typeFound && colorFound && widthFound && heightFound && materialFound && frameMatchingFound && priceFound;
    });
    this.isFiltering = false;
  }
}
