import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SingleConfiguration} from '../../models/single-configuration';
import {Observable, Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, takeUntil} from 'rxjs/operators';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../../store/app/app.state';
import {ConfigurationState} from '../../store/configuration/configuration.state';
import {RouterState} from '@ngxs/router-plugin';

@Component({
  selector: 'app-single-configuration-summary',
  templateUrl: './single-configuration-summary.component.html',
  styleUrls: ['./single-configuration-summary.component.scss']
})
export class SingleConfigurationSummaryComponent implements OnInit, OnDestroy {

  @Select(AppState) user$: Observable<{ currentUser }>;
  @Select(RouterState) params$: Observable<any>;
  @Select(ConfigurationState.configurationByGlobalID) configurations$: Observable<SingleConfiguration[]>;
  @ViewChild('configurationData') configurationData: ElementRef;
  private configurations: SingleConfiguration[];
  private routerParams;
  configuration$: Observable<SingleConfiguration>;
  currentUser;
  uneditable = true;
  loading;
  isDestroyed$ = new Subject();

  constructor(private store: Store) {
    this.loading = true;
    this.params$.pipe(takeUntil(this.isDestroyed$)).subscribe(params => this.routerParams = params);
  }

  ngOnInit() {
    this.configuration$ = this.store.select(ConfigurationState.configurationByGlobalID)
      .pipe(map(filterFn => filterFn(this.routerParams.state.params.configId)));
    this.loading = false;
  }

  builtNameForTranslation(prefix: string, option: string) {
    return String(prefix + option);
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }

  saveToPDF() {
    this.configuration$.pipe(takeUntil(this.isDestroyed$)).subscribe(configuration => {
      const configurationData = document.getElementById('configurationData');
      html2canvas(configurationData).then(canvas => {

        console.log(canvas);
        const fileWidth = 208;
        const fileHeight = canvas.height * fileWidth / canvas.width;
        console.log(fileHeight);
        const FILEURI = canvas.toDataURL('image/png');
        const PDF = new jsPDF('p', 'mm', 'a4');
        const position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);

        PDF.save(configuration.name + '.pdf');
      });
    });
  }
}
