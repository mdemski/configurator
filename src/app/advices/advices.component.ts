import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Advice} from '../models/advice';
import advices from '../../assets/json/advices.json';
import moment from 'moment';
import {MdTranslateService} from '../services/md-translate.service';

@Component({
  selector: 'app-advices',
  templateUrl: './advices.component.html',
  styleUrls: ['./advices.component.scss']
})
export class AdvicesComponent implements OnInit, OnDestroy {

  private isDestroyed$;
  isLoading = true;
  searchAdvice: string;
  advices: Advice[];
  filteredAdvices: Advice[];
  currentDate = moment(new Date());

  constructor(public router: Router, private translate: MdTranslateService) {
    this.advices = [];
    for (const advice of advices) {
      if (this.translate.getBrowserLang() === advice.language) {
        this.advices.push(new Advice(advice.id, advice.title, advice.type, advice.content, advice.category, advice.picture, advice.link,
          new Date(advice.added), advice.short, advice.recipients, Boolean(advice.active), advice.language));
      }
    }
    this.filteredAdvices = this.advices;
  }

  ngOnInit(): void {
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
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
