import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import advices from '../../../assets/json/advices.json';
import {Advice} from '../../models/advice';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-video-advice',
  templateUrl: './video-advice.component.html',
  styleUrls: ['./video-advice.component.scss']
})
export class VideoAdviceComponent implements OnInit, OnDestroy {

  isLoading = true;
  advice: Advice;
  videoId: string;
  private isDestroyed$ = new Subject();

  constructor(public router: Router, private route: ActivatedRoute) {
    this.advice = advices.find(advice => this.route.snapshot.paramMap.get('adviceId') === advice.id) as any;
    this.videoId = this.advice.link.split('/')[this.advice.link.split('/').length - 1];
  }

  ngOnInit(): void {
    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
  }

}
