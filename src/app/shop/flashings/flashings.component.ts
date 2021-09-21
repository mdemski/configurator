import { Component, OnInit } from '@angular/core';
import {Select} from '@ngxs/store';
import {FlashingState} from '../../store/flashing/flashing.state';
import {Observable} from 'rxjs';
import {Flashing} from '../../models/flashing';

@Component({
  selector: 'app-flashings',
  templateUrl: './flashings.component.html',
  styleUrls: ['./flashings.component.css']
})
export class FlashingsComponent implements OnInit {

  @Select(FlashingState.flashings) flashings$: Observable<Flashing[]>;
  constructor() { }

  ngOnInit(): void {
  }

}
