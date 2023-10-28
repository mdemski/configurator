import {Component, OnDestroy, OnInit} from '@angular/core';
import {TechnologyDataLoaderService} from '../technology-data-loader.service';
import {RowData} from '../models/row-data';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';

@Component({
  selector: 'app-technology-presentation',
  templateUrl: './technology-presentation.component.html',
  styleUrls: ['./technology-presentation.component.scss']
})
export class TechnologyPresentationComponent implements OnInit, OnDestroy {

  //filtrowanie po nadrzędnym, produkt i BOM_final_idn
  loadedData$: Observable<RowData[]>;
  filteredData$: Observable<RowData[]>;
  indexSearch = '';
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private loadData: TechnologyDataLoaderService) {
    this.loadedData$ = new Observable<RowData[]>;
    this.filteredData$ = new Observable<RowData[]>;
  }

  ngOnInit(): void {
    this.loadedData$ = this.loadData.fetchAllTechnologyData();
    this.filteredData$ = this.loadedData$;
    this.filteredData$.pipe(tap(() => this.loading$.next(false))).subscribe();
  }

  ngOnDestroy() {
    this.loading$.unsubscribe();
  }

  search(target: any) {
    this.loading$.next(true);
    this.filteredData$ = this.loadedData$
      .pipe(map(data => data.filter(row => {
          let nadrzednyFound: boolean;
          let produktFound: boolean;
          let bomIDNFound: boolean;
          nadrzednyFound = row.nadrzedny.toString().toLowerCase().indexOf(target.value.toLowerCase()) !== -1;
          produktFound = row.produkt.toString().toLowerCase().indexOf(target.value.toLowerCase()) !== -1;
          bomIDNFound = row.BOM_Final_Idn.toString().toLowerCase().indexOf(target.value.toLowerCase()) !== -1;
          return nadrzednyFound || produktFound || bomIDNFound;
        })));
    this.filteredData$.pipe(tap(() => this.loading$.next(false))).subscribe();
  }
}
