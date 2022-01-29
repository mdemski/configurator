import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Select} from '@ngxs/store';
import {UserState} from '../../store/user/user.state';
import {Observable, Subject} from 'rxjs';
import {Address} from '../../models/address';
import {Company} from '../../models/company';
import {ComplaintItem} from '../../models/complaintItem';
import {ComplaintService} from '../../services/complaint.service';
import {RoofWindowValuesSetterService} from '../../services/roof-window-values-setter.service';
import {FlashingValueSetterService} from '../../services/flashing-value-setter.service';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {Flashing} from '../../models/flashing';
import {Complaint} from '../../models/complaint';
import {ActivatedRoute} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';
import {User} from '../../models/user';
import moment, {defaultFormat} from 'moment';
import {Accessory} from '../../models/accessory';
import {FlatRoofWindow} from '../../models/flat-roof-window';
import {VerticalWindow} from '../../models/vertical-window';

@Component({
  selector: 'app-complaint-form',
  templateUrl: './complaint-form.component.html',
  styleUrls: ['./complaint-form.component.scss']
})
export class ComplaintFormComponent implements OnInit, OnDestroy {

  @Select(UserState) user$: Observable<any>;
  isDestroyed$ = new Subject();
  isLoading = true;
  loadedComplaint;
  complaintForm: FormGroup;
  companyApplicant = false;
  individualApplicant = false;
  userAddress: Address = null;
  userCompany: Company = null;
  groups = ['roofWindow', 'skylight', 'flashing', 'accessory', 'flatRoofWindow', 'verticalWindow'];
  complaintItems: ComplaintItem[] = [];
  addPhotoPopup = false;
  private ID = '';
  complaintYear = '';
  complaintID = '';

  constructor(public translate: TranslateService,
              private route: ActivatedRoute,
              public complaintService: ComplaintService,
              private roofWindowSetter: RoofWindowValuesSetterService,
              private flashingSetter: FlashingValueSetterService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
    this.user$.pipe(
      takeUntil(this.isDestroyed$),
      filter(user => !user))
      .subscribe((user) => {
      this.userAddress = user.address;
      this.userCompany = user.company;
    });
    this.route.paramMap.pipe(
      takeUntil(this.isDestroyed$))
      .subscribe(params => {
        this.ID = params.get('id');
        this.complaintYear = params.get('year');
        if (this.ID) {
          this.complaintID = String(this.ID + '/' + this.complaintYear);
          this.complaintService.getComplaintByID(this.complaintID).pipe(takeUntil(this.isDestroyed$)).subscribe(complaint => this.loadedComplaint = complaint);
        }
      });
  }

  ngOnInit(): void {
    if (this.complaintID === '' || this.complaintID === undefined) {
      this.loadEmptyComplaintForm();
    } else {
      this.loadComplaintFormWithID();
    }
    this.complaintItems.push(this.createNewComplaintItem(0));
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }

  private loadEmptyComplaintForm() {
    this.complaintForm = new FormGroup({
      applicant: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(null, [Validators.required, Validators.pattern('^\\+?[0-9]{3}-?[0-9]{6,12}$')]),
      individualStreet: new FormControl(null, [this.requiredIfIndividualClient.bind(this)]),
      individualLocalNumber: new FormControl(null),
      individualZipCode: new FormControl(null, [Validators.pattern('[0-9]{2}-[0-9]{3}'), this.requiredIfIndividualClient.bind(this)]),
      individualCity: new FormControl(null, [this.requiredIfIndividualClient.bind(this)]),
      individualCountry: new FormControl(null, [this.requiredIfIndividualClient.bind(this)]),
      companyName: new FormControl(null, [this.requiredIfCompanyClient.bind(this)]),
      nip: new FormControl(null, [this.requiredIfCompanyClient.bind(this)]),
      street: new FormControl(null, [this.requiredIfCompanyClient.bind(this)]),
      localNumber: new FormControl(null),
      zipCode: new FormControl(null, [Validators.pattern('[0-9]{2}-[0-9]{3}'), this.requiredIfCompanyClient.bind(this)]),
      city: new FormControl(null, [this.requiredIfCompanyClient.bind(this)]),
      country: new FormControl(null, [this.requiredIfCompanyClient.bind(this)]),
      agent: new FormControl(null),
      products: new FormArray([new FormGroup({
        type: new FormControl('disabled', Validators.required),
        model: new FormControl(null, Validators.required),
        glazing: new FormControl(null, Validators.required),
        width: new FormControl(null, Validators.required),
        height: new FormControl(null, Validators.required),
        quantity: new FormControl(null, Validators.required),
        dataPlateNumber: new FormControl(null, Validators.required),
        description: new FormControl(null, [Validators.required, Validators.minLength(60)])
      })]),
      buyingDate: new FormControl(null, Validators.required),
      detectedDate: new FormControl(null, Validators.required),
      startUsingDate: new FormControl(null, Validators.required),
      installationDate: new FormControl(null, Validators.required),
    });
  }

  private loadComplaintFormWithID() {
    const complaint = this.loadedComplaint;
    let name = null;
    let companyNIP = null;
    let street = null;
    let localNumber = null;
    let zipCode = null;
    let city = null;
    let country = null;
    let companyAgent = null;
    if (complaint.owner instanceof Company) {
      name = complaint.owner.name;
      companyNIP = complaint.owner.nip;
      street = complaint.owner.address.street;
      localNumber = complaint.owner.address.localNumber;
      zipCode = complaint.owner.address.zipCode;
      city = complaint.owner.address.city;
      country = complaint.owner.address.country;
      companyAgent = complaint.owner.agentOkpol;
    }
    if (complaint.owner instanceof User) {
      name = complaint.owner.name;
      street = complaint.owner.address.street;
      localNumber = complaint.owner.address.localNumber;
      zipCode = complaint.owner.address.zipCode;
      city = complaint.owner.address.city;
      country = complaint.owner.address.country;
    }
    if (complaint.defectAddress) {
      name = complaint.defectAddress.name;
      street = complaint.defectAddress.street;
      localNumber = complaint.defectAddress.localNumber;
      zipCode = complaint.defectAddress.zipCode;
      city = complaint.defectAddress.city;
      country = complaint.defectAddress.country;
    }
    let productsArray = new FormArray([]);
    if (complaint.items.length > 0) {
      this.complaintItems = complaint.items;
      for (const complaintItem of complaint.items) {
        let productType;
        switch (complaintItem.product.constructor) {
          case RoofWindowSkylight:
            if (complaintItem.product.productName.toString().substr(0, 1) === 'W') {
              productType = 'skylight';
            } else {
              productType = 'roofWindow';
            }
            break;
          case Flashing:
            productType = 'flashing';
            break;
          case Accessory:
            productType = 'accessory';
            break;
          case FlatRoofWindow:
            productType = 'flatRoofWindow';
            break;
          case VerticalWindow:
            productType = 'verticalWindow';
            break;
          default:
            productType = 'roofWindow';
            break;
        }
        const temporaryFormGroup = new FormGroup({
          type: new FormControl(productType, Validators.required),
          model: new FormControl(complaintItem.product.model.split(':')[1], Validators.required),
          glazing: new FormControl(complaintItem.product.pakietSzybowy.split(':')[1], Validators.required),
          width: new FormControl(complaintItem.product.szerokosc, Validators.required),
          height: new FormControl(complaintItem.product.wysokosc, Validators.required),
          quantity: new FormControl(complaintItem.quantity, Validators.required),
          description: new FormControl(complaintItem.description, Validators.required),
          dataPlateNumber: new FormControl(complaintItem.dataPlateNumber, Validators.required)
        });
        productsArray.push(temporaryFormGroup);
      }
    } else {
      productsArray = new FormArray([this.buildNewProducts()]);
    }
    this.complaintForm = new FormGroup({
      applicant: new FormControl(complaint.applicant, [Validators.required]),
      email: new FormControl(complaint.email, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(complaint.phone, [Validators.required, Validators.pattern('^\\+?[0-9]{3}-?[0-9]{6,12}$')]),
      individualStreet: new FormControl(street, [this.requiredIfIndividualClient.bind(this)]),
      individualLocalNumber: new FormControl(localNumber),
      individualZipCode: new FormControl(zipCode, [Validators.pattern('[0-9]{2}-[0-9]{3}'), this.requiredIfIndividualClient.bind(this)]),
      individualCity: new FormControl(city, [this.requiredIfIndividualClient.bind(this)]),
      individualCountry: new FormControl(country, [this.requiredIfIndividualClient.bind(this)]),
      companyName: new FormControl(name, [this.requiredIfCompanyClient.bind(this)]),
      nip: new FormControl(companyNIP, [this.requiredIfCompanyClient.bind(this)]),
      street: new FormControl(street, [this.requiredIfCompanyClient.bind(this)]),
      localNumber: new FormControl(localNumber),
      zipCode: new FormControl(zipCode, [Validators.pattern('[0-9]{2}-[0-9]{3}'), this.requiredIfCompanyClient.bind(this)]),
      city: new FormControl(city, [this.requiredIfCompanyClient.bind(this)]),
      country: new FormControl(country, [this.requiredIfCompanyClient.bind(this)]),
      agent: new FormControl(companyAgent),
      products: productsArray,
      buyingDate: new FormControl(moment(complaint.buyingDate).format('DD-MM-YYYY'), Validators.required),
      detectedDate: new FormControl(moment(complaint.detectedDate).format('DD-MM-YYYY'), Validators.required),
      startUsingDate: new FormControl(moment(complaint.startUsingDate).format('DD-MM-YYYY'), Validators.required),
      installationDate: new FormControl(moment(complaint.installationDate).format('DD-MM-YYYY'), Validators.required),
    });
  }

  get products() {
    return this.complaintForm.get('products') as FormArray;
  }

  addNewProduct() {
    this.products.push(this.buildNewProducts());
    this.complaintItems.push(this.createNewComplaintItem(this.products.length - 1));
  }

  buildNewProducts() {
    return new FormGroup({
      type: new FormControl('disabled', Validators.required),
      model: new FormControl(null, Validators.required),
      glazing: new FormControl(null, Validators.required),
      width: new FormControl(null, Validators.required),
      height: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      dataPlateNumber: new FormControl(null, Validators.required)
    });
  }

  removeProduct(i: number) {
    if (this.products.length > 1) {
      this.products.removeAt(i);
    }
    if (this.complaintItems.length > 1) {
      this.complaintItems.splice(i, 1);
    }
  }

  addPicture(i: number) {
    this.addPhotoPopup = true;
    // this.newComplaint.items[i].attachment.push('url z dodanym zdjęciem');
  }

  setCompanyClientTypeToTrue() {
    this.isLoading = true;
    this.companyApplicant = !this.companyApplicant;
    this.individualApplicant = false;
    if (this.userAddress !== null) {
      this.complaintForm.patchValue({['street']: this.userAddress.street});
      this.complaintForm.patchValue({['localNumber']: this.userAddress.localNumber});
      this.complaintForm.patchValue({['zipCode']: this.userAddress.zipCode});
      this.complaintForm.patchValue({['city']: this.userAddress.city});
      this.complaintForm.patchValue({['country']: this.userAddress.country});
    }
    if (this.userCompany !== null) {
      this.complaintForm.patchValue({['companyName']: this.userCompany.name});
      this.complaintForm.patchValue({['nip']: this.userCompany.nip});
      this.complaintForm.patchValue({['agent']: this.userCompany.agentOkpol});
    }
    this.isLoading = false;
  }

  setIndividualClientTypeToTrue() {
    this.isLoading = true;
    this.individualApplicant = !this.individualApplicant;
    this.companyApplicant = false;
    if (this.userAddress !== null) {
      this.complaintForm.patchValue({['individualStreet']: this.userAddress.street});
      this.complaintForm.patchValue({['individualLocalNumber']: this.userAddress.localNumber});
      this.complaintForm.patchValue({['individualZipCode']: this.userAddress.zipCode});
      this.complaintForm.patchValue({['individualCity']: this.userAddress.city});
      this.complaintForm.patchValue({['individualCountry']: this.userAddress.country});
    }
    this.isLoading = false;
  }

  createNewComplaintItem(i: number) {
    const complaintItem = new ComplaintItem('', null, '', 0,
      '', '', '', '', '', []);
    return this.complaintService.createComplaintItem(complaintItem);
  }

  processFile(imageInput: HTMLInputElement, i: number) {
    this.complaintService.processFile(imageInput, this.complaintItems[i]);
  }

  onSubmit() {
    const defectAddress: Address = new Address(this.complaintForm.get('applicant').value.toString().split(' ')[0], this.complaintForm.get('applicant').value.toString().split(' ')[1],
      this.complaintForm.get('phoneNumber').value, '', '', '', '', '');
    if (this.companyApplicant) {
      defectAddress.street = this.complaintForm.get('street').value;
      defectAddress.localNumber = this.complaintForm.get('localNumber').value;
      defectAddress.zipCode = this.complaintForm.get('zipCode').value;
      defectAddress.city = this.complaintForm.get('city').value;
      defectAddress.country = this.complaintForm.get('country').value;
    }
    if (this.individualApplicant) {
      defectAddress.street = this.complaintForm.get('individualStreet').value;
      defectAddress.localNumber = this.complaintForm.get('individualLocalNumber').value;
      defectAddress.zipCode = this.complaintForm.get('individualZipCode').value;
      defectAddress.city = this.complaintForm.get('individualCity').value;
      defectAddress.country = this.complaintForm.get('individualCountry').value;
    }
    const temporaryErpNumber = String('temp' + Math.random().toString(36).substr(2, 5).toUpperCase() + '/' + new Date().getFullYear());
    const registeredComplaint: Complaint = new Complaint(temporaryErpNumber, new Date(), this.products.controls[0].get('description').value, 'Aktywna', this.complaintForm.get('phoneNumber').value,
      this.complaintForm.get('email').value, null, '', [], null, this.complaintForm.get('applicant').value, defectAddress, new Date(this.complaintForm.get('installationDate').value),
      new Date(this.complaintForm.get('buyingDate').value), new Date(this.complaintForm.get('detectedDate').value), new Date(this.complaintForm.get('detectedDate').value));
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.products.controls.length; i++) {
      let product = null;
      let productName = '';
      const width = Number(this.products.controls[i].get('width').value);
      const height = Number(this.products.controls[i].get('height').value);
      const quantity = Number(this.products.controls[i].get('quantity').value);
      // TODO uzupełnić switcha o settery dla akcesoriów, płaskich dachów i okien pionowych
      switch (this.products.controls[i].get('type').value) {
        case 'roofWindow': {
          productName = this.roofWindowSetter.buildWindowModel('Okno:' + this.products.controls[i].get('model').value,
            'Okno:' + this.products.controls[i].get('glazing').value, width, height);
          product = new RoofWindowSkylight('', '', productName, '', '', '',
            'Okno:' + this.products.controls[i].get('model').value, 'Okno:' + this.products.controls[i].get('glazing').value,
            this.products.controls[i].get('glazing').value, width, height, 'OknoDachowe', '', '', '', '',
            '', '', '', '', '', '', '', '', '',
            false, 0, [], [], [], [],
            0, 0, 0, 0, '', '', '', 0, '');
          break;
        }
        case 'skylight': {
          productName = this.roofWindowSetter.buildWindowModel('Wyłaz:' + this.products.controls[i].get('model').value,
            'Wyłaz:' + this.products.controls[i].get('glazing').value, width, height);
          product = new RoofWindowSkylight('', '', productName, '', '', '1. Nowy',
            'Wyłaz:' + this.products.controls[i].get('model').value, 'Wyłaz:' + this.products.controls[i].get('glazing').value,
            this.products.controls[i].get('glazing').value, width, height, 'WyłazDachowy', '', '', '', '',
            '', '', '', '', '', '', '', '', '',
            false, 0, [], [], [], [],
            0, 0, 0, 0, '', '', '', 0, '');
          break;
        }
        case 'flashing': {
          productName = this.flashingSetter.buildFlashingName('Kołnierz:' + this.products.controls[i].get('model').value, width, height);
          product = new Flashing('', '', productName, '', '', '1. Nowy',
            this.products.controls[i].get('model').value, width, height, 'KołnierzUszczelniający', '', '', '', '',
            '', '', '', '', 0, '', 0, 0, 0,
            0, [], [], '', false, null);
          break;
        }
        case 'accessory': {
          break;
        }
        case 'flatRoofWindow': {
          break;
        }
        case 'verticalWindow': {
          break;
        }
      }
      this.complaintItems[i].product = product;
      this.complaintItems[i].productName = productName;
      this.complaintItems[i].quantity = quantity;
      this.complaintItems[i].description = this.products.controls[i].get('description').value;
      this.complaintItems[i].dataPlateNumber = this.products.controls[i].get('dataPlateNumber').value;
    }
    registeredComplaint.items = this.complaintItems;
    // TODO tu się nic dalej z tym nie dzieje - brakuje HTTP i reset formularza
  }

  requiredIfCompanyClient<ValidatorFn>(control: FormControl) {
    const value = control.value;
    if (this.companyApplicant) {
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
    if (this.individualApplicant) {
      if (value === null || value === '' || value === 'disabled') {
        return {
          individualRequired: true
        } as ValidationErrors;
      }
    } else {
      return null;
    }
  }

  requiredIfGlazing<ValidatorFn>(control: FormControl) {
    const value = control.value;
    for (const productControl of this.products.controls) {
      if (productControl.get('type').value === 'roofWindow'
        || productControl.get('type').value === 'skylight'
        || productControl.get('type').value === 'flatRoofWindow'
        || productControl.get('type').value === 'verticalWindow'
      ) {
        if (value === null || value === '' || value === 'disabled') {
          return {
            glazingRequired: true
          } as ValidationErrors;
        }
      } else {
        return null;
      }
    }
  }

  closePhotosPopup() {
    this.addPhotoPopup = false;
    this.complaintService.updatedSuccessfully$.next(false);
  }
}
