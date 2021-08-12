import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Company} from '../models/company';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErpDataLoaderService {

  private eNovaApi = 'cośTam/api';

  constructor(private http: HttpClient) {
  }

  fetchAllCustomersFromERP(): Observable<Company[]> {
    return this.http.get(this.eNovaApi) as Observable<Company[]>;
  }
}
