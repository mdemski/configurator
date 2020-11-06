import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-spinner-loading',
  template: '<mdb-spinner spinnerColor="red"></mdb-spinner>',
  styleUrls: ['./spinner-loading.component.scss']
})
export class SpinnerLoadingComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
