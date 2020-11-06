import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  error = '';
  isLogged = false;
  id: number;
  myAccountLink: string;

  constructor(private authService: AuthService,
              private router: Router,
              public translate: TranslateService) {
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
      this.router.navigate(['/' + this.myAccountLink]);
      this.isLoading = false;
    }, error1 => {
      this.error = error1;
      this.isLoading = false;
    });
  }
}
