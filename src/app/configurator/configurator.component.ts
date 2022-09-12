import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss']
})
export class ConfiguratorComponent implements OnInit {
  isSelected: number;

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  getSelectNoti(isChosen: number) {
    this.isSelected = isChosen;
  }
}
