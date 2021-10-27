import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../models/user';
import {Company} from '../models/company';
import {UUID} from 'angular2-uuid';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Address} from '../models/address';
import {CrudService} from '../services/crud-service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  isLoading = true;
  registerForm: FormGroup;
  companyClientType = false;
  individualClient = false;
  registerUser = {} as User;
  registerAddress = {} as Address;
  registerCompany = {} as Company;
  uuidValue: string;
  error: string = null;
  countries: Observable<string[]> = null;
  private isDestroyed$ = new Subject();

  // TODO sprawdzić czy ngDoCheck załaduje tłumaczenie
  // bez dodatkowego przeładowania strony
  constructor(public translate: TranslateService,
              private crud: CrudService,
              private router: Router,
              private authService: AuthService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
    this.countries = this.crud.getCountryList();
    // this.countries = of(['Polska', 'Niemcy', 'Zimbabwe', 'USA', 'Australia', 'England']);
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang.match(/en|pl|de|fr/) ? browserLang : 'pl');
    // translate.use('pl');
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      // TODO dodać warunek sprawdzający długość hasła: Validators.min(8)
      password: new FormControl(null, [Validators.required]),
      rePassword: new FormControl(null, [Validators.required]),
      nip: new FormControl(null, [Validators.pattern('[0-9]{10}'), this.requiredIfCompanyClient]),
      companyName: new FormControl(null, [this.requiredIfCompanyClient]),
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      phoneNumber: new FormControl(null, [Validators.pattern('^\\+?[0-9]{3}-?[0-9]{6,12}$')]),
      individualPhoneNumber: new FormControl(null, [Validators.pattern('^\\+?[0-9]{3}-?[0-9]{6,12}$')]),
      street: new FormControl(null, [this.requiredIfCompanyClient]),
      individualStreet: new FormControl(null, [this.requiredIfIndividualClient]),
      localNumber: new FormControl(null),
      individualLocalNumber: new FormControl(null),
      zipCode: new FormControl(null, [Validators.pattern('[0-9]{2}-[0-9]{3}'), this.requiredIfCompanyClient]),
      individualZipCode: new FormControl(null, [Validators.pattern('[0-9]{2}-[0-9]{3}'), this.requiredIfIndividualClient]),
      city: new FormControl(null, [this.requiredIfCompanyClient]),
      individualCity: new FormControl(null, [this.requiredIfIndividualClient]),
      country: new FormControl('disabled'),
      individualCountry: new FormControl('disabled'),
      agent: new FormControl(null),
    }, this.comparePasswordAndRePassword);
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.isDestroyed$.next();
  }

  onSubmit() {
    this.isLoading = true;
    this.registerUser.email = this.registerForm.value.email;
    this.registerUser.password = this.registerForm.value.password;
    this.registerUser.rePassword = this.registerForm.value.rePassword;
    this.registerUser.role = 'user';
    this.registerUser.uuid = this.generateUUID();
    this.registerUser.activated = false;
    this.registerUser.discount = 0;
    this.registerUser.companyNip = this.registerForm.value.nip;
    this.registerUser.mainAddressId = '';
    this.registerUser.addressToSendId = '';
    if (this.individualClient || this.companyClientType) {
      this.registerAddress.firstName = this.registerForm.value.firstName;
      this.registerAddress.lastName = this.registerForm.value.lastName;
      this.registerAddress.phoneNumber = this.registerForm.value.individualPhoneNumber;
      this.registerAddress.street = this.registerForm.value.individualStreet;
      this.registerAddress.localNumber = this.registerForm.value.individualLocalNumber;
      this.registerAddress.zipCode = this.registerForm.value.individualZipCode;
      this.registerAddress.city = this.registerForm.value.individualCity;
      if (this.registerForm.value.individualCountry !== 'disabled') {
        this.registerAddress.country = this.registerForm.value.individualCountry;
      }
    }
    if (Object.keys(this.registerCompany).length === 0 && this.companyClientType) {
      this.registerCompany.name = this.registerForm.value.companyName;
      this.registerCompany.nip = this.registerForm.value.nip;
      this.registerCompany.discount = 0;
      this.registerCompany.address = this.registerAddress;
      this.registerCompany.agentOkpol = this.registerForm.value.agent;
      this.crud.createCompany(this.registerCompany).subscribe(console.log);
    }
    this.crud.createUser(this.registerUser).subscribe((response: { success: boolean, user: any }) => {
      if (this.individualClient || this.companyClientType) {
        this.crud.createAddress(this.registerAddress).subscribe((addressResponse: { success: boolean, address: any }) => {
          if (addressResponse.success && this.individualClient) {
            this.crud.updateUserByMongoId(response.user, addressResponse.address, null).subscribe(() => console.log('User updated'));
          }
        });
      }
    });
    // this.router.navigate(['/']);
    this.registerForm.reset();
    this.isLoading = false;
  }

  generateUUID() {
    return this.uuidValue = UUID.UUID();
  }

  setCompanyClientTypeToTrue() {
    this.isLoading = true;
    this.companyClientType = !this.companyClientType;
    this.individualClient = false;
    if (this.registerForm.value.nip && this.companyClientType) {
      // TODO sprawdzić, czy to wczyta dane z danych firmowy do template???
      this.crud.readAllCompaniesFromERP().pipe(takeUntil(this.isDestroyed$)).subscribe(companies => {
        this.registerCompany = companies.find(company => company.nip === this.registerForm.value.nip);
        this.registerForm.value.firstName = this.registerCompany.address.firstName;
        this.registerForm.value.lastName = this.registerCompany.address.lastName;
        this.registerForm.value.phoneNumber = this.registerCompany.address.phoneNumber;
        this.registerForm.value.street = this.registerCompany.address.street;
        this.registerForm.value.localNumber = this.registerCompany.address.localNumber;
        this.registerForm.value.zipCode = this.registerCompany.address.zipCode;
        this.registerForm.value.city = this.registerCompany.address.city;
        this.registerForm.value.country = this.registerCompany.address.country;
        this.registerForm.value.agent = this.registerCompany.agentOkpol;
        this.registerUser.discount = this.registerCompany.discount;
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
    }
  }

  setIndividualClientTypeToTrue() {
    this.individualClient = !this.individualClient;
    this.companyClientType = false;
  }

  requiredIfCompanyClient(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.companyClientType) {
        return {required: true};
      } else {
        return null;
      }
    };
  }

  requiredIfIndividualClient(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.individualClient) {
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
}
