import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {ComplaintState} from '../../store/complaint/complaint.state';
import {Complaint} from '../../models/complaint';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.scss']
})
export class ComplaintComponent implements OnInit, OnDestroy {

  isLoading;
  constructor() {
  }

  @Select(ComplaintState) userComplaints$: Observable<Complaint[]>;

  ngOnInit(): void {
    this.isLoading = false;
  }

  ngOnDestroy(): void {
  }

}
