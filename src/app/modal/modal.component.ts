import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from './modal.service';
import {ErpNameTranslatorService} from '../services/erp-name-translator.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() name: string;
  @Input() text: string;
  @Input() optionName: string;
  private readonly element: any;

  constructor(private modalService: ModalService,
              private el: ElementRef,
              private erpNameTrans: ErpNameTranslatorService) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    if (!this.name) {
      return;
    }
    // document.body.appendChild(this.element);
    // this.addEventListenerMulti(['click', 'keypress']);
    this.modalService.add(this);
  }

  ngOnDestroy() {
    this.modalService.remove(this.name);
    this.element.remove();
  }

  addEventListenerMulti(events: string[]) {
    events.forEach(event => this.element.addEventListener(event, el => {
      if (el.target.className === 'md-modal') {
        this.close();
      }
    }));
  }

  getOptionImage() {
    const fileNameObject = this.erpNameTrans.translatePropertyNamesERP(this.optionName);
    const fileName = fileNameObject.firstPart + fileNameObject.secondPart;
    return '/assets/img/modal_pictures/' + fileName + '.png';
  }

  open() {
    this.element.firstChild.classList.add('md-modal-wrap-open');
  }

  close() {
    this.element.firstChild.classList.remove('md-modal-wrap-open');
  }
}
