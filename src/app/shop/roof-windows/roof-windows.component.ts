import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {Router} from '@angular/router';
import {shareReplay} from 'rxjs/operators';
import {Select, Store} from '@ngxs/store';
import {GetRoofWindows} from '../../store/roof-window/roof-window.actions';
import {RoofWindowState} from '../../store/roof-window/roof-window.state';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-roof-windows',
  templateUrl: './roof-windows.component.html',
  styleUrls: ['./roof-windows.component.scss']
})
export class RoofWindowsComponent implements OnInit, DoCheck {
  @Input() filters: object;
  @Input() searchByKeyboard: string;
  @Select(RoofWindowState.roofWindows) roofWindows$: Observable<RoofWindowSkylight[]>;
  roofWindowsList: RoofWindowSkylight[] = [];
  filteredRoofWindowsList: RoofWindowSkylight[] = [];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.loadAllWindows();
  }

  ngDoCheck() {
    if (this.filters) {
      this.filterWindowList(this.filters, this.roofWindowsList);
    }
  }

  // ngOnChanges() {
  // }


  loadAllWindows() {
    this.roofWindows$.pipe(shareReplay()).subscribe(windows => this.roofWindowsList = windows);
    this.filteredRoofWindowsList = this.filteredRoofWindowsList.length > 0 ? this.filteredRoofWindowsList : this.roofWindowsList;
  }

  filterWindowList(filters: any, roofWindowsList: RoofWindowSkylight[]) {
    this.filteredRoofWindowsList = roofWindowsList;
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

  onRoofReconfiguration() {
    // TODO należy dopisać this.router.id lub this.router.model żeby przenieść się do konfiguracji konkretnego okna
    // this.router.navigate(['/konfigurator/okna-dachowe', this.router.id]);
    this.router.navigate(['/konfigurator/okna-dachowe']);
  }
}
