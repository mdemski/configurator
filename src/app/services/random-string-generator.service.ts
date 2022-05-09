import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomStringGeneratorService {
  constructor() { }

  randomString(length: number) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!*()';
    let result = '';
    for (let i = length; i > 0; --i) { result += chars[Math.floor(Math.random() * chars.length)]; }
    return result;
  }
}
