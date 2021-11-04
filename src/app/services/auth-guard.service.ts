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
    const loginUser = new LoginUser(JSON.parse(localStorage.getItem('loginUser'))._email,
      JSON.parse(localStorage.getItem('loginUser'))._username,
      JSON.parse(localStorage.getItem('loginUser'))._token,
      JSON.parse(localStorage.getItem('loginUser'))._expireDate);
    if (loginUser.token) {
      return true;
    }
    return this.router.createUrlTree(['/' + this.loginLink]);
  }

}
