import {Component, OnDestroy, OnInit} from '@angular/core';
import {Advice} from '../../models/advice';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import advices from '../../../assets/json/advices.json';

@Component({
  selector: 'app-text-advice',
  templateUrl: './text-advice.component.html',
  styleUrls: ['./text-advice.component.scss']
})
export class TextAdviceComponent implements OnInit, OnDestroy {

  isLoading = true;
  advice: Advice;
  private isDestroyed$ = new Subject();

  constructor(public router: Router, private route: ActivatedRoute) {
    this.advice = advices.find(advice => this.route.snapshot.paramMap.get('adviceId') === advice.id) as any;
  }

  ngOnInit(): void {
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
  }

}
