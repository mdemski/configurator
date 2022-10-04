import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Advice} from '../models/advice';
import advices from '../../assets/json/advices.json';
import moment from 'moment';
import {MdTranslateService} from '../services/md-translate.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-advices',
  templateUrl: './advices.component.html',
  styleUrls: ['./advices.component.scss']
})
export class AdvicesComponent implements OnInit, OnDestroy {

  private isDestroyed$ = new Subject();
  isLoading = true;
  searchAdvice: string;
  advices: Advice[];
  filteredAdvices: Advice[];
  currentDate = moment(new Date());

  constructor(public router: Router, private translate: MdTranslateService, private route: ActivatedRoute) {
    this.advices = [];
    this.searchAdvice = '';
    for (const advice of advices) {
      if (this.translate.getBrowserLang() === advice.language && advice.active === 'true') {
        const chapters: {sectionHeader: string, sectionText: string}[] = [];
        for (const chapter of advice.content) {
          const newChapter = {
            sectionHeader: chapter.sectionHeader,
            sectionText: chapter.sectionText
          };
          chapters.push(newChapter);
        }
        this.advices.push(new Advice(advice.id, advice.title, advice.type, chapters, advice.category, advice.picture, advice.link,
          new Date(advice.added), advice.short, advice.recipients, Boolean(advice.active), advice.language));
      }
    }
    this.filteredAdvices = this.advices;
    if (this.route.snapshot.paramMap.get('searchInput') !== null) {
      this.searchAdvice = this.route.snapshot.paramMap.get('searchInput');
      this.filtering();
    }
  }

  ngOnInit(): void {
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
  }

  filtering() {
    this.filteredAdvices = this.advices;
    this.filteredAdvices = this.filteredAdvices.filter(advice => {
      return advice.short.toString().trim().toLocaleLowerCase().indexOf(this.searchAdvice.toLocaleLowerCase()) !== -1 ||
        advice.content.toString().trim().toLocaleLowerCase().indexOf(this.searchAdvice.toLocaleLowerCase()) !== -1 ||
        advice.title.toString().trim().toLocaleLowerCase().indexOf(this.searchAdvice.toLocaleLowerCase()) !== -1 ||
        advice.category.toString().trim().toLocaleLowerCase().indexOf(this.searchAdvice.toLocaleLowerCase()) !== -1;
    });
  }

  durationCalc(advice) {
    return moment.duration(this.currentDate.diff(moment(advice.added))).days();
  }
}
