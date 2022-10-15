import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MdTranslateService} from '../../../services/md-translate.service';
import {Select} from '@ngxs/store';
import {RoofWindowState} from '../../../store/roof-window/roof-window.state';
import {Observable, Subject, zip} from 'rxjs';
import {RoofWindowSkylight} from '../../../models/roof-window-skylight';
import {filter, map, takeUntil} from 'rxjs/operators';
import {SkylightState} from '../../../store/skylight/skylight.state';

@Component({
  selector: 'app-reset-filtration',
  templateUrl: './reset-filtration.component.html',
  styleUrls: ['./reset-filtration.component.scss']
})
export class ResetFiltrationComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
              private translate: MdTranslateService) {
    translate.setLanguage();
  }

  @Output() filtersEmitter = new EventEmitter<any>();
  @Select(RoofWindowState.roofWindows) roofWindows$: Observable<RoofWindowSkylight[]>;
  @Select(SkylightState.skylights) skylight$: Observable<RoofWindowSkylight[]>;
  productTypesToChoice: string[] = [];
  glassesToChoice: string[] = [];
  openingTypesToChoice: string[] = [];
  materialsToChoice: string[] = [];
  biggestHeight = 0;
  biggestWidth = 0;
  smallestHeight = 999;
  smallestWidth = 999;
  filtrationForm: FormGroup;

  filtersObject = {
    productName: '',
    productTypes: [],
    productGlazings: [],
    productOpeningTypes: [],
    productMaterials: [],
    productWidthFrom: 47,
    productWidthTo: 999,
    productHeightFrom: 60,
    productHeightTo: 999
  };
  private isDestroyed$ = new Subject();

  ngOnInit(): void {
    this.loadDataToFiltration();
    this.filtrationForm = this.fb.group({
      productName: new FormControl(),
      productTypes: this.fb.array(this.builtFormArray(this.productTypesToChoice)),
      productGlazings: this.fb.array(this.builtFormArray(this.glassesToChoice)),
      productOpeningTypes: this.fb.array(this.builtFormArray(this.openingTypesToChoice)),
      productMaterials: this.fb.array(this.builtFormArray(this.materialsToChoice)),
      productWidthFrom: new FormControl(),
      productWidthTo: new FormControl(),
      productHeightFrom: new FormControl(),
      productHeightTo: new FormControl()
    });
    this.filtrationForm.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      map(data => {
        this.filtersObject.productName = data.windowName;
        data.productTypes.map((value, i) => {
          this.filtersObject.productTypes[i] = value ? this.productTypesToChoice[i] : null;
        });
        data.productGlazings.map((value, i) => {
          this.filtersObject.productGlazings[i] = value ? this.glassesToChoice[i] : null;
        });
        data.productOpeningTypes.map((value, i) => {
          this.filtersObject.productOpeningTypes[i] = value ? this.openingTypesToChoice[i] : null;
        });
        data.windowMaterials.map((value, i) => {
          this.filtersObject.productMaterials[i] = value ? this.materialsToChoice[i] : null;
        });
        this.filtersObject.productWidthFrom = data.productWidthFrom;
        this.filtersObject.productWidthTo = data.productWidthTo;
        this.filtersObject.productHeightFrom = data.productHeightFrom;
        this.filtersObject.productHeightTo = data.productHeightTo;
      })
    ).subscribe((data) => {
      this.search(this.filtersObject);
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
  }

  private search(filtersObject: any): void {
    Object.keys(filtersObject).forEach(key => filtersObject[key] === null ? delete filtersObject[key] : key);
    this.filtersEmitter.emit(filtersObject);
  }

  private loadDataToFiltration() {
    zip(this.roofWindows$, this.skylight$)
      .pipe(takeUntil(this.isDestroyed$),
        map(data => data[0].concat(data[1])),
        map(products => products.filter(product => product.grupaAsortymentowa === 'WyłazReset' || product.grupaAsortymentowa === 'OknoDachoweReset')))
      .subscribe(products => {
      const productsTemp = [];
      const glassesTemp = [];
      const openingTemp = [];
      const materialTemp = [];
      for (const product of products) {
        if (product.pakietSzybowy.split(':')[1].toLowerCase().startsWith('e') ||
          product.pakietSzybowy.split(':')[1].toLowerCase().startsWith('v')) {
          this.translate.get('SHOP').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
            glassesTemp.push(text['doubleGlazing']);
          });
        } else {
          this.translate.get('SHOP').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
            glassesTemp.push(text['tripleGlazing']);
          });
        }
        openingTemp.push(product.otwieranie);
        materialTemp.push(product.stolarkaMaterial);
        if (product.wysokosc > this.biggestHeight) {
          this.biggestHeight = product.wysokosc;
        }
        if (product.szerokosc > this.biggestWidth) {
          this.biggestWidth = product.szerokosc;
        }
        if (product.wysokosc < this.smallestHeight) {
          this.smallestHeight = product.wysokosc;
        }
        if (product.szerokosc < this.smallestWidth) {
          this.smallestWidth = product.szerokosc;
        }
      }
      this.glassesToChoice = glassesTemp.filter((value, index, self) => self.indexOf(value) === index).filter(value => value !== null);
      this.openingTypesToChoice = openingTemp.filter((value, index, self) => self.indexOf(value) === index).filter(value => value !== null);
      this.materialsToChoice = materialTemp.filter((value, index, self) => self.indexOf(value) === index).filter(value => value !== null);
    });
  }

  private builtFormArray(options: string[]) {
    const formControlsArray = [];
    for (const option of options) {
      formControlsArray.push(new FormControl());
    }
    return formControlsArray;
  }
}
