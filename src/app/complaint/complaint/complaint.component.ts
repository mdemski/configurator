import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {ComplaintState} from '../../store/complaint/complaint.state';
import {Complaint} from '../../models/complaint';
import {DeleteComplaint} from '../../store/complaint/complaint.actions';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.scss']
})
export class ComplaintComponent implements OnInit, OnDestroy {

  isLoading;
  constructor(private store: Store) {
  }

  @Select(ComplaintState) userComplaints$: Observable<Complaint[]>;

  ngOnInit(): void {
    this.isLoading = false;
  }

  ngOnDestroy(): void {
  }

  deleteComplaint(complaint: Complaint) {
    this.store.dispatch(new DeleteComplaint(complaint));
  }
}
