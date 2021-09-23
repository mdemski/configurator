import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SingleConfiguration} from '../../models/single-configuration';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {CrudService} from '../../services/crud-service';
import {DatabaseService} from '../../services/database.service';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {map, takeUntil} from 'rxjs/operators';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-single-configuration-summary',
  templateUrl: './single-configuration-summary.component.html',
  styleUrls: ['./single-configuration-summary.component.scss']
})
export class SingleConfigurationSummaryComponent implements OnInit, OnDestroy {

  @ViewChild('configurationData') configurationData: ElementRef;
  configuration: SingleConfiguration;
  configurationSubject: BehaviorSubject<SingleConfiguration>;
  configuration$: Observable<SingleConfiguration>;
  currentUser;
  uneditable = true;
  loading;
  tempSingleConfig: SingleConfiguration;
  isDestroyed$ = new Subject();

  constructor(private crud: CrudService,
              private db: DatabaseService,
              private authService: AuthService,
              private activeRouter: ActivatedRoute) {
    this.loading = true;
  }

  ngOnInit() {
    this.configurationSubject = new BehaviorSubject<SingleConfiguration>(null);
    this.configuration$ = this.configurationSubject.asObservable();
    this.activeRouter.params.pipe(
      takeUntil(this.isDestroyed$),
      map(param => {
      this.crud.readConfigurationByMongoId(param.configId).pipe(
        takeUntil(this.isDestroyed$),
        map(configuration => {
        this.configuration = configuration;
        this.configurationSubject.next(this.configuration);
        this.loading = false;
      })).subscribe();
    })).subscribe();
  }

  builtNameForTranslation(prefix: string, option: string) {
    return String(prefix + option);
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }

  saveToPDF() {
    const configurationData = document.getElementById('configurationData');
    console.log(configurationData);
    html2canvas(configurationData).then(canvas => {

      console.log(canvas);
      const fileWidth = 208;
      const fileHeight = canvas.height * fileWidth / canvas.width;
      console.log(fileHeight);
      const FILEURI = canvas.toDataURL('image/png');
      const PDF = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);

      PDF.save(this.configuration.name + '.pdf');
    });
  }
}
