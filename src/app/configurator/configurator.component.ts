import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss']
})
export class ConfiguratorComponent implements OnInit {
  isSelected: number;

  constructor() { }

  ngOnInit(): void {
  }

  getSelectNoti(isChosen: number) {
    this.isSelected = isChosen;
  }
}
