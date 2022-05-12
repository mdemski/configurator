import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Select} from '@ngxs/store';
import {RoofWindowState} from '../../../store/roof-window/roof-window.state';
import {Observable, Subject} from 'rxjs';
import {RoofWindowSkylight} from '../../../models/roof-window-skylight';
import {map, takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-roof-window-filtration',
  templateUrl: './roof-window-filtration.component.html',
  styleUrls: ['./roof-window-filtration.component.scss']
})
export class RoofWindowFiltrationComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
              public translate: TranslateService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  @Output() filtersEmitter = new EventEmitter<any>();
  @Select(RoofWindowState.roofWindows) roofWindows$: Observable<RoofWindowSkylight[]>;
  glassesToChoice: string[] = [];
  openingTypesToChoice: string[] = [];
  materialsToChoice: string[] = [];
  biggestHeight = 0;
  biggestWidth = 0;
  smallestHeight = 999;
  smallestWidth = 999;
  filtrationForm: FormGroup;

  filtersObject = {
    windowName: '',
    windowGlazings: [],
    windowOpeningTypes: [],
    windowMaterials: [],
    windowWidthFrom: 47,
    windowWidthTo: 999,
    windowHeightFrom: 60,
    windowHeightTo: 999
  };
  private isDestroyed$ = new Subject();

  ngOnInit() {
    this.loadDataToFiltration();
    this.filtrationForm = this.fb.group({
      windowName: new FormControl(),
      windowGlazings: this.fb.array(this.builtFormArray(this.glassesToChoice)),
      windowOpeningTypes: this.fb.array(this.builtFormArray(this.openingTypesToChoice)),
      windowMaterials: this.fb.array(this.builtFormArray(this.materialsToChoice)),
      windowWidthFrom: new FormControl(),
      windowWidthTo: new FormControl(),
      windowHeightFrom: new FormControl(),
      windowHeightTo: new FormControl()
    });
    this.filtrationForm.valueChanges.pipe(
      map(data => {
        this.filtersObject.windowName = data.windowName;
        data.windowGlazings.map((value, i) => {
          this.filtersObject.windowGlazings[i] = value ? this.glassesToChoice[i] : null;
        });
        data.windowOpeningTypes.map((value, i) => {
          this.filtersObject.windowOpeningTypes[i] = value ? this.openingTypesToChoice[i] : null;
        });
        data.windowMaterials.map((value, i) => {
          this.filtersObject.windowMaterials[i] = value ? this.materialsToChoice[i] : null;
        });
        this.filtersObject.windowWidthFrom = data.windowWidthFrom;
        this.filtersObject.windowWidthTo = data.windowWidthTo;
        this.filtersObject.windowHeightFrom = data.windowHeightFrom;
        this.filtersObject.windowHeightTo = data.windowHeightTo;
      })
    ).subscribe((data) => {
      this.search(this.filtersObject);
    });
  }

  ngOnDestroy() {
    this.isDestroyed$.next(null);
  }

  private search(filtersObject: any): void {
    Object.keys(filtersObject).forEach(key => filtersObject[key] === null ? delete filtersObject[key] : key);
    this.filtersEmitter.emit(filtersObject);
  }

  private loadDataToFiltration() {
    this.roofWindows$.pipe(takeUntil(this.isDestroyed$)).subscribe(windows => {
      const glassesTemp = [];
      const openingTemp = [];
      const materialTemp = [];
      for (const window of windows) {
        if (window.pakietSzybowy.toLowerCase().startsWith('e')) {
          this.translate.get('SHOP').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
            glassesTemp.push(text['doubleGlazing']);
          });
        } else {
          this.translate.get('SHOP').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
            glassesTemp.push(text['tripleGlazing']);
          });
        }
        openingTemp.push(window.otwieranie);
        materialTemp.push(window.stolarkaMaterial);
        if (window.wysokosc > this.biggestHeight) {
          this.biggestHeight = window.wysokosc;
        }
        if (window.szerokosc > this.biggestWidth) {
          this.biggestWidth = window.szerokosc;
        }
        if (window.wysokosc < this.smallestHeight) {
          this.smallestHeight = window.wysokosc;
        }
        if (window.szerokosc < this.smallestWidth) {
          this.smallestWidth = window.szerokosc;
        }
      }
      this.glassesToChoice = glassesTemp.filter((value, index, self) => self.indexOf(value) === index);
      this.openingTypesToChoice = openingTemp.filter((value, index, self) => self.indexOf(value) === index);
      this.materialsToChoice = materialTemp.filter((value, index, self) => self.indexOf(value) === index);
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
