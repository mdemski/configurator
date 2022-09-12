import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SingleConfiguration} from '../../models/single-configuration';
import {Observable, Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../../store/app/app.state';
import {ConfigurationState} from '../../store/configuration/configuration.state';
import {RouterState} from '@ngxs/router-plugin';
import {CartState} from '../../store/cart/cart.state';
import {Router} from '@angular/router';

@Component({
  selector: 'app-single-configuration-summary',
  templateUrl: './single-configuration-summary.component.html',
  styleUrls: ['./single-configuration-summary.component.scss']
})
export class SingleConfigurationSummaryComponent implements OnInit, OnDestroy {

  @Select(AppState) user$: Observable<{ currentUser }>;
  @Select(RouterState) params$: Observable<any>;
  @Select(ConfigurationState.configurationByGlobalID) configurations$: Observable<SingleConfiguration[]>;
  @Select(CartState) cart$: Observable<any>;
  @ViewChild('configurationData') configurationData: ElementRef;
  private configurations: SingleConfiguration[];
  private routerParams;
  configuration$: Observable<SingleConfiguration>;
  currentUser;
  uneditable = true;
  loading;
  isDestroyed$ = new Subject();

  constructor(private store: Store, public router: Router) {
    this.loading = true;
    this.params$.pipe(takeUntil(this.isDestroyed$)).subscribe(params => this.routerParams = params);
  }

  ngOnInit() {
    this.configuration$ = this.store.select(ConfigurationState.configurationByGlobalID)
      .pipe(map(filterFn => filterFn(this.routerParams.state.params.configId)));
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
    this.loading = false;
  }

  builtNameForTranslation(prefix: string, option: string) {
    return String(prefix + option);
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
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

  returnCurrencyName(currency: string) {
    if (currency === 'EUR') {
      return '€';
    } else {
      return 'zł';
    }
  }
}
