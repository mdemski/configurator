import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../models/user';
import {Company} from '../models/company';
import {UUID} from 'angular2-uuid';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  isLoading = true;
  registerForm: FormGroup;
  clientType = false;
  registerUser = {} as User;
  registerCompany = {} as Company;
  uuidValue: string;
  error: string = null;
  userBody: any;
  companyBody: any;

  // TODO sprawdzić czy ngDoCheck załaduje tłumaczenie
  // bez dodatkowego przeładowania strony
  constructor(public translate: TranslateService,
              private router: Router,
              private authService: AuthService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang.match(/en|pl|de|fr/) ? browserLang : 'pl');
    // translate.use('pl');
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      // TODO dodać warunek sprawdzający długość hasła: Validators.min(8)
      password: new FormControl(null, [Validators.required]),
      rePassword: new FormControl(null, [Validators.required]),
      role: new FormControl(null),
      nip: new FormControl(null, [Validators.pattern('[0-9]{10}'), this.requiredIfCompanyClient()]),
      companyName: new FormControl(null, [this.requiredIfCompanyClient.bind(this)]),
      street: new FormControl(null),
      number: new FormControl(null),
      zipCode: new FormControl(null, [Validators.pattern('[0-9]{2}-[0-9]{3}')]),
      agent: new FormControl(null),
    }, this.comparePasswordAndRePassword);
    this.isLoading = false;
  }


  onSubmit() {
    this.isLoading = true;
    this.registerUser.firstName = this.registerForm.value.firstName;
    this.registerUser.lastName = this.registerForm.value.lastName;
    this.registerUser.email = this.registerForm.value.email;
    this.registerUser.password = this.registerForm.value.password;
    this.registerUser.rePassword = this.registerForm.value.rePassword;
    this.registerUser.role = this.registerForm.value.role;
    this.registerUser.uuid = this.generateUUID();
    this.registerUser.activated = false;
    this.userBody = JSON.stringify(this.registerUser);
    this.registerCompany.nip = this.registerForm.value.nip;
    this.registerCompany.name = this.registerForm.value.companyName;
    this.registerCompany.address.street = this.registerForm.value.street;
    this.registerCompany.address.address = this.registerForm.value.number;
    this.registerCompany.address.zipCode = this.registerForm.value.zipCode;
    this.registerCompany.agentOkpol = this.registerForm.value.agent;
    this.companyBody = JSON.stringify(this.registerCompany);
    // TODO wysłać POSTem obydwa JSONy w service
    if (this.registerForm.valid) {
      this.authService.singIn(this.registerUser, this.registerCompany).subscribe(resData => {
        this.translate.get('REGISTER').subscribe(text => {
          alert(text.registrationConfirmationAlert);
        });
        this.router.navigate(['/']);
        this.registerForm.reset();
      }, errorMessage => {
        this.error = errorMessage;
      });
    }
    this.isLoading = false;
  }

  generateUUID() {
    return this.uuidValue = UUID.UUID();
  }

  setClientTypeToTrue() {
    this.clientType = !this.clientType;
  }

  requiredIfCompanyClient(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.clientType) {
        return {required: true};
      } else {
        return null;
      }
    };
  }

  comparePasswordAndRePassword(group: FormGroup) {
    const pass = group.get('password').value;
    const rePass = group.get('rePassword').value;
    return pass === rePass ? null : {mismatch: true};
  }

  // getFirstNameFromTranslation() {
  //   this.firstNameLabel = this.translate
  //     .get(['REGISTER.firstName']).subscribe(trans => {
  //       return trans['REGISTER.firstName'];
  //     }).toString();
  // }
}
