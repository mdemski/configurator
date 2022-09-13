import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {LoginUser} from '../models/loginUser';
import {MdTranslateService} from './md-translate.service';

@Injectable({providedIn: 'root'})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private translate: MdTranslateService) {
    translate.setLanguage();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (JSON.parse(localStorage.getItem('loginUser'))) {
      const loginUser = new LoginUser();
      loginUser.email = JSON.parse(localStorage.getItem('loginUser')).email;
      loginUser.username = JSON.parse(localStorage.getItem('loginUser')).username;
      loginUser.token = JSON.parse(localStorage.getItem('loginUser')).token;
      loginUser.expireDate = JSON.parse(localStorage.getItem('loginUser')).expireDate;
      return true;
    }
    return this.router.createUrlTree(['/login']);
  }

}
