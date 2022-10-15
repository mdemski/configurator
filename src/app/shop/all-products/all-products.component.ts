import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {CartState} from '../../store/cart/cart.state';
import {merge, Observable, Subject} from 'rxjs';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {filter, map, takeUntil} from 'rxjs/operators';
import {SkylightState} from '../../store/skylight/skylight.state';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {RoofWindowState} from '../../store/roof-window/roof-window.state';
import {FlatRoofWindowState} from '../../store/flat-roof-window/flat-roof-window.state';
import {AccessoryState} from '../../store/accessory/accessory.state';
import {AddProductToCart} from '../../store/cart/cart.actions';
import _ from 'lodash';
import {GeneralDataService} from '../../services/general-data.service';
import {FlashingState} from '../../store/flashing/flashing.state';
import {Flashing} from '../../models/flashing';
import {Accessory} from '../../models/accessory';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit, OnDestroy {

  isFiltering = false;
  @Select(SkylightState.skylights) skylights$: Observable<RoofWindowSkylight[]>;
  @Select(RoofWindowState.roofWindows) roofWindows$: Observable<RoofWindowSkylight[]>;
  @Select(FlashingState.flashings) flashings$: Observable<Flashing[]>;
  @Select(FlatRoofWindowState.flats) flats$: Observable<RoofWindowSkylight[]>;
  @Select(AccessoryState.accessories) accessories$: Observable<Accessory[]>;
  @Select(CartState) cart$: Observable<any>;
  products$: Observable<any[]>;
  productList: any[] = [];
  filteredProductList: any[] = [];
  isDestroyed$ = new Subject();
  page = 1;
  pageTableSize = 20;
  quantityForm: FormGroup;
  filtrationForm: FormGroup;
  nameToggler = true;
  typeToggler = true;
  glazingToggler = true;
  openingToggler = true;
  materialToggler = true;
  colorToggler = true;
  widthToggler = true;
  heightToggler = true;
  priceToggler = true;
  sortTableBy = 'popularityInTable';
  filterObject = {
    name: '',
    type: '',
    glazing: '',
    opening: '',
    material: '',
    color: '',
    width: '',
    height: '',
    price: ''
  };
  paginate: any;

  constructor(private store: Store, public router: Router, private fb: FormBuilder, public generalData: GeneralDataService) {

  }

  ngOnInit(): void {
    this.pageTableSize = this.getTableRows();
    this.isFiltering = true;
    this.products$ = merge(
      this.roofWindows$,
      this.flashings$,
      this.skylights$,
      this.flats$,
      this.accessories$,
    );
    this.products$.pipe(takeUntil(this.isDestroyed$)).subscribe(results => {
      for (const products of results) {
        this.productList.push(products);
      }
    });
    this.filteredProductList = this.productList;
    this.setIds(this.filteredProductList);
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
    this.quantityForm = new FormGroup({});
    this.loadQuantityData();
    this.filtrationForm = this.fb.group({
      name: new FormControl(),
      type: new FormControl(),
      glazing: new FormControl(),
      opening: new FormControl(),
      material: new FormControl(),
      color: new FormControl(),
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
        this.filterObject.color = data.color;
        this.filterObject.width = data.width;
        this.filterObject.height = data.height;
        this.filterObject.price = data.price;
      })).subscribe(() => this.filterTable(this.filterObject));
    this.isFiltering = false;
    this.sortTableArray();
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
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

  private loadQuantityData() {
    this.filteredProductList.forEach((product, index) => {
      this.quantityForm.addControl('quantity' + index, new FormControl(1));
    });
  }

  getTableRows() {
    return 20;
  }

  sortByName() {
    this.nameToggler = !this.nameToggler;
    const product = this.nameToggler ? 'asc' : 'desc';
    this.filteredProductList = _.orderBy(this.filteredProductList, ['product.productName'], product);
  }

  sortByType() {
    this.typeToggler = !this.typeToggler;
    const product = this.typeToggler ? 'asc' : 'desc';
    this.filteredProductList = _.orderBy(this.filteredProductList, ['product.grupaAsortymentowa'], product);
  }

  sortByGlazing() {
    this.glazingToggler = !this.glazingToggler;
    const product = this.glazingToggler ? 'asc' : 'desc';
    this.filteredProductList = _.orderBy(this.filteredProductList, ['product.pakietSzybowy'], product);
  }

  sortByOpening() {
    this.openingToggler = !this.openingToggler;
    const product = this.openingToggler ? 'asc' : 'desc';
    this.filteredProductList = _.orderBy(this.filteredProductList, ['product.otwieranie'], product);
  }

  sortByMaterial() {
    this.materialToggler = !this.materialToggler;
    const product = this.materialToggler ? 'asc' : 'desc';
    this.filteredProductList = _.orderBy(this.filteredProductList, ['product.stolarkaMaterial'], product);
    this.filteredProductList = _.orderBy(this.filteredProductList, ['product.oblachowanieMaterial'], product);
    this.filteredProductList = _.orderBy(this.filteredProductList, ['product.typTkaniny'], product);
  }

  sortByColor() {
    this.colorToggler = !this.colorToggler;
    const product = this.colorToggler ? 'asc' : 'desc';
    this.filteredProductList = _.orderBy(this.filteredProductList, ['product.stolarkaKolor'], product);
    this.filteredProductList = _.orderBy(this.filteredProductList, ['product.oblachowanieKolor'], product);
    this.filteredProductList = _.orderBy(this.filteredProductList, ['product.kolorTkaniny'], product);
  }

  sortByWidth() {
    this.widthToggler = !this.widthToggler;
    const product = this.widthToggler ? 'asc' : 'desc';
    this.filteredProductList = _.orderBy(this.filteredProductList, ['product.szerokosc'], product);
  }

  sortByHeight() {
    this.heightToggler = !this.heightToggler;
    const product = this.heightToggler ? 'asc' : 'desc';
    this.filteredProductList = _.orderBy(this.filteredProductList, ['product.wysokosc'], product);
  }

  sortByPrice() {
    this.priceToggler = !this.priceToggler;
    const product = this.priceToggler ? 'asc' : 'desc';
    this.filteredProductList = _.orderBy(this.filteredProductList, ['product.CenaDetaliczna'], product);
  }

  sortTableArray() {
    switch (this.sortTableBy) {
      case 'popularityInTable':
        this.filteredProductList = _.orderBy(this.filteredProductList, ['product.iloscSprzedanychRok'], ['asc']);
        break;
      case 'priceAscInTable':
        this.filteredProductList = _.orderBy(this.filteredProductList, ['product.CenaDetaliczna'], ['asc']);
        break;
      case 'priceDescInTable':
        this.filteredProductList = _.orderBy(this.filteredProductList, ['product.CenaDetaliczna'], ['desc']);
        break;
      case 'nameAscInTable':
        this.filteredProductList = _.orderBy(this.filteredProductList, ['product.productName'], ['asc']);
        break;
      case 'nameDescInTable':
        this.filteredProductList = _.orderBy(this.filteredProductList, ['product.productName'], ['desc']);
        break;
      default:
        this.filteredProductList = _.orderBy(this.filteredProductList, ['product.iloscSprzedanychRok'], ['asc']);
        break;
    }
  }

  private filterTable(filterObject: { material: string; color: string; price: string; name: string; width: string; glazing: string; type: string; opening: string; height: string }) {
    this.isFiltering = true;
    this.filteredProductList = this.productList;
    this.setIds(this.filteredProductList);
    this.filteredProductList = this.filteredProductList.filter(data => {
      const product = data.product;
      let nameFound = true;
      let typeFound = true;
      let glazingFound = true;
      let openingFound = true;
      let materialFound = true;
      let colorFound = true;
      let widthFound = true;
      let heightFound = true;
      let priceFound = true;
      if (filterObject.name) {
        nameFound = product.productName.toString().trim().toLowerCase().indexOf(filterObject.name.toLowerCase()) !== -1;
      }
      if (filterObject.type) {
        typeFound = product.grupaAsortymentowa.toString().trim().toLowerCase().indexOf(filterObject.type.toLowerCase()) !== -1;
      }
      if (filterObject.glazing !== '') {
        if (!product.pakietSzybowy) {
          glazingFound = false;
        }
      }
      if (filterObject.glazing && product.pakietSzybowy) {
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
      if (filterObject.opening !== '') {
        if (!product.otwieranie) {
          openingFound = false;
        }
      }
      if (filterObject.opening && product.otwieranie) {
        openingFound = product.otwieranie.toString().trim().toLowerCase().indexOf(filterObject.opening.toLowerCase()) !== -1;
      }
      if (filterObject.material) {
        if (this.generalData.getProductConfig(product) === 'standardType') {
          materialFound = product.stolarkaMaterial.toString().trim().toLowerCase().indexOf(filterObject.material.toLowerCase()) !== -1;
        }
        if (this.generalData.getProductConfig(product) === 'aluminiumType') {
          materialFound = product.oblachowanieMaterial.toString().trim().toLowerCase().indexOf(filterObject.material.toLowerCase()) !== -1;
        }
        if (this.generalData.getProductConfig(product) === 'accessoryType') {
          if (product.typTkaniny === undefined || product.typTkaniny === null) {
            materialFound = false;
          } else {
            materialFound = product.typTkaniny.toString().trim().toLowerCase().indexOf(filterObject.material.toLowerCase()) !== -1;
          }
        }
        if (product.grupaAsortymentowa === '' || product.grupaAsortymentowa === null || product.grupaAsortymentowa === undefined) {
          materialFound = true;
        }
      }
      if (filterObject.color) {
        if (this.generalData.getProductConfig(product) === 'standardType') {
          colorFound = product.stolarkaKolor.toString().trim().toLowerCase().indexOf(filterObject.color.toLowerCase()) !== -1;
        }
        if (this.generalData.getProductConfig(product) === 'aluminiumType') {
          colorFound = product.oblachowanieKolor.toString().trim().toLowerCase().indexOf(filterObject.color.toLowerCase()) !== -1;
        }
        if (this.generalData.getProductConfig(product) === 'accessoryType') {
          if (product.kolorTkaniny === undefined || product.kolorTkaniny === null) {
            colorFound = false;
          } else {
            colorFound = product.kolorTkaniny.toString().trim().toLowerCase().indexOf(filterObject.color.toLowerCase()) !== -1;
          }
        }
        if (product.grupaAsortymentowa === '' || product.grupaAsortymentowa === null || product.grupaAsortymentowa === undefined) {
          colorFound = true;
        }
      }
      if (filterObject.width) {
        if (product.szerokosc === undefined || product.szerokosc === null || product.wysokosc === '') {
          widthFound = true;
        } else {
          widthFound = product.szerokosc.toString().trim().toLowerCase().indexOf(filterObject.width.toLowerCase()) !== -1;
        }
      }
      if (filterObject.height) {
        if (product.wysokosc === undefined || product.wysokosc === null || product.wysokosc === '') {
          heightFound = true;
        } else {
          heightFound = product.wysokosc.toString().trim().toLowerCase().indexOf(filterObject.height.toLowerCase()) !== -1;
        }
      }
      if (filterObject.price) {
        priceFound = product.CenaDetaliczna.toString().trim().toLowerCase().indexOf(filterObject.price.toLowerCase()) !== -1;
      }
      if (this.filterObject.name === '' || this.filterObject.name === null) {
        nameFound = true;
      }
      if (this.filterObject.type === '' || this.filterObject.type === null) {
        typeFound = true;
      }
      if (this.filterObject.glazing === '' || this.filterObject.glazing === null) {
        glazingFound = true;
      }
      if (this.filterObject.opening === '' || this.filterObject.opening === null) {
        openingFound = true;
      }
      if (this.filterObject.material === '' || this.filterObject.material === null) {
        materialFound = true;
      }
      if (this.filterObject.color === '' || this.filterObject.color === null) {
        colorFound = true;
      }
      if (this.filterObject.width === '' || this.filterObject.width === null) {
        widthFound = true;
      }
      if (this.filterObject.height === '' || this.filterObject.height === null) {
        heightFound = true;
      }
      if (this.filterObject.price === '' || this.filterObject.price === null) {
        priceFound = true;
      }
      return nameFound && typeFound && glazingFound && openingFound && materialFound && colorFound && widthFound && heightFound && priceFound;
    });
    this.isFiltering = false;
  }

  private setIds(filteredProductList: any[]) {
    const tempArray = [];
    filteredProductList.forEach((product, index) => {
      tempArray.push({product, id: index});
    });
    this.filteredProductList = [];
    this.filteredProductList = tempArray;
  }
}

