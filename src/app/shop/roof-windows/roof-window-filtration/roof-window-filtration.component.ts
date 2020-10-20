import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { NgForm} from '@angular/forms';
import {DatabaseService} from '../../../services/database.service';

@Component({
  selector: 'app-roof-window-filtration',
  templateUrl: './roof-window-filtration.component.html',
  styleUrls: ['./roof-window-filtration.component.css']
})
export class RoofWindowFiltrationComponent implements OnInit {
  @ViewChild('searchForm', {static: true}) searchForm: NgForm;
  @Output() searchText = new EventEmitter<any>();
  @Output() filterChecks = new EventEmitter<any>();
  glassesToChoice: string[];

  constructor(private dataBase: DatabaseService) {
  }

  ngOnInit() {
    this.glassesToChoice = [];
    const glassesTemp = [];
    for (const window of this.dataBase.getAllRoofWindowsToShopList()) {
      glassesTemp.push(window.windowGlazing);
    }
    this.glassesToChoice = glassesTemp.filter((value, index, self) => self.indexOf(value) === index);
  }

  emitSearchText() {
    this.searchText.emit(this.searchForm.value.search);
  }

  emitFilterChecks(glass: string) {
    this.filterChecks.emit(glass);
  }
}
