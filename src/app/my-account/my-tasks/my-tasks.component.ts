import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../../store/app/app.state';
import {Observable, Subject} from 'rxjs';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {filter, map, takeUntil} from 'rxjs/operators';
import {Task} from '../../models/task';
import {TaskService} from '../../services/task.service';
import moment from 'moment/moment';
import _ from 'lodash';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss']
})
export class MyTasksComponent implements OnInit, OnDestroy {

  @Select(AppState) user$: Observable<{ currentUser }>;

  isLoading = true;
  currentUser;
  isDestroyed$ = new Subject();
  filtrationForm: FormGroup;
  private isFiltering = false;
  userTasks$: Observable<Task[]>;
  userTasks: Task[] = [];
  filteredTasks: Task[] = [];
  numberToggler = true;
  createdToggler = true;
  topicToggler = true;
  priorityToggler = true;
  statusToggler = true;
  leadingOperatorToggler = true;
  nextStepToggler = true;
  deadlineToggler = true;
  updatedToggler = true;
  crmProjectToggler = true;
  descriptionToggler = true;
  filteredObject = {
    numberSearch: '',
    createdSearch: '',
    topicSearch: '',
    prioritySearch: '',
    statusSearch: '',
    leadingOperatorSearch: '',
    nextStepSearch: '',
    deadlineSearch: '',
    updatedSearch: '',
    crmProjectSearch: '',
    descriptionSearch: ''
  };

  constructor(private store: Store,
              private fb: FormBuilder,
              private taskService: TaskService) {
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.currentUser = user.currentUser.email);
    this.userTasks$ = this.taskService.getUserTasks().pipe(takeUntil(this.isDestroyed$), map((tasks: Task[]) => tasks.filter(task => task.status  === 'Aktywne')));
  }

  ngOnInit(): void {
    this.userTasks$.pipe(takeUntil(this.isDestroyed$)).subscribe(tasks => this.userTasks = tasks);
    this.filteredTasks = this.userTasks;
    this.filtrationForm = this.fb.group({
      numberSearch: new FormControl(null),
      createdSearch: new FormControl(null),
      topicSearch: new FormControl(null),
      prioritySearch: new FormControl(null),
      statusSearch: new FormControl(null),
      leadingOperatorSearch: new FormControl(null),
      nextStepSearch: new FormControl(null),
      deadlineSearch: new FormControl(null),
      updatedSearch: new FormControl(null),
      crmProjectSearch: new FormControl(null),
      descriptionSearch: new FormControl(null)
    });
    this.filtrationForm.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      map(data => {
        this.filteredObject.numberSearch = data.numberSearch;
        this.filteredObject.createdSearch = data.createdSearch;
        this.filteredObject.topicSearch = data.topicSearch;
        this.filteredObject.prioritySearch = data.prioritySearch;
        this.filteredObject.statusSearch = data.statusSearch;
        this.filteredObject.leadingOperatorSearch = data.leadingOperatorSearch;
        this.filteredObject.nextStepSearch = data.nextStepSearch;
        this.filteredObject.deadlineSearch = data.deadlineSearch;
        this.filteredObject.updatedSearch = data.updatedSearch;
        this.filteredObject.crmProjectSearch = data.crmProjectSearch;
        this.filteredObject.descriptionSearch = data.descriptionSearch;
      }))
      .subscribe(() => this.filterTable(this.filteredObject));
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }

  // tslint:disable-next-line:max-line-length
  private filterTable(filteredObject: { crmProjectSearch: string; nextStepSearch: string; statusSearch: string; updatedSearch: string; topicSearch: string; prioritySearch: string; createdSearch: string; deadlineSearch: string; numberSearch: string; leadingOperatorSearch: string; descriptionSearch: string }) {
    this.isFiltering = true;
    this.filteredTasks = this.userTasks;
    this.filteredTasks = this.filteredTasks.filter(task => {
      let numberFound = true;
      let createdFound = true;
      let topicFound = true;
      let priorityFound = true;
      let statusFound = true;
      let leadingOperatorFound = true;
      let nextStepFound = true;
      let deadlineFound = true;
      let updatedFound = true;
      let crmProjectFound = true;
      let descriptionFound = true;
      if (filteredObject.numberSearch) {
        numberFound = task.erpNumber.toString().trim().toLowerCase().indexOf(filteredObject.numberSearch.toLowerCase()) !== -1;
      }
      if (filteredObject.createdSearch) {
        const firstDateToCompare = new Date(task.registrationDate);
        const secondDateToCompare = new Date(filteredObject.createdSearch);
        createdFound = moment(firstDateToCompare).isSame(secondDateToCompare, 'day');
      }
      if (filteredObject.topicSearch) {
        topicFound = task.topic.toString().trim().toLowerCase().indexOf(filteredObject.topicSearch.toLowerCase()) !== -1;
      }
      if (filteredObject.prioritySearch) {
        priorityFound = task.priority.toString().trim().toLowerCase().indexOf(filteredObject.prioritySearch.toLowerCase()) !== -1;
      }
      if (filteredObject.statusSearch) {
        statusFound = task.status.toString().trim().toLowerCase().indexOf(filteredObject.statusSearch.toLowerCase()) !== -1;
      }
      if (filteredObject.leadingOperatorSearch) {
        leadingOperatorFound = task.leadingOperator.toString().trim().toLowerCase().indexOf(filteredObject.leadingOperatorSearch.toLowerCase()) !== -1;
      }
      if (filteredObject.nextStepSearch) {
        const firstDateToCompare = new Date(task.nextStepDate);
        const secondDateToCompare = new Date(filteredObject.nextStepSearch);
        nextStepFound = moment(firstDateToCompare).isSame(secondDateToCompare, 'day');
      }
      if (filteredObject.deadlineSearch) {
        const firstDateToCompare = new Date(task.deadlineDate);
        const secondDateToCompare = new Date(filteredObject.deadlineSearch);
        deadlineFound = moment(firstDateToCompare).isSame(secondDateToCompare, 'day');
      }
      if (filteredObject.updatedSearch) {
        const firstDateToCompare = new Date(task.updatedAt);
        const secondDateToCompare = new Date(filteredObject.updatedSearch);
        updatedFound = moment(firstDateToCompare).isSame(secondDateToCompare, 'day');
      }
      if (filteredObject.crmProjectSearch) {
        crmProjectFound = task.crmProject.toString().trim().toLowerCase().indexOf(filteredObject.crmProjectSearch.toLowerCase()) !== -1;
      }
      if (filteredObject.descriptionSearch) {
        descriptionFound = task.description.toString().trim().toLowerCase().indexOf(filteredObject.descriptionSearch.toLowerCase()) !== -1;
      }
      return numberFound && createdFound && topicFound && priorityFound &&
        statusFound && leadingOperatorFound && nextStepFound && deadlineFound &&
        updatedFound && crmProjectFound && descriptionFound;
    });
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task, 'Nieaktywne').subscribe(() => {
      this.reloadTasks();
    });
  }

  private reloadTasks() {
    this.isLoading = true;
    this.userTasks = [];
    this.userTasks$.pipe(takeUntil(this.isDestroyed$)).subscribe(tasks => this.userTasks = tasks);
    this.filteredTasks = this.userTasks;
    this.isLoading = false;
  }

  sortByNumber() {
    this.numberToggler = !this.numberToggler;
    const task = this.numberToggler ? 'asc' : 'desc';
    this.filteredTasks = _.orderBy(this.filteredTasks, ['erpNumber'], task);
  }

  sortByTopic() {
    this.topicToggler = !this.topicToggler;
    const task = this.topicToggler ? 'asc' : 'desc';
    this.filteredTasks = _.orderBy(this.filteredTasks, ['topic'], task);
  }

  sortByStatus() {
    this.statusToggler = !this.statusToggler;
    const task = this.statusToggler ? 'asc' : 'desc';
    this.filteredTasks = _.orderBy(this.filteredTasks, ['status'], task);
  }

  sortByLeadingOperator() {
    this.leadingOperatorToggler = !this.leadingOperatorToggler;
    const task = this.leadingOperatorToggler ? 'asc' : 'desc';
    this.filteredTasks = _.orderBy(this.filteredTasks, ['leadingOperator'], task);
  }

  sortByCreatedDate() {
    this.createdToggler = !this.createdToggler;
    const task = this.createdToggler ? 'asc' : 'desc';
    this.filteredTasks = _.orderBy(this.filteredTasks, ['registrationDate'], task);
  }

  sortByUpdatedDate() {
    this.updatedToggler = !this.updatedToggler;
    const task = this.updatedToggler ? 'asc' : 'desc';
    this.filteredTasks = _.orderBy(this.filteredTasks, ['updatedAt'], task);
  }

  sortByPriority() {
    this.priorityToggler = !this.priorityToggler;
    const task = this.priorityToggler ? 'asc' : 'desc';
    this.filteredTasks = _.orderBy(this.filteredTasks, ['priority'], task);
  }

  sortByNextStep() {
    this.nextStepToggler = !this.nextStepToggler;
    const task = this.nextStepToggler ? 'asc' : 'desc';
    this.filteredTasks = _.orderBy(this.filteredTasks, ['nextStepDate'], task);
  }

  sortByDeadline() {
    this.deadlineToggler = !this.deadlineToggler;
    const task = this.deadlineToggler ? 'asc' : 'desc';
    this.filteredTasks = _.orderBy(this.filteredTasks, ['deadlineDate'], task);
  }

  sortByCrmProject() {
    this.crmProjectToggler = !this.crmProjectToggler;
    const task = this.crmProjectToggler ? 'asc' : 'desc';
    this.filteredTasks = _.orderBy(this.filteredTasks, ['crmProject'], task);
  }

  sortByDescription() {
    this.descriptionToggler = !this.descriptionToggler;
    const task = this.descriptionToggler ? 'asc' : 'desc';
    this.filteredTasks = _.orderBy(this.filteredTasks, ['description'], task);
  }
}
