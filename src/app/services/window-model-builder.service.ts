import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowModelBuilderService {

  constructor() { }

  buildWindowModel(model: string, pakietSzybowy: string, szerokosc: number, wysokosc: number) {
    const modelName = model.split(':')[1];
    const glazingName = pakietSzybowy.split(':')[1];
    return String(modelName + ' ' + glazingName + ' ' + szerokosc + 'x' + wysokosc);
  }
}
