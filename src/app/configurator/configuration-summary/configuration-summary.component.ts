import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConfigurationDistributorService} from '../../services/configuration-distributor.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-configuration-summary',
  templateUrl: './configuration-summary.component.html',
  styleUrls: ['./configuration-summary.component.scss']
})
export class ConfigurationSummaryComponent implements OnInit, OnDestroy {

  configurations: any[];

  constructor(private configDist: ConfigurationDistributorService) {
    this.configurations = [];
    this.configDist.configurationDataChange$.pipe(map(conf => conf)).subscribe(configurations => {
      this.configurations = configurations;
      console.log(this.configurations.length);
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    // this.configDist.configurationDataChange$.unsubscribe();
  }


}
