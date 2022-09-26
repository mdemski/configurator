import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {map, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {CrudService} from '../services/crud-service';
import {MdTranslateService} from '../services/md-translate.service';

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

  constructor(private authService: AuthService,
              public router: Router,
              private crud: CrudService,
              private translate: MdTranslateService) {
    translate.setLanguage();
  }

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required], [this.emailNotExists.bind(this)]),
      password: new FormControl(null, [Validators.minLength(8)])
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
        this.router.navigate(['/my-account']);
        this.isLoading = false;
      }
    }, error1 => {
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
