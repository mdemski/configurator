import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {RoofWindow} from '../../models/roof-window';
import {ActivatedRoute, Params, Route, Router} from '@angular/router';

@Component({
  selector: 'app-roof-windows',
  templateUrl: './roof-windows.component.html',
  styleUrls: ['./roof-windows.component.css']
})
export class RoofWindowsComponent implements OnInit {
  roofWindowsList: RoofWindow[];

  constructor(private db: DatabaseService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.roofWindowsList = this.db.getAllRoofWindowsToShopList();
    const id = this.route.snapshot.params['id'];
    this.roofWindowsList[id] = this.db.getWindowById(id);
    this.route.params.subscribe((params: Params) => {
      this.roofWindowsList[id] = this.db.getWindowById(+params['id']);
    });
  }

  onRoofReconfiguration() {
    // TODO należy dopisać this.router.id lub this.router.model żeby przenieść się do konfiguracji konkretnego okna
    // this.router.navigate(['/konfigurator/okna-dachowe', this.router.id]);
    this.router.navigate(['/konfigurator/okna-dachowe']);
  }
}
