import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../services/database.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  newsletterEmail: string;

  constructor(private db: DatabaseService) {
  }

  ngOnInit(): void {
  }

  submitNewsletter(newsletterEmail: HTMLInputElement) {
    this.newsletterEmail = newsletterEmail.value;
    console.log(this.newsletterEmail);
    this.db.saveEmailToDatabase(this.newsletterEmail);
  }
}
