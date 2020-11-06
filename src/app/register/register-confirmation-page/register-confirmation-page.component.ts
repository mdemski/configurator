import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register-confirmation-page',
  templateUrl: './register-confirmation-page.component.html',
  styleUrls: ['./register-confirmation-page.component.scss']
})
export class RegisterConfirmationPageComponent implements OnInit {

  constructor(public translate: TranslateService,
              private router: Router) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  ngOnInit(): void {
  }

}
