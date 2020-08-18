import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
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


  onSubmit() {
    this.submitted = true;
    this.firstName = this.contactForm.value.firstName;
    this.lastName = this.contactForm.value.lastName;
    this.email = this.contactForm.value.email;
    this.telephone = this.contactForm.value.telephone;
    this.company = this.contactForm.value.company;
    this.message = this.contactForm.value.message;
    console.log(this.contactForm);
  }
}
