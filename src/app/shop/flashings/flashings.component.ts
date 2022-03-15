import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {FlashingState} from '../../store/flashing/flashing.state';
import {Observable} from 'rxjs';
import {Flashing} from '../../models/flashing';
import {GetFlashings} from '../../store/flashing/flashing.actions';

@Component({
  selector: 'app-flashings',
  templateUrl: './flashings.component.html',
  styleUrls: ['./flashings.component.css']
})
export class FlashingsComponent implements OnInit {

  @Select(FlashingState.flashings) flashings$: Observable<Flashing[]>;
  isFiltering: any;
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.isFiltering = true;
    setTimeout(() => {
      this.isFiltering = false;
    }, 2000);
    this.store.dispatch(new GetFlashings());
  }

  filtersInput($event: any) {
    // TODO przygotować metodę do filtrowania
  }
}
