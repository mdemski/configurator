import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select} from '@ngxs/store';
import {UserState} from '../../../store/user/user.state';
import {Observable, Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {skip, takeUntil} from 'rxjs/operators';
import {TaskService} from '../../../services/task.service';
import {Task} from '../../../models/task';
import moment from 'moment';
import {MdTranslateService} from '../../../services/md-translate.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnDestroy {

  @Select(UserState) user$: Observable<any>;
  isDestroyed$ = new Subject();
  priorities$;
  crmProjects$;
  isLoading = true;
  loadedTask;
  taskForm: FormGroup;
  private ID = '';
  private myAccountLink = '';
  taskYear = '';
  taskMonth = '';
  taskID = '';

  constructor(public translate: MdTranslateService,
              private route: ActivatedRoute,
              private router: Router,
              public taskService: TaskService) {
    translate.setLanguage();
    this.route.paramMap.pipe(
      takeUntil(this.isDestroyed$))
      .subscribe(params => {
        this.ID = params.get('id');
        this.taskYear = params.get('year');
        this.taskMonth = params.get('month');
        if (this.ID) {
          this.taskID = String(this.ID + '/' + this.taskMonth + '/' + this.taskYear);
          this.taskService.getTaskByID(this.taskID).pipe(takeUntil(this.isDestroyed$)).subscribe(task => this.loadedTask = task);
        }
      });
    this.priorities$ = this.taskService.getPriorities().pipe(takeUntil(this.isDestroyed$));
    this.crmProjects$ = this.taskService.getOpenCRMProjects().pipe(takeUntil(this.isDestroyed$));
  }

  ngOnInit(): void {
    if (this.taskID === '' || this.taskID === undefined) {
      this.loadEmptyTaskForm();
    } else {
      this.loadTaskFormWithID();
    }
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.myAccountLink = text.myAccount;
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
  }


  private loadEmptyTaskForm() {
    this.user$.pipe(
      takeUntil(this.isDestroyed$),
      skip(1))
      .subscribe((user) => {
        let phone = null;
        let email = null;
        if (user) {
          phone = user.address.phoneNumber;
          email = user.email;
        }
        this.taskForm = new FormGroup({
          topic: new FormControl(null, Validators.required),
          description: new FormControl(null),
          priority: new FormControl('disabledPriority'),
          phone: new FormControl(phone, [Validators.pattern('^\\+?[0-9]{3}-?[0-9]{6,12}$')]),
          email: new FormControl(email, [Validators.email]),
          nextStepDate: new FormControl(null),
          deadlineDate: new FormControl(null),
          crmProject: new FormControl('disabledCRM'),
        });
        this.isLoading = false;
      });
  }

  private loadTaskFormWithID() {
    this.user$.pipe(
      takeUntil(this.isDestroyed$),
      skip(1))
      .subscribe((user) => {
        let phone = null;
        let email = null;
        if (user) {
          phone = user.address.phoneNumber;
          email = user.email;
        }
        this.taskForm = new FormGroup({
          topic: new FormControl(this.loadedTask.topic, Validators.required),
          description: new FormControl(this.loadedTask.description),
          priority: new FormControl(this.loadedTask.priority),
          phone: new FormControl(phone, [Validators.pattern('^\\+?[0-9]{3}-?[0-9]{6,12}$')]),
          email: new FormControl(email, [Validators.email]),
          nextStepDate: new FormControl(moment(this.loadedTask.nextStepDate).format('DD-MM-YYYY')),
          deadlineDate: new FormControl(moment(this.loadedTask.deadlineDate).format('DD-MM-YYYY')),
          crmProject: new FormControl(this.loadedTask.crmProject),
        });
        this.isLoading = false;
      });
  }

  onSubmit() {
    const email = this.taskForm.get('email').value;
    const task = new Task(
      '', new Date(), this.taskForm.get('topic').value, this.taskForm.get('description').value, this.taskForm.get('priority').value,
      'Aktywne', this.taskForm.get('phone').value, email, '', this.taskForm.get('nextStepDate').value,
      this.taskForm.get('deadlineDate').value, null, new Date(), false, this.taskForm.get('crmProject').value);
    if (this.loadedTask) {
      task.erpNumber = this.loadedTask.erpNumber;
      task.registrationDate = this.loadedTask.registrationDate;
      task.leadingOperator = this.loadedTask.leadingOperator;
      this.taskService.updateTask(task).pipe(takeUntil(this.isDestroyed$)).subscribe();
    } else {
      this.taskService.createTask(task).pipe(takeUntil(this.isDestroyed$)).subscribe();
    }
    this.taskForm.reset();
    this.router.navigate(['/' + this.myAccountLink]);
  }
}
