import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject} from 'rxjs';
import {Select} from '@ngxs/store';
import {FlashingState} from '../../../store/flashing/flashing.state';
import {Flashing} from '../../../models/flashing';
import {map, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-flashing-filtration',
  templateUrl: './flashing-filtration.component.html',
  styleUrls: ['./flashing-filtration.component.scss']
})
export class FlashingFiltrationComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
              public translate: TranslateService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  private isDestroyed$ = new Subject();
  @Output() filtersEmitter = new EventEmitter<any>();
  @Select(FlashingState.flashings) flashings$: Observable<Flashing[]>;
  typesToChoice: string[] = [];
  roofingToChoice: string[] = [];
  combinationsToChoice: string[] = [];
  materialTypesToChoice: string[] = [];
  materialColorsToChoice: string[] = [];
  biggestHeight = 0;
  biggestWidth = 0;
  smallestHeight = 999;
  smallestWidth = 999;
  filtrationForm: FormGroup;

  filterObject = {
    flashingName: '',
    flashingType: [],
    flashingRoofing: [],
    flashingCombination: [],
    flashingMaterialType: [],
    flashingMaterialColor: [],
    flashingWidthFrom: 47,
    flashingWidthTo: 999,
    flashingHeightFrom: 60,
    flashingHeightTo: 999
  };

  ngOnInit(): void {
    this.loadDataToFiltration();
    this.filtrationForm = this.fb.group({
      flashingName: new FormControl(),
      flashingType: this.fb.array(this.builtFormArray(this.typesToChoice)),
      flashingRoofing: this.fb.array(this.builtFormArray(this.roofingToChoice)),
      flashingCombination: this.fb.array(this.builtFormArray(this.combinationsToChoice)),
      flashingMaterialType: this.fb.array(this.builtFormArray(this.materialTypesToChoice)),
      flashingMaterialColor: this.fb.array(this.builtFormArray(this.materialColorsToChoice)),
      flashingWidthFrom: new FormControl(),
      flashingWidthTo: new FormControl(),
      flashingHeightFrom: new FormControl(),
      flashingHeightTo: new FormControl()
    });
    this.filtrationForm.valueChanges.pipe(
      map(formData => {
        this.filterObject.flashingName = formData.flashingName;
        formData.flashingType.map((value, i) => {
          this.filterObject.flashingType[i] = value ? this.typesToChoice[i] : null;
        });
        formData.flashingRoofing.map((value, i) => {
          this.filterObject.flashingRoofing[i] = value ? this.roofingToChoice[i] : null;
        });
        formData.flashingCombination.map((value, i) => {
          this.filterObject.flashingCombination[i] = value ? this.combinationsToChoice[i] : null;
        });
        formData.flashingMaterialType.map((value, i) => {
          this.filterObject.flashingMaterialType[i] = value ? this.materialTypesToChoice[i] : null;
        });
        formData.flashingMaterialColor.map((value, i) => {
          this.filterObject.flashingMaterialColor[i] = value ? this.materialColorsToChoice[i] : null;
        });
        this.filterObject.flashingWidthFrom = formData.flashingWidthFrom;
        this.filterObject.flashingWidthTo = formData.flashingWidthTo;
        this.filterObject.flashingHeightFrom = formData.flashingHeightFrom;
        this.filterObject.flashingHeightTo = formData.flashingHeightTo;
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

  private loadDataToFiltration() {
    this.flashings$.pipe(takeUntil(this.isDestroyed$)).subscribe(flashings => {
      const typesTemp = [];
      const roofingTemp = [];
      const combinationsTemp = [];
      const materialTypesTemp = [];
      const materialColorsTemp = [];
      for (const flashing of flashings) {
        typesTemp.push(flashing.geometria);
        for (const roofingType of flashing.roofing) {
          roofingTemp.push(roofingType);
        }
        combinationsTemp.push(flashing.flashingCombinationCode);
        materialTypesTemp.push(flashing.oblachowanieMaterial);
        materialColorsTemp.push(flashing.oblachowanieKolor);
        if (flashing.wysokosc > this.biggestHeight) {
          this.biggestHeight = flashing.wysokosc;
        }
        if (flashing.szerokosc > this.biggestWidth) {
          this.biggestWidth = flashing.szerokosc;
        }
        if (flashing.wysokosc < this.smallestHeight) {
          this.smallestHeight = flashing.wysokosc;
        }
        if (flashing.szerokosc < this.smallestWidth) {
          this.smallestWidth = flashing.szerokosc;
        }
      }
      this.typesToChoice = typesTemp.filter((value, index, self) => self.indexOf(value) === index).filter(value => value !== null);
      this.roofingToChoice = roofingTemp.filter((value, index, self) => self.indexOf(value) === index).filter(value => value !== null);
      this.combinationsToChoice = combinationsTemp.filter((value, index, self) => self.indexOf(value) === index).filter(value => value !== null);
      this.materialTypesToChoice = materialTypesTemp.filter((value, index, self) => self.indexOf(value) === index).filter(value => value !== null);
      this.materialColorsToChoice = materialColorsTemp.filter((value, index, self) => self.indexOf(value) === index).filter(value => value !== null);
    });
  }

  private search(filterObject: {
    flashingCombination: any[]; flashingRoofing: any[]; flashingWidthFrom: number; flashingHeightFrom: number; flashingHeightTo: number; flashingMaterialColor: any[];
    flashingWidthTo: number; flashingType: any[]; flashingMaterialType: any[]; flashingName: string
  }) {
    Object.keys(filterObject).forEach(key => filterObject[key] === null ? delete filterObject[key] : key);
    this.filtersEmitter.emit(filterObject);
  }
}
