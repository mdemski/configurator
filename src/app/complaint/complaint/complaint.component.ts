import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {ComplaintState} from '../../store/complaint/complaint.state';
import {Complaint} from '../../models/complaint';
import {DeleteComplaint} from '../../store/complaint/complaint.actions';
import _ from 'lodash';
import {map, takeUntil} from 'rxjs/operators';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.scss']
})
export class ComplaintComponent implements OnInit, OnDestroy {

  isLoading;
  private isFiltering = false;
  private isDestroyed$ = new Subject();
  filteredComplaints: Complaint[] = [];
  complaintList: Complaint[] = [];
  erpToggler = true;
  dateToggler = true;
  statusToggler = true;
  topicToggler = true;
  ownerToggler = true;
  applicantToggler = true;
  leadingOperatorToggler = true;
  filtrationForm: FormGroup;
  private filtersObject = {
    erpSearch: '',
    dateSearch: '',
    statusSearch: '',
    topicSearch: '',
    ownerSearch: '',
    applicantSearch: '',
    leadingOperatorSearch: '',
  };

  constructor(private fb: FormBuilder, private store: Store) {
  }

  @Select(ComplaintState) userComplaints$: Observable<{ complaints: Complaint[] }>;

  ngOnInit(): void {
    this.filtrationForm = this.fb.group({
      erpSearch: new FormControl(),
      dateSearch: new FormControl(),
      statusSearch: new FormControl(),
      topicSearch: new FormControl(),
      ownerSearch: new FormControl(),
      applicantSearch: new FormControl(),
      leadingOperatorSearch: new FormControl(),
    });
    this.filtrationForm.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      map(data => {
        this.filtersObject.erpSearch = data.erpSearch;
        this.filtersObject.dateSearch = data.dateSearch;
        this.filtersObject.statusSearch = data.statusSearch;
        this.filtersObject.topicSearch = data.topicSearch;
        this.filtersObject.ownerSearch = data.ownerSearch;
        this.filtersObject.applicantSearch = data.applicantSearch;
        this.filtersObject.leadingOperatorSearch = data.leadingOperatorSearch;
      })).subscribe(() => {
      this.filterTable(this.filtersObject);
    });
    this.userComplaints$.pipe(takeUntil(this.isDestroyed$)).subscribe((data: { complaints: Complaint[] }) => this.complaintList = data.complaints);
    this.filteredComplaints = this.complaintList;
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }

  deleteComplaint(complaint: Complaint) {
    this.store.dispatch(new DeleteComplaint(complaint));
  }

  sortByERPName() {
    this.erpToggler = !this.erpToggler;
    const order = this.erpToggler ? 'asc' : 'desc';
    console.log(order);
    this.filteredComplaints = _.orderBy(this.filteredComplaints, ['erpNumber'], order);
  }

  sortByRegistrationDate() {
    this.dateToggler = !this.dateToggler;
    const order = this.dateToggler ? 'asc' : 'desc';
    this.filteredComplaints = _.orderBy(this.filteredComplaints, ['registrationDate'], order);
  }

  sortByStatus() {
    this.statusToggler = !this.statusToggler;
    const order = this.statusToggler ? 'asc' : 'desc';
    this.filteredComplaints = _.orderBy(this.filteredComplaints, ['status'], order);
  }

  sortByTopic() {
    this.topicToggler = !this.topicToggler;
    const order = this.topicToggler ? 'asc' : 'desc';
    this.filteredComplaints = _.orderBy(this.filteredComplaints, ['topic'], order);
  }

  sortByOwner() {
    this.ownerToggler = !this.ownerToggler;
    const order = this.ownerToggler ? 'asc' : 'desc';
    this.filteredComplaints = _.orderBy(this.filteredComplaints, ['owner'], order);
  }

  sortByApplicant() {
    this.applicantToggler = !this.applicantToggler;
    const order = this.applicantToggler ? 'asc' : 'desc';
    this.filteredComplaints = _.orderBy(this.filteredComplaints, ['applicant'], order);
  }

  sortByLeadingOperator() {
    this.leadingOperatorToggler = !this.leadingOperatorToggler;
    const order = this.leadingOperatorToggler ? 'asc' : 'desc';
    this.filteredComplaints = _.orderBy(this.filteredComplaints, ['leadingOperator'], order);
  }

  // tslint:disable-next-line:max-line-length
  private filterTable(filtersObject: { statusSearch: string; erpSearch: string; topicSearch: string; ownerSearch: string; dateSearch: string; applicantSearch: string; leadingOperatorSearch: string }) {
    this.isFiltering = true;
    this.filteredComplaints = this.complaintList;
    console.log(filtersObject);
    this.filteredComplaints = this.filteredComplaints.filter(complaint => {
      let erpFound = true;
      let dateFound = true;
      let statusFound = true;
      let topicFound = true;
      let ownerFound = true;
      let applicantFound = true;
      let leadingOperatorFound = true;
      if (filtersObject.erpSearch) {
        erpFound = complaint.erpNumber.toString().trim().toLowerCase().indexOf(filtersObject.erpSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.dateSearch) {
        const firstDateToCompare = new Date(complaint.registrationDate);
        const secondDateToCompare = new Date(filtersObject.dateSearch);
        dateFound = moment(firstDateToCompare).isSame(secondDateToCompare, 'day');
      }
      if (filtersObject.statusSearch) {
        statusFound = complaint.status.toString().trim().toLowerCase().indexOf(filtersObject.statusSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.topicSearch) {
        topicFound = complaint.topic.toString().trim().toLowerCase().indexOf(filtersObject.topicSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.ownerSearch) {
        ownerFound = complaint.owner.name.toString().trim().toLowerCase().indexOf(filtersObject.ownerSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.applicantSearch) {
        applicantFound = complaint.applicant.toString().trim().toLowerCase().indexOf(filtersObject.applicantSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.leadingOperatorSearch) {
        leadingOperatorFound = complaint.leadingOperator.toString().trim().toLowerCase().indexOf(filtersObject.leadingOperatorSearch.toLowerCase()) !== -1;
      }
      return erpFound && dateFound && statusFound && topicFound && ownerFound && applicantFound && leadingOperatorFound;
    });
    // this.sortByERPName();
    // this.sortByRegistrationDate();
    // this.sortByStatus();
    // this.sortByTopic();
    // this.sortByOwner();
    // this.sortByApplicant();
    // this.sortByLeadingOperator();
    this.isFiltering = false;
  }
}
