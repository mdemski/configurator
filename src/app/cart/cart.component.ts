import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  value = 0;

  constructor() { }

  ngOnInit(): void {
    this.value = 179.58;
  }

}
