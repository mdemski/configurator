import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../models/user';
import {Company} from '../models/company';
import {UUID} from 'angular2-uuid';
import {Router} from '@angular/router';
import {Address} from '../models/address';
import {CrudService} from '../services/crud-service';
import {Observable, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import cryptoRandomString from 'crypto-random-string';

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
              private router: Router) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
    this.countries = this.crud.getCountryList();
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email], [this.emailExists.bind(this)]),
      // TODO dodać warunek sprawdzający długość hasła: Validators.min(8)
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      rePassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      username: new FormControl(null, [], [this.usernameExists.bind(this)]),
      // TODO zweryfikować czy ten pattern zadziała dla klientów zagranicznych? Jak to chce otrzymać eNova?
      nip: new FormControl(null, [Validators.pattern('[0-9]{10}'), this.requiredIfCompanyClient.bind(this)]),
      companyName: new FormControl(null, [this.requiredIfCompanyClient.bind(this)]),
      firstName: new FormControl(null, [this.requiredIf.bind(this)]),
      lastName: new FormControl(null, [this.requiredIf.bind(this)]),
      phoneNumber: new FormControl(null, [this.requiredIfCompanyClient.bind(this), Validators.pattern('^\\+?[0-9]{3}-?[0-9]{6,12}$')]),
      individualPhoneNumber: new FormControl(null, [this.requiredIfIndividualClient.bind(this), Validators.pattern('^\\+?[0-9]{3}-?[0-9]{6,12}$')]),
      street: new FormControl(null, [this.requiredIfCompanyClient.bind(this)]),
      individualStreet: new FormControl(null, [this.requiredIfIndividualClient.bind(this)]),
      localNumber: new FormControl(null),
      individualLocalNumber: new FormControl(null),
      zipCode: new FormControl(null, [Validators.pattern('[0-9]{2}-[0-9]{3}'), this.requiredIfCompanyClient.bind(this)]),
      individualZipCode: new FormControl(null, [Validators.pattern('[0-9]{2}-[0-9]{3}'), this.requiredIfIndividualClient.bind(this)]),
      city: new FormControl(null, [this.requiredIfCompanyClient.bind(this)]),
      individualCity: new FormControl(null, [this.requiredIfIndividualClient.bind(this)]),
      country: new FormControl('disabled', [this.requiredIfCompanyClient.bind(this)]),
      individualCountry: new FormControl('disabled', [this.requiredIfIndividualClient.bind(this)]),
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
    this.registerUser.name = this.registerForm.value.username;
    this.registerUser.role = 'user';
    this.registerUser.uuid = this.generateUUID();
    this.registerUser.activated = false;
    this.registerUser.discount = 0;
    this.registerUser.companyNip = this.registerForm.value.nip;
    this.registerUser.mainAddressId = '';
    this.registerUser.addressToSendId = '';
    this.registerUser.activationLink = window.location.origin + '/#/confirmation/' + cryptoRandomString({
      length: 6,
      type: 'alphanumeric'
    }) + '/' + this.registerUser.uuid;
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
      this.crud.readCompanyByNIP(this.registerForm.value.nip).subscribe(company => {
        if (!company) {
          this.registerCompany.name = this.registerForm.value.companyName;
          this.registerCompany.nip = this.registerForm.value.nip;
          this.registerCompany.discount = 0;
          this.registerCompany.address = this.registerAddress;
          this.registerCompany.agentOkpol = this.registerForm.value.agent;
          this.crud.createCompany(this.registerCompany).subscribe(console.log);
        }
      });
    }
    this.crud.createUser(this.registerUser).subscribe((response: { success: boolean, data: any | string }) => {
      if (response.success) {
        if (this.individualClient || this.companyClientType) {
          this.crud.createAddress(this.registerAddress).subscribe((addressResponse: { success: boolean, address: any }) => {
            if (addressResponse.success && this.individualClient) {
              this.crud.setUserMainAndToSendAddressByMongoId(response.data, addressResponse.address).subscribe(() => console.log('User updated'));
            }
          });
        }
      }
    });
    this.router.navigate(['/confirmation']);
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

  requiredIf<ValidatorFn>(control: FormControl) {
    const value = control.value;
    if (this.companyClientType || this.individualClient) {
      if (value === null || value === '') {
        return {
          ifRequired: true
        } as ValidationErrors;
      }
    } else {
      return null;
    }
  }

  requiredIfCompanyClient<ValidatorFn>(control: FormControl) {
    const value = control.value;
    if (this.companyClientType) {
      if (value === null || value === '' || value === 'disabled') {
        return {
          companyRequired: true
        } as ValidationErrors;
      }
    } else {
      return null;
    }
  }

  requiredIfIndividualClient<ValidatorFn>(control: FormControl) {
    const value = control.value;
    if (this.individualClient) {
      if (value === null || value === '' || value === 'disabled') {
        return {
          individualRequired: true
        } as ValidationErrors;
      }
    } else {
      return null;
    }
  }

  comparePasswordAndRePassword(group: FormGroup) {
    const pass = group.get('password').value;
    const rePass = group.get('rePassword').value;
    return pass === rePass ? null : {mismatch: true};
  }

  emailExists<AsyncValidator>(control: FormControl): Observable<ValidationErrors | null> {
    const value = control.value;

    return this.crud.readUserByEmail(value)
      .pipe(takeUntil(this.isDestroyed$),
        map(user => {
          return user ? {
            emailExists: true
          } : null;
        }));
  }

  usernameExists<AsyncValidator>(control: FormControl): Observable<ValidationErrors | null> {
    const value = control.value;

    return this.crud.readUserByUsername(value)
      .pipe(takeUntil(this.isDestroyed$),
        map(user => {
          return user ? {
            usernameExists: true
          } : null;
        }));
  }
}
