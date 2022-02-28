import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {map, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {CrudService} from '../services/crud-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private isDestroyed$ = new Subject();
  authForm: FormGroup;
  isLoading = false;
  error = '';
  id: number;
  myAccountLink: string;

  constructor(private authService: AuthService,
              private router: Router,
              private crud: CrudService,
              public translate: TranslateService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required], [this.emailNotExists.bind(this)]),
      password: new FormControl(null, [Validators.minLength(8)])
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.myAccountLink = text.myAccount;
    });
  }

  onSubmit() {
    if (!this.authForm.valid) {
      return;
    }

    this.isLoading = true;
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    this.authService.login(email, password).subscribe((resData) => {
      if (resData.success) {
        this.authForm.reset();
        // TODO znaleźć użytkownika z bazy używając email żeby zwrócić ID do routingu www.moja-aplikacja.pl/moje-konto/id
        this.router.navigate(['/' + this.myAccountLink]);
        this.isLoading = false;
      }
    }, error1 => {
      console.log(error1);
      this.error = error1;
      this.isLoading = false;
    });
  }

  emailNotExists<AsyncValidator>(control: FormControl): Observable<ValidationErrors | null> {
    const value = control.value;

    return this.crud.readUserByEmail(value)
      .pipe(takeUntil(this.isDestroyed$),
        map(user => {
          return user ? null : {
            emailNotExists: true
          };
        }));
  }
}
