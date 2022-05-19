import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {FlashingState} from '../../store/flashing/flashing.state';
import {Observable, Subject} from 'rxjs';
import {Flashing} from '../../models/flashing';
import {GetFlashings} from '../../store/flashing/flashing.actions';
import {CartState} from '../../store/cart/cart.state';

@Component({
  selector: 'app-flashings',
  templateUrl: './flashings.component.html',
  styleUrls: ['./flashings.component.css']
})
export class FlashingsComponent implements OnInit {
  @Select(FlashingState.flashings) flashings$: Observable<Flashing[]>;
  @Select(CartState) cart$: Observable<any>;
  private isDestroyed$ = new Subject();
  isFiltering = false;
  filters: {
    flashingName: string,
    flashingType: string[],
    flashingApronType: string[],
    flashingCombination: string[],
    flashingMaterialType: string[],
    flashingMaterialColor: string[],
    flashingWidthFrom: number,
    flashingWidthTo: number,
    flashingHeightFrom: number,
    flashingHeightTo: number
  };
  flashingsList: Flashing[] = [];
  filteredFlashingsList: Flashing[] = [];
  searchText: string;
  page = 1;
  pageSize = 10;
  sortBy = 'popularity';
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.isFiltering = true;
    this.store.dispatch(new GetFlashings());
  }

  filtersInput($event: any) {
    // TODO przygotować metodę do filtrowania
  }
}
