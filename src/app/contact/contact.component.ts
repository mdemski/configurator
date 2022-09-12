import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  @ViewChild('contactForm', {static: true}) contactForm: NgForm;
  firstName = '';
  lastName = '';
  email = '';
  telephone = '';
  company = '';
  message = '';
  submitted = false;

  constructor(public router: Router) {
  }

  onSubmit() {
    this.submitted = true;
    this.firstName = this.contactForm.value.firstName;
    this.lastName = this.contactForm.value.lastName;
    this.email = this.contactForm.value.email;
    this.telephone = this.contactForm.value.telephone;
    this.company = this.contactForm.value.company;
    this.message = this.contactForm.value.message;
  }
}
