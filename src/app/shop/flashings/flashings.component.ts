import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {FlashingState} from '../../store/flashing/flashing.state';
import {Observable, Subject} from 'rxjs';
import {Flashing} from '../../models/flashing';
import {CartState} from '../../store/cart/cart.state';
import {filter, map, takeUntil} from 'rxjs/operators';
import _ from 'lodash';
import {AddProductToCart} from '../../store/cart/cart.actions';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

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
  pageTableSize = 20;
  quantityForm: FormGroup;
  filtrationForm: FormGroup;
  nameToggler = true;
  typeToggler = true;
  apronTypeToggler = true;
  combinationToggler = true;
  widthToggler = true;
  heightToggler = true;
  colorToggler = true;
  priceToggler = true;
  sortBy = 'popularity';
  sortTableBy = 'popularityInTable';
  cardPresentation = true;
  filterObject = {
    name: '',
    type: '',
    apronType: '',
    combination: '',
    width: '',
    height: '',
    color: '',
    price: ''
  };

  constructor(private store: Store, public router: Router, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.pageSize = this.getNumberInRow();
    this.isFiltering = true;
    this.flashings$.pipe(takeUntil(this.isDestroyed$)).subscribe(flashings => this.flashingsList = flashings);
    this.filteredFlashingsList = this.flashingsList;
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
    this.quantityForm = new FormGroup({});
    this.filtrationForm = this.fb.group({
      name: new FormControl(),
      type: new FormControl(),
      apronType: new FormControl(),
      combination: new FormControl(),
      width: new FormControl(),
      height: new FormControl(),
      color: new FormControl(),
      price: new FormControl()
    });
    this.filtrationForm.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      map(data => {
        this.filterObject.name = data.name;
        this.filterObject.type = data.type;
        this.filterObject.apronType = data.apronType;
        this.filterObject.combination = data.combination;
        this.filterObject.width = data.width;
        this.filterObject.height = data.height;
        this.filterObject.color = data.color;
        this.filterObject.price = data.price;
      })).subscribe(() => this.filterTable(this.filterObject));
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
        .filter(flashing => flashing.roofing.filter(roofing => this.filters.flashingRoofing.includes(roofing)));
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
        this.filters.flashingName = '';
        this.filters.flashingRoofing = [];
        this.filters.flashingType = [];
        this.filters.flashingMaterialType = [];
        this.filters.flashingMaterialColor = [];
        this.filters.flashingCombination = [];
        this.filters.flashingWidthFrom = 0;
        this.filters.flashingWidthTo = 999;
        this.filters.flashingHeightFrom = 0;
        this.filters.flashingHeightTo = 999;
        this.filtersInput(this.filters);
      }
    }
  }

  private loadQuantityData() {
    this.filteredFlashingsList.forEach((flashing, index) => {
      this.quantityForm.addControl('quantity' + index, new FormControl(1));
    });
  }

  getTableRows() {
    return 20;
  }

  sortByName() {
    this.nameToggler = !this.nameToggler;
    const product = this.nameToggler ? 'asc' : 'desc';
    this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['productName'], product);
  }

  sortByType() {
    this.typeToggler = !this.typeToggler;
    const product = this.typeToggler ? 'asc' : 'desc';
    this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['typKolnierza'], product);
  }

  sortByApronType() {
    this.apronTypeToggler = !this.apronTypeToggler;
    const product = this.apronTypeToggler ? 'asc' : 'desc';
    this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['typFartucha'], product);
  }

  sortByCombination() {
    this.combinationToggler = !this.combinationToggler;
    const product = this.combinationToggler ? 'asc' : 'desc';
    this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['flashingCombination'], product);
  }

  sortByWidth() {
    this.widthToggler = !this.widthToggler;
    const product = this.widthToggler ? 'asc' : 'desc';
    this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['szerokosc'], product);
  }

  sortByHeight() {
    this.heightToggler = !this.heightToggler;
    const product = this.heightToggler ? 'asc' : 'desc';
    this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['wysokosc'], product);
  }

  sortByColor() {
    this.colorToggler = !this.colorToggler;
    const product = this.colorToggler ? 'asc' : 'desc';
    this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['oblachowanieKolor'], product);
  }

  sortByPrice() {
    this.priceToggler = !this.priceToggler;
    const product = this.priceToggler ? 'asc' : 'desc';
    this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['CenaDetaliczna'], product);
  }

  sortTableArray() {
    switch (this.sortTableBy) {
      case 'popularityInTable':
        this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['iloscSprzedanychRok'], ['asc']);
        break;
      case 'priceAscInTable':
        this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['CenaDetaliczna'], ['asc']);
        break;
      case 'priceDescInTable':
        this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['CenaDetaliczna'], ['desc']);
        break;
      case 'nameAscInTable':
        this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['productName'], ['asc']);
        break;
      case 'nameDescInTable':
        this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['productName'], ['desc']);
        break;
      default:
        this.filteredFlashingsList = _.orderBy(this.filteredFlashingsList, ['iloscSprzedanychRok'], ['asc']);
        break;
    }
  }

  private filterTable(filterObject: { color: string; price: string; name: string; width: string; apronType: string; type: string; combination: string; height: string }) {
    this.isFiltering = true;
    this.filteredFlashingsList = this.flashingsList;
    this.filteredFlashingsList = this.filteredFlashingsList.filter(flashing => {
      let nameFound = true;
      let typeFound = true;
      let apronTypFound = true;
      let combinationFound = true;
      let widthFound = true;
      let heightFound = true;
      let colorFound = true;
      let priceFound = true;
      if (filterObject.name) {
        nameFound = flashing.productName.toString().trim().toLowerCase().indexOf(filterObject.name.toLowerCase()) !== -1;
      }
      if (filterObject.type) {
        typeFound = flashing.typKolnierza.toString().trim().toLowerCase().indexOf(filterObject.type.toLowerCase()) !== -1;
      }
      if (filterObject.apronType) {
        apronTypFound = flashing.typFartucha.toString().trim().toLowerCase().indexOf(filterObject.apronType.toLowerCase()) !== -1;
      }
      if (filterObject.combination) {
        combinationFound = flashing.flashingCombination.toString().trim().toLowerCase().indexOf(filterObject.combination.toLowerCase()) !== -1;
      }
      if (filterObject.width) {
        widthFound = flashing.szerokosc.toString().trim().toLowerCase().indexOf(filterObject.width.toLowerCase()) !== -1;
      }
      if (filterObject.height) {
        heightFound = flashing.wysokosc.toString().trim().toLowerCase().indexOf(filterObject.height.toLowerCase()) !== -1;
      }
      if (filterObject.color) {
        colorFound = flashing.oblachowanieKolor.toString().trim().toLowerCase().indexOf(filterObject.color.toLowerCase()) !== -1;
      }
      if (filterObject.price) {
        priceFound = flashing.CenaDetaliczna.toString().trim().toLowerCase().indexOf(filterObject.price.toLowerCase()) !== -1;
      }
      return nameFound && typeFound && apronTypFound && combinationFound && widthFound && heightFound && colorFound && priceFound;
    });
    this.isFiltering = false;
  }
}
