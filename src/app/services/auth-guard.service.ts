import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {LoginUser} from '../models/loginUser';

@Injectable({providedIn: 'root'})
export class AuthGuardService implements CanActivate {
  loginLink: string;

  constructor(private authService: AuthService, private router: Router, public translate: TranslateService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.translate.get('LINK').subscribe(text => {
      this.loginLink = text.login;
    });
    if (JSON.parse(localStorage.getItem('loginUser'))) {
      const loginUser = new LoginUser();
      loginUser.email = JSON.parse(localStorage.getItem('loginUser')).email;
      loginUser.username = JSON.parse(localStorage.getItem('loginUser')).username;
      loginUser.token = JSON.parse(localStorage.getItem('loginUser')).token;
      loginUser.expireDate = JSON.parse(localStorage.getItem('loginUser')).expireDate;
      return true;
    }
    return this.router.createUrlTree(['/' + this.loginLink]);
  }

}
