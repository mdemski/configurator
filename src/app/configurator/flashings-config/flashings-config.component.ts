import {Component, OnInit} from '@angular/core';
import {LoadConfigurationService} from '../../services/load-configuration.service';

@Component({
  selector: 'app-flashings-config',
  templateUrl: './flashings-config.component.html',
  styleUrls: ['./flashings-config.component.scss']
})
export class FlashingsConfigComponent implements OnInit {

  constructor(private loadData: LoadConfigurationService) {

  }

  ngOnInit(): void {
    this.loadData.getFlashingToReconfigurationFromWindowData().subscribe(console.log);
  }

}
