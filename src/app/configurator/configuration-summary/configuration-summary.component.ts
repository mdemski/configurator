import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-configuration-summary',
  templateUrl: './configuration-summary.component.html',
  styleUrls: ['./configuration-summary.component.scss']
})
export class ConfigurationSummaryComponent implements OnInit {
  @Output() selectNoti = new EventEmitter<number>();
  isChosen = -1;

  constructor() {
  }

  ngOnInit(): void {
  }

  getChosenCss() {
    this.selectNoti.emit(this.isChosen);
    if (this.isChosen === 1) {
      return 'option-selected';
    } else if (this.isChosen === 0) {
      return 'option-is-selecting';
    } else {
      return 'option-not-selected';
    }
  }
}
