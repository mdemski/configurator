import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject} from 'rxjs';
import {Select} from '@ngxs/store';
import {FlatRoofWindowState} from '../../../store/flat-roof-window/flat-roof-window.state';
import {FlatRoofWindow} from '../../../models/flat-roof-window';
import {map, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-flat-roof-window-filtration',
  templateUrl: './flat-roof-window-filtration.component.html',
  styleUrls: ['./flat-roof-window-filtration.component.scss']
})
export class FlatRoofWindowFiltrationComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
              public translate: TranslateService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  private isDestroyed$ = new Subject();
  @Output() filtersEmitter = new EventEmitter<any>();
  @Select(FlatRoofWindowState.flats) flatRoofWindows$: Observable<FlatRoofWindow[]>;
  glassesToChoice: string[] = [];
  openingTypesToChoice: string[] = [];
  biggestHeight = 0;
  biggestWidth = 0;
  smallestHeight = 999;
  smallestWidth = 999;
  filtrationForm: FormGroup;

  filtersObject = {
    flatName: '',
    flatGlazings: [],
    flatOpeningTypes: [],
    flatWidthFrom: 24,
    flatWidthTo: 999,
    flatHeightFrom: 24,
    flatHeightTo: 999
  };

  ngOnInit(): void {
    this.loadDataToFiltration();
    this.filtrationForm = this.fb.group({
      flatName: new FormControl(),
      flatGlazings: this.fb.array(this.builtFormArray(this.glassesToChoice)),
      flatOpeningTypes: this.fb.array(this.builtFormArray(this.openingTypesToChoice)),
      flatWidthFrom: new FormControl(),
      flatWidthTo: new FormControl(),
      flatHeightFrom: new FormControl(),
      flatHeightTo: new FormControl()
    });
    this.filtrationForm.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      map(data => {
        this.filtersObject.flatName = data.flatName;
        data.flatGlazings.map((value, i) => {
          this.filtersObject.flatGlazings[i] = value ? this.glassesToChoice[i] : null;
        });
        data.flatOpeningTypes.map((value, i) => {
          this.filtersObject.flatOpeningTypes[i] = value ? this.openingTypesToChoice[i] : null;
        });
        this.filtersObject.flatWidthFrom = data.flatWidthFrom;
        this.filtersObject.flatWidthTo = data.flatWidthTo;
        this.filtersObject.flatHeightFrom = data.flatHeightFrom;
        this.filtersObject.flatHeightTo = data.flatHeightTo;
      })
      ).subscribe((data) => this.search(this.filtersObject));
  }

  ngOnDestroy() {
    this.isDestroyed$.next(null);
  }

  private search(filtersObject: any): void {
    Object.keys(filtersObject).forEach(key => filtersObject[key] === null ? delete filtersObject[key] : key);
    this.filtersEmitter.emit(filtersObject);
  }

  private loadDataToFiltration() {
    this.flatRoofWindows$.pipe(takeUntil(this.isDestroyed$)).subscribe(flatRoofWindows => {
      const glassesTemp = [];
      const openingTemp = [];
      const materialTemp = [];
      for (const flatRoofWindow of flatRoofWindows) {
        if (flatRoofWindow.pakietSzybowy.split(':')[1].toLowerCase().startsWith('a')) {
          this.translate.get('SHOP').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
            glassesTemp.push(text['doubleGlazing']);
          });
        } else {
          this.translate.get('SHOP').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
            glassesTemp.push(text['tripleGlazing']);
          });
        }
        openingTemp.push(flatRoofWindow.otwieranie);
        if (flatRoofWindow.wysokosc > this.biggestHeight) {
          this.biggestHeight = flatRoofWindow.wysokosc;
        }
        if (flatRoofWindow.szerokosc > this.biggestWidth) {
          this.biggestWidth = flatRoofWindow.szerokosc;
        }
        if (flatRoofWindow.wysokosc < this.smallestHeight) {
          this.smallestHeight = flatRoofWindow.wysokosc;
        }
        if (flatRoofWindow.szerokosc < this.smallestWidth) {
          this.smallestWidth = flatRoofWindow.szerokosc;
        }
      }
      this.glassesToChoice = glassesTemp.filter((value, index, self) => self.indexOf(value) === index).filter(value => value !== null);
      this.openingTypesToChoice = openingTemp.filter((value, index, self) => self.indexOf(value) === index).filter(value => value !== null);
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
