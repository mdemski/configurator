import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-advices',
  templateUrl: './advices.component.html',
  styleUrls: ['./advices.component.scss']
})
export class AdvicesComponent implements OnInit, OnDestroy {

  private isDestroyed;
  isLoading = true;
  searchAdvice: string;
  advices: any[];
  filteredAdvices: any[];

  constructor(public router: Router) {
    this.searchAdvice = '';
  }

  ngOnInit(): void {
    this.advices = [];
    this.filteredAdvices = this.advices;
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.isDestroyed.next();
  }

  filtering() {
    console.log(this.searchAdvice);
  }
}
