import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CrudService} from '../../services/crud-service';
import {filter, map, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Store} from '@ngxs/store';
import {ActivateUser} from '../../store/user/user.actions';
import {MdTranslateService} from '../../services/md-translate.service';
import {IpService} from '../../services/ip.service';
import {ConfigurationState} from '../../store/configuration/configuration.state';
import {UpdateGlobalConfigurationNameByConfigId} from '../../store/configuration/configuration.actions';

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

  constructor(private translate: MdTranslateService,
              private crud: CrudService,
              private store: Store,
              private router: Router,
              private route: ActivatedRoute,
              private ip: IpService) {
    translate.setLanguage();
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
          this.router.navigate([this.loginPage]);
        } else {
          if (this.uuid === user.uuid) {
            this.verifySuccess = true;
            this.store.dispatch(new ActivateUser(user)).pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
            setTimeout(() => {
              this.router.navigate([this.loginPage]);
            }, 5000);
          }
        }
        // Updated configurations owner from IP to registered user - BEFORE TESTS
        this.ip.getIpApi().subscribe(data => {
          this.store.select(ConfigurationState.userConfigurations).pipe(
            takeUntil(this.isDestroyed$),
            // @ts-ignore
            map(filterFn => filterFn(data.ip)),
            filter(configurations => configurations.length > 0),
            map(configurations => configurations.map(config => {
              config.user = user.email;
              this.store.dispatch(new UpdateGlobalConfigurationNameByConfigId(config.globalId, config.name));
            })));
        });
      });
    }
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.isDestroyed$.next(null);
  }

}
