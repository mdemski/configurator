import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailSenderService {

  constructor() { }

  // TODO Wysłanie maila do bazy danych eNova
  saveEmailToDatabase(newsletterEmail: string) {
  }
}
