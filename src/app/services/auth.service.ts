import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {BehaviorSubject, throwError} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {LoginUser} from '../models/loginUser';
import {Router} from '@angular/router';
import {IpService} from './ip.service';
import moment from 'moment';
import DurationConstructor = moment.unitOfTime.DurationConstructor;
import {Store} from '@ngxs/store';
import {SetCurrentUser} from '../store/app/app.actions';

interface AuthResponseData {
  success: boolean;
  email: string;
  username: string;
  token: string;
  expiresIn: string;
}

@Injectable()
export class AuthService {
  user = new BehaviorSubject<LoginUser>(null);
  private tokenExpirationTimer: any;
  private loginLink: string;
  private isLogged = false;

  constructor(private http: HttpClient,
              private store: Store,
              private router: Router,
              private ipService: IpService,
              public translate: TranslateService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  returnUser() {
    return this.isLogged ? this.user.pipe(map(user => {
        if (user && user.username !== '' && user.username) {
          return {
            currentUser: user.username,
            loggedIn: true
          };
        } else {
          return {
            currentUser: user.email,
            loggedIn: true
          };
        }
      }))
      : this.ipService.getIpAddress().pipe(map(userIp => userIp)).pipe(map(userIp => {
        return {
          // @ts-ignore
          currentUser: userIp.query,
          loggedIn: false
        };
      }));
  }

  login(email: string, password: string) {
    const headers = new HttpHeaders({'Content-type': 'application/json'});

    return this.http.post<AuthResponseData>('http://localhost:4000/api/users/login', {
      email,
      password
    }, {headers})
      .pipe(
        catchError(errorRes => {
          let errorMessage: string;
          this.translate.get('LOGIN').subscribe(text => {
            errorMessage = text.unknownError;
          });
          if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorRes);
          } else {
            switch (errorRes.error.error.msg) {
              case 'EMAIL_NOT_FOUND':
                errorRes = this.translate.get('LOGIN').subscribe(text => {
                  errorMessage = text.wrongCredential;
                });
                break;
              case 'INVALID_PASSWORD':
                errorRes = this.translate.get('LOGIN').subscribe(text => {
                  errorMessage = text.wrongCredential;
                });
                break;
              case 'USER_DISABLED':
                errorRes = this.translate.get('LOGIN').subscribe(text => {
                  errorMessage = text.userBlocked;
                });
                break;
            }
            return throwError(errorMessage);
          }
        }), tap(resData => {
          this.authenticationHandler(resData.success, resData.email, resData.username, resData.token, resData.expiresIn);
        }));
  }

  autoLogin() {
    const loginUser: LoginUser = JSON.parse(localStorage.getItem('loginUser'));
    if (!loginUser) {
      return;
    }
    const loadedUser = new LoginUser();
    // @ts-ignore
    loadedUser.email = loginUser._email;
    // @ts-ignore
    loadedUser.username = loginUser._username;
    // @ts-ignore
    loadedUser.token = loginUser._token;
    // @ts-ignore
    loadedUser.expireDate = loginUser._expireDate;
    if (loadedUser.token) {
      this.isLogged = true;
      this.user.next(loadedUser);
      this.store.dispatch(SetCurrentUser);
      const expirationDuration = new Date(loadedUser.expireDate).valueOf() - Date.now().valueOf();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.isLogged = false;
    this.store.dispatch(SetCurrentUser);
    localStorage.removeItem('loginUser');
    this.translate.get('LINK').subscribe(text => {
      this.loginLink = text.login;
    });
    this.router.navigate(['/' + this.loginLink]);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDurationMS: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDurationMS);
  }

  private authenticationHandler(success: boolean, email: string, username: string, token: string, expiresIn: string) {
    if (success) {
      this.isLogged = true;
      // tslint:disable-next-line:radix
      const first = Number.parseInt(expiresIn.split(' ')[0]) as number;
      const second = expiresIn.split(' ')[1] as DurationConstructor;
      const date = moment().add(first, second);
      const durationLeftMS = date.valueOf() - Date.now().valueOf();
      const expireDate = new Date(moment().add(first, second).toDate());
      const user = new LoginUser();
      user.email = email;
      user.username = username;
      user.token = token;
      user.expireDate = expireDate;
      this.user.next(user);
      this.autoLogout(durationLeftMS);

      this.store.dispatch(SetCurrentUser);
      localStorage.setItem('loginUser', JSON.stringify(user));
    }
  }
}

