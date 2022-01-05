import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../../store/app/app.state';
import {map, takeUntil} from 'rxjs/operators';
import {Order} from '../../models/order';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  @Input() activeOrders = false;

  @Select(AppState) user$: Observable<{ currentUser }>;

  isLoading = true;
  currentUser;
  isDestroyed$ = new Subject();
  filtrationForm: FormGroup;
  private isFiltering = false;
  userOrders$: Observable<Order[]>;
  userOrders: Order[] = [];
  filteredOrders: Order[] = [];
  numberToggler = true;
  innerNumber = true;
  statusToggler = true;
  createdToggler = true;
  updatedToggler = true;
  userToggler = true;
  commentToggler = true;
  filtersObject = {
    numberSearch: '',
    innerNumberSearch: '',
    statusSearch: '',
    createdSearch: '',
    updatedSearch: '',
    userSearch: '',
    commentSearch: '',
  };

  constructor(private store: Store,
              private fb: FormBuilder) {
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.currentUser = user.currentUser.email);
  }

  ngOnInit(): void {
    this.filtrationForm = this.fb.group({
      numberSearch: new FormControl(),
      innerNumberSearch: new FormControl(),
      statusSearch: new FormControl(),
      createdSearch: new FormControl(),
      updatedSearch: new FormControl(),
      userSearch: new FormControl(),
      commentSearch: new FormControl()
    });
    this.filtrationForm.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      map(data => {
        this.filtersObject.numberSearch = data.numberSearch;
        this.filtersObject.innerNumberSearch = data.innerNumberSearch;
        this.filtersObject.statusSearch = data.statusSearch;
        this.filtersObject.createdSearch = data.createdSearch;
        this.filtersObject.updatedSearch = data.updatedSearch;
        this.filtersObject.userSearch = data.userSearch;
        this.filtersObject.commentSearch = data.commentSearch;
      }))
      .subscribe(() => this.filterTable(this.filtersObject));
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }

  private filterTable(filtersObject: { innerNumberSearch: string; statusSearch: string; updatedSearch: string; userSearch: string; createdSearch: string; commentSearch: string; numberSearch: string }) {

  }
}
