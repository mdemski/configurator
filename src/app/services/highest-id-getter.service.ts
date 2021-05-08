import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HighestIdGetterService {
  highestId: number;

  constructor() {
    this.highestId = -1;
  }

  getHighestId(initialId, configurations: any[]) {
    this.highestId = initialId;
    for (const config of configurations) {
      if (config !== null) {
        if (this.highestId < config.id) {
          this.highestId = config.id;
        }
      }
    }
    this.highestId++;
    return this.highestId;
  }
}
