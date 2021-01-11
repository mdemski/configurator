import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';
import {RoofWindowSkylight} from '../../../models/roof-window-skylight';
import {User} from '../../../models/user';
import {Accessory} from '../../../models/accessory';

@Component({
  selector: 'app-roof-window-details',
  templateUrl: './roof-window-details.component.html',
  styleUrls: ['./roof-window-details.component.scss']
})
export class RoofWindowDetailsComponent implements OnInit {
  windowToShow: RoofWindowSkylight;
  picturesOfWindow = [];
  windowMaterial: string;
  windowVent: string;
  windowHandle: string;
  @Input() logInUser: User;
  priceAfterDisc: any;
  glazing: string;
  availableSizes = ['55x78', '55x98', '66x98', '66x118', '66x140', '78x98', '78x118', '78x140', '78x160', '94x118', '94x140', '94x160', '114x118', '114x140', '134x98'];
  quantity = 1;
  availableExtras: Accessory[] = [];

  constructor(private router: ActivatedRoute,
              private db: DatabaseService) {
  }

  ngOnInit(): void {
    this.router.params.subscribe(param => {
      this.windowToShow = this.db.getWindowById(param['windowId']);
    });
    this.picturesOfWindow.push('assets/img/products/ISO-I22.png');
    this.picturesOfWindow.push('assets/img/products/ISO-arrangement-1.png');
    this.picturesOfWindow.push('assets/img/products/ISO-arrangement-2.png');
    this.priceAfterDisc = this.getDiscountPrice();
    this.availableExtras.push(this.db.getAccessoryById(1), this.db.getAccessoryById(2));
    this.windowMaterial = this.windowToShow.windowMaterial;
    this.windowVent = this.windowToShow.windowVentilation;
    this.windowHandle = this.windowToShow.windowHandleType;
    if (this.windowToShow.windowGlazing.toLowerCase().startsWith('e')) {
      this.glazing = 'doubleGlazing';
    } else {
      this.glazing = 'tripleGlazing';
    }
  }

  getDiscountPrice() {
    if (this.logInUser) {
      return (this.windowToShow.windowPrice - (this.windowToShow.windowPrice * this.logInUser.discount));
    }
  }

  resize(delta: number) {
    this.quantity = this.quantity + delta;
  }

  decreaseQuantity() {
    if (this.quantity === 1) {
      this.quantity = 1;
    } else {
      this.resize(-1);
    }
  }

  increaseQuantity() {
    this.resize(+1);
  }

  addToCart(quantity: number) {
    this.db.addToCart(this.windowToShow, quantity);
  }

  order(quantity: number) {
    this.db.order(this.windowToShow, quantity);
  }
}
