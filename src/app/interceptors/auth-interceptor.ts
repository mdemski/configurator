import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginUser} from '../models/loginUser';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // Klasa która dodaje do każdego zapytania HTTP JWT
  // tslint:disable-next-line:max-line-length
  // TODO do zweryfikowania czy nie potrzebujemy logiki która nie będzie doklejała JWT w odniesieniu do np. konkretnej roli, dodatkowo do ustalenia czy któreś ścieżki w expressie nie potrzebują autoryzacji JWT?
  // TODO w przypadku gdy zapytanie musi mieć JWT token, a go nie posiada express serwer powinien zwrócić błąd
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loginUser: LoginUser = JSON.parse(localStorage.getItem('loginUser'));
    if (loginUser && loginUser.token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', loginUser.token)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }

}
