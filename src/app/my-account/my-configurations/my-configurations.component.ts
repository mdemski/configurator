import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConfigurationState} from '../../store/configuration/configuration.state';
import {filter, map, takeUntil} from 'rxjs/operators';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../../store/app/app.state';
import {Observable, Subject} from 'rxjs';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {SingleConfiguration} from '../../models/single-configuration';
import _ from 'lodash';
import moment from 'moment';
import {DeleteGlobalConfiguration} from '../../store/configuration/configuration.actions';

@Component({
  selector: 'app-my-configurations' +
    '',
  templateUrl: './my-configurations.component.html',
  styleUrls: ['./my-configurations.component.scss']
})
export class MyConfigurationsComponent implements OnInit, OnDestroy {

  @Select(AppState) user$: Observable<{ currentUser }>;

  currentUser;
  isDestroyed$ = new Subject();
  userConfigurations$: Observable<SingleConfiguration[]>;
  userConfigurations: SingleConfiguration[] = [];
  filteredConfigurations: SingleConfiguration[] = [];
  isLoading = true;
  filtrationForm: FormGroup;
  globalIDToggler = true;
  nameToggler = true;
  userIDToggler = true;
  createdToggler = true;
  updatedToggler = true;
  private isFiltering = false;
  private filtersObject = {
    globalIDSearch: '',
    nameSearch: '',
    userIDSearch: '',
    createdSearch: '',
    updatedSearch: ''
  };

  constructor(private store: Store,
              private fb: FormBuilder) {
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.currentUser = user.currentUser.email);
    this.userConfigurations$ = this.store.select(ConfigurationState.userConfigurations).pipe(
      takeUntil(this.isDestroyed$),
      map(filterFn => filterFn(this.currentUser)),
      filter(configurations => configurations.length > 0)
    );
  }

  ngOnInit(): void {
    this.userConfigurations$.pipe(takeUntil(this.isDestroyed$)).subscribe(configurations => {
      this.filteredConfigurations = configurations;
      this.userConfigurations = configurations;
    });
    this.filtrationForm = this. fb.group({
      globalIDSearch: new FormControl(),
      nameSearch: new FormControl(),
      userIDSearch: new FormControl(),
      createdSearch: new FormControl(),
      updatedSearch: new FormControl()
    });
    this.filtrationForm.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      map(data => {
        this.filtersObject.globalIDSearch = data.globalIDSearch;
        this.filtersObject.nameSearch = data.nameSearch;
        this.filtersObject.userIDSearch = data.userIDSearch;
        this.filtersObject.createdSearch = data.createdSearch;
        this.filtersObject.updatedSearch = data.updatedSearch;
      })).subscribe(() => {
        this.filterTable(this.filtersObject);
    });
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
  }

  private filterTable(filtersObject: { nameSearch: string; userIDSearch: string; globalIDSearch: string; updatedSearch: string; createdSearch: string }) {
    this.isFiltering = true;
    this.filteredConfigurations = this.userConfigurations;
    this.filteredConfigurations = this.filteredConfigurations.filter(configuration => {
      let globalIDFound = true;
      let nameFound = true;
      let userIDFound = true;
      let createdFound = true;
      let updatedFound = true;
      if (filtersObject.globalIDSearch) {
        globalIDFound = configuration.globalId.toString().trim().toLowerCase().indexOf(filtersObject.globalIDSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.nameSearch) {
        nameFound = configuration.name.toString().trim().toLowerCase().indexOf(filtersObject.nameSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.userIDSearch) {
        userIDFound = configuration.userId.toString().trim().toLowerCase().indexOf(filtersObject.userIDSearch.toLowerCase()) !== -1;
      }
      if (filtersObject.createdSearch) {
        const firstDateToCompare = new Date(configuration.created);
        const secondDateToCompare = new Date(filtersObject.createdSearch);
        createdFound = moment(firstDateToCompare).isSame(secondDateToCompare, 'day');
      }
      if (filtersObject.updatedSearch) {
        const firstDateToCompare = new Date(configuration.lastUpdate);
        const secondDateToCompare = new Date(filtersObject.updatedSearch);
        updatedFound = moment(firstDateToCompare).isSame(secondDateToCompare, 'day');
      }
      return globalIDFound && nameFound && userIDFound && createdFound && updatedFound;
    });
    this.isFiltering = false;
  }

  sortByGlobalID() {
    this.globalIDToggler = !this.globalIDToggler;
    const order = this.globalIDToggler ? 'asc' : 'desc';
    this.filteredConfigurations = _.orderBy(this.filteredConfigurations, ['globalId'], order);
  }

  sortByName() {
    this.nameToggler = !this.nameToggler;
    const order = this.nameToggler ? 'asc' : 'desc';
    this.filteredConfigurations = _.orderBy(this.filteredConfigurations, ['name'], order);
  }

  sortByUserID() {
    this.userIDToggler = !this.userIDToggler;
    const order = this.userIDToggler ? 'asc' : 'desc';
    this.filteredConfigurations = _.orderBy(this.filteredConfigurations, ['userId'], order);
  }

  sortByCreatedDate() {
    this.createdToggler = !this.createdToggler;
    const order = this.createdToggler ? 'asc' : 'desc';
    this.filteredConfigurations = _.orderBy(this.filteredConfigurations, ['created'], order);
  }

  sortByUpdatedDate() {
    this.updatedToggler = !this.updatedToggler;
    const order = this.updatedToggler ? 'asc' : 'desc';
    this.filteredConfigurations = _.orderBy(this.filteredConfigurations, ['lastUpdate'], order);
  }

  deleteConfiguration(configuration: SingleConfiguration) {
    this.store.dispatch(new DeleteGlobalConfiguration(configuration));
  }
}
