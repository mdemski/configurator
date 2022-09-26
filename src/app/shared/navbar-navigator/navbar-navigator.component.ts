import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-navbar-navigator',
  templateUrl: './navbar-navigator.component.html',
  styleUrls: ['./navbar-navigator.component.scss']
})
export class NavbarNavigatorComponent implements OnInit {

  @Input() path: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
