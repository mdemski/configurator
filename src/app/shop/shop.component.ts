import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  // TODO dodać linki na stronę w headerze
  urls = ['strona główna'];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.urls.push(this.router.url.split('/', 2)[1]);
    console.log(this.urls);
  }

}
