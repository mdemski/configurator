import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {Select} from '@ngxs/store';
import {UserState} from '../../../store/user/user.state';
import {CrudService} from '../../../services/crud-service';
import {MdTranslateService} from '../../../services/md-translate.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  @Select(UserState) user$: Observable<any>;
  loading = false;
  resetPasswordForm: FormGroup;
  isDestroyed$ = new Subject();
  myAccountLink = '';
  myProfileLink = '';

  constructor(private translate: MdTranslateService,
              public router: Router,
              private crud: CrudService) {
  }

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      id: new FormControl(null),
      oldPassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      rePassword: new FormControl(null, [Validators.required, Validators.minLength(8)])
    }, this.comparePasswordAndRePassword);
    this.user$.pipe(takeUntil(this.isDestroyed$), filter(user => user.email !== '')).subscribe(user => {
      this.resetPasswordForm.patchValue({
        id: user._id
      });
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.myAccountLink = text.myAccount;
    });
    this.translate.get('LINK').pipe(takeUntil(this.isDestroyed$)).subscribe(text => {
      this.myProfileLink = text.myProfile;
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
  }

  onSubmit() {
    this.crud.changePassword(this.resetPasswordForm.value.id, this.resetPasswordForm.value.oldPassword,
      this.resetPasswordForm.value.password, this.resetPasswordForm.value.rePassword).pipe(takeUntil(this.isDestroyed$)).subscribe();
    this.resetPasswordForm.reset();
    this.router.navigate(['/' + this.myAccountLink + '/' + this.myProfileLink]);
  }

  comparePasswordAndRePassword(group: FormGroup) {
    const pass = group.get('password').value;
    const rePass = group.get('rePassword').value;
    return pass === rePass ? null : {mismatch: true};
  }
}
