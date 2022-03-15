import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {of} from 'rxjs';
import {Task} from '../models/task';
import moment from 'moment';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  private erpBaseUri = 'jakieś tam adres url do API eNovy';

  constructor(private http: HttpClient) {
  }

  getUserTasks() {
    // TODO odkomentować jak będzie Api enova
    // const url = `${this.erpBaseUri}`;
    // return this.http.get(url);
    return of([new Task('123/354/2022', moment(new Date()).add(-5, 'day').toDate(), 'Wycena',
      'Proszę o kontakt', 'Wysoki', 'Aktywne', '123-456-789', 'test@test.pl',
      'Olek', moment(new Date()).add(2, 'day').toDate(), moment(new Date()).add(5, 'day').toDate(), null, new Date(), false, 'Promocja Versa')]);
  }

  getTaskByID(taskID: string) {
    return this.getUserTasks().pipe(map(tasks => tasks.find(task => task.erpNumber === taskID)));
  }

  getOpenCRMProjects() {
    // TODO odkomentować jak będzie Api enova
    // const url = `${this.erpBaseUri}`;
    // return this.http.get(url);
    return of(['Promocja Versa', 'Promocja Okna z kołnierzem za złotówkę']);
  }

  getPriorities() {
    // TODO odkomentować jak będzie Api enova
    // const url = `${this.erpBaseUri}`;
    // return this.http.get(url);
    return of(['Niski', 'Normalny', 'Wysoki']);
  }

  createTask(task: Task) {
    const url = `${this.erpBaseUri}/createTask`;
    return this.http.put(url, task, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateTask(task: Task) {
    const url = `${this.erpBaseUri}/updateTask` + task.erpNumber;
    task.updatedAt = new Date();
    return this.http.put(url, task, {headers: this.headers}).pipe(catchError(err => err));
  }

  deleteTask(task: Task, status: string) {
    const url = `${this.erpBaseUri}/updateTask` + task.erpNumber;
    task.status = status;
    task.updatedAt = new Date();
    return this.http.put(url, task, {headers: this.headers}).pipe(catchError(err => err));
  }
}
