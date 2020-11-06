import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Company} from '../models/company';
import {User} from '../models/user';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, throwError} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {LoginUser} from '../models/loginUser';
import {Router} from '@angular/router';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable()
export class AuthService {
  user = new BehaviorSubject<LoginUser>(null);
  tokenExpirationTimer: any;
  loginLink: string;

  constructor(private http: HttpClient,
              private router: Router,
              public translate: TranslateService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  // TODO poprawić service po wprowadzeniu logowania i zaczytywania z bazy użytkowników
  isLogged = false;

  // TODO brakuje http request do bazy danych z użytkownikami do zakładania i logowania użytkwoników

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBYX38DKMbLQyk8sRaLARGheE_r8ojrevE', {
      email,
      password,
      returnSecureToken: true
    })
      .pipe(
        catchError(errorRes => {
          let errorMessage: string;
          this.translate.get('LOGIN').subscribe(text => {
            errorMessage = text.unknownError;
          });
          if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorRes);
          } else {
            switch (errorRes.error.error.message) {
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
          this.authenticationHandler(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
  }

  autoLogin() {
    const loginUser: {
      email: string,
      localId: string,
      _token: string,
      _expireDate: string
    } = JSON.parse(localStorage.getItem('loginUser'));
    if (!loginUser) {
      return;
    }
    const loadedUser = new LoginUser(
      loginUser.email,
      loginUser.localId,
      loginUser._token,
      new Date(loginUser._expireDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(loginUser._expireDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  // TODO jakie dane zwrócić w odpowiedzi na błędne logowanie
  singIn(user: User, company: Company) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBYX38DKMbLQyk8sRaLARGheE_r8ojrevE', {
      email: user.email,
      password: user.password,
      returnSecureToken: true
    })
      .pipe(
        catchError(errorRes => {
          let errorMessage: string;
          this.translate.get('LOGIN').subscribe(text => {
            errorMessage = text.unknownError;
          });
          if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
          }
          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorRes = this.translate.get('REGISTER').subscribe(text => {
                errorMessage = text.emailExists;
              });
              break;
            case 'OPERATION_NOT_ALLOWED':
              errorRes = this.translate.get('REGISTER').subscribe(text => {
                errorMessage = text.wrongPassword;
              });
              break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
              errorRes = this.translate.get('REGISTER').subscribe(text => {
                errorMessage = text.tooManyAttempts;
              });
              break;
          }
          return throwError(errorMessage);
        }), tap(resData => {
          this.authenticationHandler(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
  }

  logout() {
    this.user.next(null);
    this.translate.get('LINK').subscribe(text => {
      this.loginLink = text.login;
    });
    this.router.navigate(['/' + this.loginLink]);
    localStorage.removeItem('loginUser');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private authenticationHandler(email: string, localId: string, idToken: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new LoginUser(email, localId, idToken, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('loginUser', JSON.stringify(user));
  }
}

