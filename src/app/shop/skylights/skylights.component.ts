import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {Select, Store} from '@ngxs/store';
import {SkylightState} from '../../store/skylight/skylight.state';
import {CartState} from '../../store/cart/cart.state';
import {filter, map, takeUntil} from 'rxjs/operators';
import {AddProductToCart} from '../../store/cart/cart.actions';
import _ from 'lodash';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

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

  constructor(private store: Store, public router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.pageSize = this.getNumberInRow();
    this.isFiltering = true;
    this.skylights$.pipe(takeUntil(this.isDestroyed$)).subscribe(skylights => this.skylights = skylights);
    this.filteredSkylightList = this.skylights;
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
        this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['productName'], ['asc']);
        break;
      case 'nameDesc':
        this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['productName'], ['desc']);
        break;
      default:
        this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['iloscSprzedanychRok'], ['asc']);
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
        this.filters.skylightName = '';
        this.filters.skylightGlazings = [];
        this.filters.skylightOpeningTypes = [];
        this.filters.skylightMaterials = [];
        this.filters.skylightWidthFrom = 0;
        this.filters.skylightWidthTo = 999;
        this.filters.skylightHeightFrom = 0;
        this.filters.skylightHeightTo = 999;
        this.filtersInput(this.filters);
      }
    }
  }

  private loadQuantityData() {
    this.filteredSkylightList.forEach((skylight, index) => {
      this.quantityForm.addControl('quantity' + index, new FormControl(1));
    });
  }

  getTableRows() {
    return 20;
  }

  sortByName() {
    this.nameToggler = !this.nameToggler;
    const product = this.nameToggler ? 'asc' : 'desc';
    this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['productName'], product);
  }

  sortByType() {
    this.typeToggler = !this.typeToggler;
    const product = this.typeToggler ? 'asc' : 'desc';
    this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['typ'], product);
  }

  sortByGlazing() {
    this.glazingToggler = !this.glazingToggler;
    const product = this.glazingToggler ? 'asc' : 'desc';
    this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['pakietSzybowy'], product);
  }

  sortByOpening() {
    this.openingToggler = !this.openingToggler;
    const product = this.openingToggler ? 'asc' : 'desc';
    this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['otwieranie'], product);
  }

  sortByMaterial() {
    this.materialToggler = !this.materialToggler;
    const product = this.materialToggler ? 'asc' : 'desc';
    this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['stolarkaMaterial'], product);
  }

  sortByWidth() {
    this.widthToggler = !this.widthToggler;
    const product = this.widthToggler ? 'asc' : 'desc';
    this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['szerokosc'], product);
  }

  sortByHeight() {
    this.heightToggler = !this.heightToggler;
    const product = this.heightToggler ? 'asc' : 'desc';
    this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['wysokosc'], product);
  }

  sortByPrice() {
    this.priceToggler = !this.priceToggler;
    const product = this.priceToggler ? 'asc' : 'desc';
    this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['CenaDetaliczna'], product);
  }

  sortTableArray() {
    switch (this.sortTableBy) {
      case 'popularityInTable':
        this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['iloscSprzedanychRok'], ['asc']);
        break;
      case 'priceAscInTable':
        this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['CenaDetaliczna'], ['asc']);
        break;
      case 'priceDescInTable':
        this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['CenaDetaliczna'], ['desc']);
        break;
      case 'nameAscInTable':
        this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['productName'], ['asc']);
        break;
      case 'nameDescInTable':
        this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['productName'], ['desc']);
        break;
      default:
        this.filteredSkylightList = _.orderBy(this.filteredSkylightList, ['iloscSprzedanychRok'], ['asc']);
        break;
    }
  }

  private filterTable(filterObject: { material: string; price: string; name: string; width: string; glazing: string; type: string; opening: string; height: string }) {
    this.isFiltering = true;
    this.filteredSkylightList = this.skylights;
    this.filteredSkylightList = this.filteredSkylightList.filter(skylight => {
      let nameFound = true;
      let typeFound = true;
      let glazingFound = true;
      let openingFound = true;
      let materialFound = true;
      let widthFound = true;
      let heightFound = true;
      let priceFound = true;
      if (filterObject.name) {
        nameFound = skylight.productName.toString().trim().toLowerCase().indexOf(filterObject.name.toLowerCase()) !== -1;
      }
      if (filterObject.type) {
        typeFound = skylight.typ.toString().trim().toLowerCase().indexOf(filterObject.type.toLowerCase()) !== -1;
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
        glazingFound = skylight.pakietSzybowy.toString().trim().toLowerCase().indexOf(searchGlazingValue.toLowerCase()) !== -1;
      }
      if (filterObject.opening) {
        openingFound = skylight.otwieranie.toString().trim().toLowerCase().indexOf(filterObject.opening.toLowerCase()) !== -1;
      }
      if (filterObject.material) {
        materialFound = skylight.stolarkaMaterial.toString().trim().toLowerCase().indexOf(filterObject.material.toLowerCase()) !== -1;
      }
      if (filterObject.width) {
        widthFound = skylight.szerokosc.toString().trim().toLowerCase().indexOf(filterObject.width.toLowerCase()) !== -1;
      }
      if (filterObject.height) {
        heightFound = skylight.wysokosc.toString().trim().toLowerCase().indexOf(filterObject.height.toLowerCase()) !== -1;
      }
      if (filterObject.price) {
        priceFound = skylight.CenaDetaliczna.toString().trim().toLowerCase().indexOf(filterObject.price.toLowerCase()) !== -1;
      }
      return nameFound && typeFound && glazingFound && openingFound && materialFound && widthFound && heightFound && priceFound;
    });
    this.isFiltering = false;
  }
}
