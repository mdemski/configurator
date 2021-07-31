import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: any[] = [];

  constructor() {
  }

  add(modal: any) {
    this.modals.push(modal);
  }

  remove(id: string) {
    this.modals = this.modals.filter(x => x.name === id);
  }

  open(name: string) {
    const modal = this.modals.find(x => x.name === name);
    modal.open();
  }

  close(name: string) {
    const modal = this.modals.find(x => x.name === name);
    modal.close();
  }
}
