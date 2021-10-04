import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {takeUntil} from 'rxjs/operators';
import {Select} from '@ngxs/store';
import {RoofWindowState} from '../../store/roof-window/roof-window.state';
import {Observable, Subject} from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-roof-windows',
  templateUrl: './roof-windows.component.html',
  styleUrls: ['./roof-windows.component.scss']
})
export class RoofWindowsComponent implements OnInit, OnDestroy {
  filters: {
    windowName: string,
    windowGlazings: string[],
    windowOpeningTypes: string[],
    windowMaterials: string[],
    windowWidthFrom: number,
    windowWidthTo: number,
    windowHeightFrom: number,
    windowHeightTo: number
  };
  isFiltering = false;
  @Input() searchByKeyboard: string;
  @Select(RoofWindowState.roofWindows) roofWindows$: Observable<RoofWindowSkylight[]>;
  roofWindowsList: RoofWindowSkylight[] = [];
  filteredRoofWindowsList: RoofWindowSkylight[] = [];
  private isDestroyed$ = new Subject();
  page = 1;
  pageSize = 10;
  sortBy = 'nameDesc';

  constructor() {
  }

  ngOnInit(): void {
    this.pageSize = this.getNumberInRow();
    this.isFiltering = true;
    this.roofWindows$.pipe(takeUntil(this.isDestroyed$)).subscribe(roofWindows => this.roofWindowsList = roofWindows);
    this.filteredRoofWindowsList = this.roofWindowsList;
    this.isFiltering = false;
    this.sortArray();
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
    this.filters.windowGlazings.forEach(glazing => {
      if (glazing === null) {
        numberOfGlazingNull++;
      }
    });
    this.filters.windowOpeningTypes.forEach(opening => {
      if (opening === null) {
        numberOfOpeningNull++;
      }
    });
    this.filters.windowMaterials.forEach(material => {
      if (material === null) {
        numberOfMaterialNull++;
      }
    });
    if (numberOfGlazingNull === this.filters.windowGlazings.length) {
      filteredByGlazing = this.roofWindowsList;
    } else {
      filteredByGlazing = this.roofWindowsList
        .filter(window => this.filters.windowGlazings.includes(window.glazingToCalculation));
    }
    if (numberOfOpeningNull === this.filters.windowOpeningTypes.length) {
      filteredByOpening = filteredByGlazing;
    } else {
      filteredByOpening = filteredByGlazing
        .filter(window => this.filters.windowOpeningTypes.includes(window.otwieranie));
    }
    if (numberOfMaterialNull === this.filters.windowMaterials.length) {
      filteredByMaterial = filteredByOpening;
    } else {
      filteredByMaterial = filteredByOpening
        .filter(window => this.filters.windowMaterials.includes(window.stolarkaMaterial));
    }
    this.filteredRoofWindowsList = filteredByMaterial.filter(window => {
      let nameFound = true;
      let widthFound = true;
      let heightFound = true;
      if (this.filters.windowName) {
        nameFound = window.windowName.toString().trim().toLowerCase().indexOf(this.filters.windowName.toLowerCase()) !== -1;
      }
      if (this.filters.windowWidthFrom !== undefined && this.filters.windowWidthTo !== undefined) {
        // widths
        if (this.filters.windowWidthFrom <= this.filters.windowWidthTo) {
          widthFound = window.szerokosc >= this.filters.windowWidthFrom && window.szerokosc <= this.filters.windowWidthTo;
        }
        if (this.filters.windowWidthTo < 20 && this.filters.windowWidthFrom > 10) {
          widthFound = window.szerokosc >= this.filters.windowWidthFrom;
        }
        if (this.filters.windowWidthFrom < 10 && this.filters.windowWidthTo > 20) {
          widthFound = window.szerokosc <= this.filters.windowWidthTo;
        }
        if (this.filters.windowWidthFrom < 10 && this.filters.windowWidthTo < 20) {
          widthFound = true;
        }
      }
      if (this.filters.windowHeightFrom !== undefined && this.filters.windowHeightTo !== undefined) {
        // heights
        if (this.filters.windowHeightFrom <= this.filters.windowHeightTo) {
          heightFound = window.wysokosc >= this.filters.windowHeightFrom && window.wysokosc <= this.filters.windowHeightTo;
        }
        if (this.filters.windowHeightTo < 20 && this.filters.windowHeightFrom > 10) {
          heightFound = window.wysokosc >= this.filters.windowHeightFrom;
        }
        if (this.filters.windowHeightFrom < 10 && this.filters.windowHeightTo > 20) {
          heightFound = window.wysokosc <= this.filters.windowHeightTo;
        }
        if (this.filters.windowHeightFrom < 10 && this.filters.windowHeightTo < 20) {
          heightFound = true;
        }
      }
      return nameFound && widthFound && heightFound;
    });
    this.sortArray();
    this.isFiltering = false;
  }

  ngOnDestroy() {
    this.isDestroyed$.next();
  }

  getNumberInRow() {
    const containerWidth = Number(window.getComputedStyle(document.getElementsByClassName('md-container')[0]).width.slice(0, -2));
    return Math.floor(containerWidth / 300);
  }

  sortArray() {
    if (this.sortBy === 'popularity') {
      this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['iloscSprzedanychRok'], ['asc']);
    }
    if (this.sortBy === 'priceAsc') {
      this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['CenaDetaliczna'], ['asc']);
    }
    if (this.sortBy === 'priceDesc') {
      this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['CenaDetaliczna'], ['desc']);
    }
    if (this.sortBy === 'nameAsc') {
      this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['windowName'], ['asc']);
    }
    if (this.sortBy === 'nameDesc') {
      this.filteredRoofWindowsList = _.orderBy(this.filteredRoofWindowsList, ['windowName'], ['desc']);
    }
  }
}
