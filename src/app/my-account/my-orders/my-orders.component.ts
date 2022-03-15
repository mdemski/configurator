import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../../store/app/app.state';
import {map, takeUntil} from 'rxjs/operators';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import _ from 'lodash';
import moment from 'moment';

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
  innerNumberToggler = true;
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
              private fb: FormBuilder,
              private orderService: OrderService) {
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.currentUser = user.currentUser.email);
    this.userOrders$ = this.orderService.getUserOrders();
  }

  ngOnInit(): void {
    this.userOrders$.pipe(takeUntil(this.isDestroyed$)).subscribe(orders => this.userOrders = orders);
    this.filteredOrders = this.userOrders;
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
    this.isDestroyed$.next(null);
  }

  // tslint:disable-next-line:max-line-length
  private filterTable(filtersObject: { innerNumberSearch: string; statusSearch: string; updatedSearch: string; userSearch: string; createdSearch: string; commentSearch: string; numberSearch: string }) {
    this.isFiltering = true;
    this.filteredOrders = this.userOrders;
    this.filteredOrders = this.filteredOrders.filter(order => {
      let orderNumberFound = true;
      let innerNumberFound = true;
      let statusFound = true;
      let createdFound = true;
      let updatedFound = true;
      let userNameFound = true;
      let commentFound = true;
      if (filtersObject.numberSearch) {
        orderNumberFound = order.orderNumber.toString().trim().toLowerCase().indexOf(filtersObject.numberSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.innerNumberSearch) {
        innerNumberFound = order.erpId.toString().trim().toLowerCase().indexOf(filtersObject.innerNumberSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.statusSearch) {
        statusFound = order.status.toString().trim().toLowerCase().indexOf(filtersObject.statusSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.createdSearch) {
        const firstDateToCompare = new Date(order.createdAt);
        const secondDateToCompare = new Date(filtersObject.createdSearch);
        createdFound = moment(firstDateToCompare).isSame(secondDateToCompare, 'day');
      }
      if (filtersObject.updatedSearch) {
        const firstDateToCompare = new Date(order.updatedAt);
        const secondDateToCompare = new Date(filtersObject.updatedSearch);
        updatedFound = moment(firstDateToCompare).isSame(secondDateToCompare, 'day');
      }
      if (filtersObject.userSearch) {
        userNameFound = order.user.name.toString().trim().toLowerCase().indexOf(filtersObject.userSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.commentSearch) {
        commentFound = order.comments.toString().trim().toLowerCase().indexOf(filtersObject.commentSearch.toLowerCase()) !== -1;
      }
      return orderNumberFound && innerNumberFound && statusFound && createdFound && updatedFound && userNameFound && commentFound;
    });
    this.isFiltering = false;
  }

  deleteOrder(order: Order) {
    // TODO sprawdzić nazewnictwo statusów w eNova
    if (order.status !== '1. W realizacji') {
      this.orderService.updateOrderStatus(order, '5. Anulowane').subscribe(() => {
        this.reloadOrders();
      });
    }
  }

  private reloadOrders() {
    this.isLoading = true;
    this.userOrders = [];
    this.userOrders$.pipe(takeUntil(this.isDestroyed$)).subscribe(orders => this.userOrders = orders);
    this.filteredOrders = this.userOrders;
    this.isLoading = false;
  }

  sortByNumber() {
    this.numberToggler = !this.numberToggler;
    const order = this.numberToggler ? 'asc' : 'desc';
    this.filteredOrders = _.orderBy(this.filteredOrders, ['orderNumber'], order);
  }

  sortByInnerNumber() {
    this.innerNumberToggler = !this.innerNumberToggler;
    const order = this.innerNumberToggler ? 'asc' : 'desc';
    this.filteredOrders = _.orderBy(this.filteredOrders, ['erpId'], order);
  }

  sortByStatus() {
    this.statusToggler = !this.statusToggler;
    const order = this.statusToggler ? 'asc' : 'desc';
    this.filteredOrders = _.orderBy(this.filteredOrders, ['status'], order);
  }

  sortByCreatedDate() {
    this.createdToggler = !this.createdToggler;
    const order = this.createdToggler ? 'asc' : 'desc';
    this.filteredOrders = _.orderBy(this.filteredOrders, ['createdAt'], order);
  }

  sortByUpdatedDate() {
    this.updatedToggler = !this.updatedToggler;
    const order = this.updatedToggler ? 'asc' : 'desc';
    this.filteredOrders = _.orderBy(this.filteredOrders, ['updatedAt'], order);
  }

  sortByUser() {
    this.userToggler = !this.userToggler;
    const order = this.userToggler ? 'asc' : 'desc';
    this.filteredOrders = _.orderBy(this.filteredOrders, ['user.name'], order);
  }

  sortByComment() {
    this.commentToggler = !this.commentToggler;
    const order = this.commentToggler ? 'asc' : 'desc';
    this.filteredOrders = _.orderBy(this.filteredOrders, ['comments'], order);
  }
}
