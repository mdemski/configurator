import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject} from 'rxjs';
import {Select} from '@ngxs/store';
import {AccessoryState} from '../../../store/accessory/accessory.state';
import {Accessory} from '../../../models/accessory';
import {map, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-accessory-filtration',
  templateUrl: './accessory-filtration.component.html',
  styleUrls: ['./accessory-filtration.component.scss']
})
export class AccessoryFiltrationComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
              public translate: TranslateService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  private isDestroyed$ = new Subject();
  @Output() accessoryFiltersEmitter = new EventEmitter<any>();
  @Select(AccessoryState.accessories) accessories$: Observable<Accessory[]>;
  typesToChoice: string[] = [];
  kindsToChoice: string[] = [];
  materialTypesToChoice: string[] = [];
  materialColorsToChoice: string[] = [];
  biggestHeight = 0;
  biggestWidth = 0;
  smallestHeight = 999;
  smallestWidth = 999;
  filtrationForm: FormGroup;

  filterObject = {
    accessoryName: '',
    accessoryType: [],
    accessoryKind: [],
    accessoryMaterialType: [],
    accessoryMaterialColor: [],
    accessoryWidthFrom: 47,
    accessoryWidthTo: 999,
    accessoryHeightFrom: 60,
    accessoryHeightTo: 999
  };

  ngOnInit(): void {
    this.loadDataToFiltration();
    this.filtrationForm = this.fb.group({
      accessoryName: new FormControl(),
      accessoryType: this.fb.array(this.builtFormArray(this.typesToChoice)),
      accessoryKind: this.fb.array(this.builtFormArray(this.kindsToChoice)),
      accessoryMaterialType: this.fb.array(this.builtFormArray(this.materialTypesToChoice)),
      accessoryMaterialColor: this.fb.array(this.builtFormArray(this.materialColorsToChoice)),
      accessoryWidthFrom: new FormControl(),
      accessoryWidthTo: new FormControl(),
      accessoryHeightFrom: new FormControl(),
      accessoryHeightTo: new FormControl()
    });
    this.filtrationForm.valueChanges.pipe(
      map(formData => {
        this.filterObject.accessoryName = formData.accessoryName;
        formData.accessoryType.map((value, i) => {
          this.filterObject.accessoryType[i] = value ? this.typesToChoice[i] : null;
        });
        formData.accessoryKind.map((value, i) => {
          this.filterObject.accessoryKind[i] = value ? this.kindsToChoice[i] : null;
        });
        formData.accessoryMaterialType.map((value, i) => {
          this.filterObject.accessoryMaterialType[i] = value ? this.materialTypesToChoice[i] : null;
        });
        formData.accessoryMaterialColor.map((value, i) => {
          this.filterObject.accessoryMaterialColor[i] = value ? this.materialColorsToChoice[i] : null;
        });
        this.filterObject.accessoryWidthFrom = formData.accessoryWidthFrom;
        this.filterObject.accessoryWidthTo = formData.accessoryWidthTo;
        this.filterObject.accessoryHeightFrom = formData.accessoryHeightFrom;
        this.filterObject.accessoryHeightTo = formData.accessoryHeightTo;
      })
    ).subscribe((data) => {
      this.search(this.filterObject);
    });
  }

  ngOnDestroy() {
    this.isDestroyed$.next(null);
  }

  private builtFormArray(options: string[]) {
    const formControlsArray = [];
    for (const option of options) {
      formControlsArray.push(new FormControl());
    }
    return formControlsArray;
  }

  private search(filterObject: {
    accessoryWidthFrom: number; accessoryKind: any[]; accessoryHeightTo: number; accessoryType: any[]; accessoryMaterialType: any[];
    accessoryHeightFrom: number; accessoryWidthTo: number; accessoryName: string; accessoryMaterialColor: any[]
  }) {
    Object.keys(filterObject).forEach(key => filterObject[key] === null ? delete filterObject[key] : key);
    this.accessoryFiltersEmitter.emit(filterObject);
  }

  private loadDataToFiltration() {
    this.accessories$.pipe(takeUntil(this.isDestroyed$)).subscribe(accessories => {
      const typesTemp = [];
      const kindsTemp = [];
      const materialTypesTemp = [];
      const materialColorsTemp = [];
      for (const accessory of accessories) {
        typesTemp.push(accessory.typ);
        kindsTemp.push(accessory.rodzaj);
        materialTypesTemp.push(accessory.typTkaniny);
        materialTypesTemp.push(accessory.oblachowanieMaterial);
        materialColorsTemp.push(accessory.kolorTkaniny);
        materialColorsTemp.push(accessory.oblachowanieKolor);
        if (accessory.wysokosc > this.biggestHeight) {
          this.biggestHeight = accessory.wysokosc;
        }
        if (accessory.szerokosc > this.biggestWidth) {
          this.biggestWidth = accessory.szerokosc;
        }
        if (accessory.wysokosc < this.smallestHeight) {
          this.smallestHeight = accessory.wysokosc;
        }
        if (accessory.szerokosc < this.smallestWidth) {
          this.smallestWidth = accessory.szerokosc;
        }
      }
      this.typesToChoice = typesTemp.filter((value, index, self) => self.indexOf(value) === index);
      this.kindsToChoice = kindsTemp.filter((value, index, self) => self.indexOf(value) === index);
      this.materialTypesToChoice = materialTypesTemp.filter((value, index, self) => self.indexOf(value) === index);
      this.materialColorsToChoice = materialColorsTemp.filter((value, index, self) => self.indexOf(value) === index);
    });
  }
}
