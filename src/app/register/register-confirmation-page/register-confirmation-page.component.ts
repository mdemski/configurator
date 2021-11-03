import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CrudService} from '../../services/crud-service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-register-confirmation-page',
  templateUrl: './register-confirmation-page.component.html',
  styleUrls: ['./register-confirmation-page.component.scss']
})
export class RegisterConfirmationPageComponent implements OnInit, OnDestroy {
  isVerifying: boolean;
  verifySuccess: boolean;
  random: string = null;
  uuid: string = null;
  isDestroyed$ = new Subject();
  loginPage: string;
  isLoading = true;

  constructor(public translate: TranslateService,
              private crud: CrudService,
              private router: Router,
              private route: ActivatedRoute) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.loginPage = text.login;
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.random = this.route.snapshot.params.random;
    this.uuid = this.route.snapshot.params.uuid;
    if (this.random && this.uuid) {
      this.isVerifying = true;
      this.crud.readUserByUUID(this.uuid).pipe(takeUntil(this.isDestroyed$)).subscribe(user => {
        if (user.activated) {
          this.verifySuccess = true;
          setTimeout(() => {
            this.router.navigate([this.loginPage]);
          }, 5000);
        } else {
          if (this.uuid === user.uuid) {
            this.verifySuccess = true;
            user.activated = true;
            user.lastUpdate = new Date();
            this.crud.updateUserByMongoId(user).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
          }
        }
      });
    }
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.isDestroyed$.next();
  }

}
