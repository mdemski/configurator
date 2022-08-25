import {Component, OnInit} from '@angular/core';
import {MailSenderService} from '../services/mail-sender.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  newsletterEmail: string;

  constructor(private mailService: MailSenderService) {
  }

  ngOnInit(): void {
  }

  submitNewsletter(newsletterEmail: HTMLInputElement) {
    this.newsletterEmail = newsletterEmail.value;
    this.mailService.saveEmailToDatabase(this.newsletterEmail);
  }
}
