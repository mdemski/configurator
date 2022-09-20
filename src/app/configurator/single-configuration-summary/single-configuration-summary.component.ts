import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SingleConfiguration} from '../../models/single-configuration';
import {Observable, Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../../store/app/app.state';
import {ConfigurationState} from '../../store/configuration/configuration.state';
import {RouterState} from '@ngxs/router-plugin';
import {CartState} from '../../store/cart/cart.state';
import {Router} from '@angular/router';
import {PdfDataFormatterService} from '../../services/pdf-data-formatter.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

  constructor(private store: Store, public router: Router, private pdfFormatter: PdfDataFormatterService) {
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

  returnCurrencyName(currency: string) {
    if (currency === 'EUR') {
      return '€';
    } else {
      return 'zł';
    }
  }

  saveToPDF(configuration: SingleConfiguration) {
    const doc = this.pdfFormatter.getDocumentDefinition(configuration);
    pdfMake.createPdf(doc).open();
  }
}
