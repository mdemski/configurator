import {Injectable} from '@angular/core';

@Injectable()
export class AuthService {
  //TODO poprawić service po wprowadzeniu logowania i zaczytywania z bazy użytkowników
  isLogged = false;

  isAuthenticated() {
    const promise = new Promise(
      ((resolve, reject) => {
        setTimeout(() => {
          resolve(this.isLogged);
        }, 800);
      })
  );
    return promise;
  }

  login() {
    this.isLogged = true;
  }

  logout() {
    this.isLogged = false;
  }
}
