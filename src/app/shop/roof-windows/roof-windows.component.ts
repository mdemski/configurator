import {Component, DoCheck, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {Router} from '@angular/router';
import {shareReplay, takeUntil} from 'rxjs/operators';
import {Select} from '@ngxs/store';
import {RoofWindowState} from '../../store/roof-window/roof-window.state';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-roof-windows',
  templateUrl: './roof-windows.component.html',
  styleUrls: ['./roof-windows.component.scss']
})
export class RoofWindowsComponent implements OnInit, OnDestroy {
  filters: object;
  @Input() searchByKeyboard: string;
  @Select(RoofWindowState.roofWindows) roofWindows$: Observable<RoofWindowSkylight[]>;
  roofWindowsList: RoofWindowSkylight[] = [];
  filteredRoofWindowsList: RoofWindowSkylight[] = [];
  private isDestroyed$ = new Subject();

  constructor() {
  }

  ngOnInit(): void {
    this.roofWindows$.pipe(takeUntil(this.isDestroyed$), shareReplay()).subscribe(roofWindows => this.roofWindowsList = roofWindows);
    // this.loadAllWindows().filter = JSON.stringify(this.filteredValues);
    this.filterWindowList(JSON.stringify(this.filters), this.roofWindowsList);
  }

  filtersInput(filtersObject: any) {
    this.filters = filtersObject;
    console.log(filtersObject);
  }

  ngOnDestroy() {
    this.isDestroyed$.next();
  }


  // loadAllWindows() {
  //   this.filteredRoofWindowsList = this.filteredRoofWindowsList.length > 0 ? this.filteredRoofWindowsList : this.roofWindowsList;
  // }

  filterWindowList(filters: any, roofWindowsList: RoofWindowSkylight[]) {
    this.filteredRoofWindowsList = roofWindowsList;
    if (filters) {
      const keys = Object.keys(filters);

      // TODO Dodać tutaj ngFor sprawdzający dla wszystkich wartości a nie pojedynczej wartości klucza patrz co pokazuje result poniżej

      const filterWindow = window => {
        let result = keys.map(key => {
          if ((!~key.indexOf('windowWidth')) && (!~key.indexOf('windowHeight'))) {
            if (window[key]) {
              return String(window[key]).toLowerCase().startsWith(String(filters[key]).toLowerCase());
            } else {
              return false;
            }
          }
          // if (!~key.indexOf('windowHeight')) {
          //   if (window[key]) {
          //     return String(window[key]).toLowerCase().startsWith(String(filters[key]).toLowerCase());
          //   } else {
          //     return false;
          //   }
          // }
        });
// To Clean Array from undefined if the age is passed so the map will fill the gap with (undefined)
        result = result.filter(it => it !== undefined);
// Filter the from the other filters
        // Width window/skylight filtration
        if (filters.windowWidthTo >= 0 && filters.windowWidthFrom >= 0) {
          if (window.windowWidth) {
            if (+window.windowWidth >= +filters.windowWidthFrom && +window.windowWidth <= +filters.windowWidthTo) {
              result.push(true);
            } else {
              result.push(false);
            }
          } else {
            result.push(false);
          }
        }
        // Height window/skylight filtration
        if (filters.windowHeightTo >= 0 && filters.windowHeightFrom >= 0) {
          if (window.windowHeight) {
            if (+window.windowHeight >= +filters.windowHeightFrom && +window.windowHeight <= +filters.windowHeightTo) {
              result.push(true);
            } else {
              result.push(false);
            }
          } else {
            result.push(false);
          }
        }
        return result.reduce((acc, cur: any) => {
          return acc && cur;
        }, 1);
      };
      this.filteredRoofWindowsList = this.roofWindowsList.filter(filterWindow);
    }
  }
}
