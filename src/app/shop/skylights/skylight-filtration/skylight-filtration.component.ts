import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MdTranslateService} from '../../../services/md-translate.service';
import {Observable, Subject} from 'rxjs';
import {Select} from '@ngxs/store';
import {SkylightState} from '../../../store/skylight/skylight.state';
import {RoofWindowSkylight} from '../../../models/roof-window-skylight';
import {map, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-skylight-filtration',
  templateUrl: './skylight-filtration.component.html',
  styleUrls: ['./skylight-filtration.component.scss']
})
export class SkylightFiltrationComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
              private translate: MdTranslateService) {
    translate.setLanguage();
  }

  @Output() filtersEmitter = new EventEmitter<any>();
  @Select(SkylightState.skylights) skylights$: Observable<RoofWindowSkylight[]>;
  glassesToChoice: string[] = [];
  openingTypesToChoice: string[] = [];
  materialsToChoice: string[] = [];
  biggestHeight = 0;
  biggestWidth = 0;
  smallestHeight = 999;
  smallestWidth = 999;
  filtrationForm: FormGroup;

  filtersObject = {
    skylightName: '',
    skylightGlazings: [],
    skylightOpeningTypes: [],
    skylightMaterials: [],
    skylightWidthFrom: 47,
    skylightWidthTo: 999,
    skylightHeightFrom: 60,
    skylightHeightTo: 999
  };
  private isDestroyed$ = new Subject();

  ngOnInit(): void {
    this.loadDataToFiltration();
    this.filtrationForm = this.fb.group({
      skylightName: new FormControl(),
      skylightGlazings: this.fb.array(this.builtFormArray(this.glassesToChoice)),
      skylightOpeningTypes: this.fb.array(this.builtFormArray(this.openingTypesToChoice)),
      skylightMaterials: this.fb.array(this.builtFormArray(this.materialsToChoice)),
      skylightWidthFrom: new FormControl(),
      skylightWidthTo: new FormControl(),
      skylightHeightFrom: new FormControl(),
      skylightHeightTo: new FormControl()
    });
    this.filtrationForm.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      map(data => {
        this.filtersObject.skylightName = data.skylightName;
        data.skylightGlazings.map((value, i) => {
          this.filtersObject.skylightGlazings[i] = value ? this.glassesToChoice[i] : null;
        });
        data.skylightOpeningTypes.map((value, i) => {
          this.filtersObject.skylightOpeningTypes[i] = value ? this.openingTypesToChoice[i] : null;
        });
        data.skylightMaterials.map((value, i) => {
          this.filtersObject.skylightMaterials[i] = value ? this.materialsToChoice[i] : null;
        });
        this.filtersObject.skylightWidthFrom = data.skylightWidthFrom;
        this.filtersObject.skylightWidthTo = data.skylightWidthTo;
        this.filtersObject.skylightHeightFrom = data.skylightHeightFrom;
        this.filtersObject.skylightHeightTo = data.skylightHeightTo;
      })).subscribe((data) => {
      this.search(this.filtersObject);
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
  }

  private builtFormArray(options: string[]) {
    const formControlsArray = [];
    for (const option of options) {
      formControlsArray.push(new FormControl());
    }
    return formControlsArray;
  }

  private search(filtersObject: {
    skylightHeightFrom: number; skylightOpeningTypes: any[]; skylightHeightTo: number; skylightName: string; skylightWidthFrom: number;
    skylightGlazings: any[]; skylightMaterials: any[]; skylightWidthTo: number
  }) {
    this.filtersEmitter.emit(filtersObject);
  }

  private loadDataToFiltration() {
    this.skylights$.pipe(takeUntil(this.isDestroyed$)).subscribe(skylights => {
      const glassesTemp = [];
      const openingTemp = [];
      const materiaTemp = [];
      for (const skylight of skylights) {
        if (skylight.pakietSzybowy.split(':')[1].toLowerCase().startsWith('e') ||
          skylight.pakietSzybowy.split(':')[1].toLowerCase().startsWith('v')) {
          this.translate.get('SHOP').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
            glassesTemp.push(text['doubleGlazing']);
          });
        } else {
          this.translate.get('SHOP').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
            glassesTemp.push(text['tripleGlazing']);
          });
        }
        openingTemp.push(skylight.otwieranie);
        materiaTemp.push(skylight.stolarkaMaterial);
        if (skylight.wysokosc > this.biggestHeight) {
          this.biggestHeight = skylight.wysokosc;
        }
        if (skylight.szerokosc > this.biggestWidth) {
          this.biggestWidth = skylight.szerokosc;
        }
        if (skylight.wysokosc < this.smallestHeight) {
          this.smallestHeight = skylight.wysokosc;
        }
        if (skylight.szerokosc < this.smallestWidth) {
          this.smallestWidth = skylight.szerokosc;
        }
        this.glassesToChoice = glassesTemp.filter((value, index, self) => self.indexOf(value) === index).filter(value => value !== null);
        this.openingTypesToChoice = openingTemp.filter((value, index, self) => self.indexOf(value) === index).filter(value => value !== null);
        this.materialsToChoice = materiaTemp.filter((value, index, self) => self.indexOf(value) === index).filter(value => value !== null);
      }
    });
  }
}
