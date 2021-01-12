import {Injectable} from '@angular/core';
import {LoginUser} from '../models/loginUser';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: LoginUser;

  constructor(private http: HttpClient) {
  }

  getUserByEmail(email: string) {
    const users = [];
    this.http.get('').subscribe(subUsers => users.push(subUsers));
    for (const u of users) {
      if (u.email === email) {
        this.user = u;
      }
    }
    return this.user;
  }
}
