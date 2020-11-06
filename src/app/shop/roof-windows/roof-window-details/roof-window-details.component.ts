import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';
import {RoofWindowSkylight} from '../../../models/roof-window-skylight';

@Component({
  selector: 'app-roof-window-details',
  templateUrl: './roof-window-details.component.html',
  styleUrls: ['./roof-window-details.component.css']
})
export class RoofWindowDetailsComponent implements OnInit {
  windowToShow: RoofWindowSkylight;

  constructor(private route: ActivatedRoute,
              private db: DatabaseService) { }

  ngOnInit(): void {
    const windowId = this.route.snapshot.paramMap.get('windowId');
    this.windowToShow = this.db.getWindowById(+windowId);
  }

}
