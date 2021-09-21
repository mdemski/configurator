import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Select, Store} from '@ngxs/store';
import {takeUntil} from 'rxjs/operators';
import {AppState} from '../store/app/app.state';
import {Observable, Subject} from 'rxjs';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Select(AppState.currentUser) userSub$: Observable<string>;
  private isDestroyed$ = new Subject();
  isAuthenticated = false;
  isLoading = false;
  error = '';
  userId = '';
  isLogged = false;
  id: number;
  myAccountLink: string;

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              public translate: TranslateService,
              private store: Store) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  ngOnInit(): void {
    // this.isLogged = this.authService.isAuthenticated();
    this.translate.get('LINK').subscribe(text => {
      this.myAccountLink = text.myAccount;
    });
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    this.isLoading = true;
    const email = authForm.value.email;
    const password = authForm.value.password;

    this.authService.login(email, password).subscribe(resData => {
      this.isLogged = true;
      authForm.reset();
      this.isAuthenticated = true;
      this.userSub$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => {
        if (this.isAuthenticated) {
          this.userId = this.userService.getUserByEmail(user).localId;
        }
      });
      // TODO znaleźć użytkownika z bazy używając email żeby zwrócić ID do routingu www.moja-aplikacja.pl/moje-konto/id
      this.router.navigate(['/' + this.myAccountLink]);
      this.isLoading = false;
    }, error1 => {
      this.error = error1;
      this.isLoading = false;
    });
  }
}
