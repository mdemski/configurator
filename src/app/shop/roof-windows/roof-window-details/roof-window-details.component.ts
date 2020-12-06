import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';
import {RoofWindowSkylight} from '../../../models/roof-window-skylight';
import {User} from '../../../models/user';
import {Accessory} from '../../../models/accessory';

@Component({
  selector: 'app-roof-window-details',
  templateUrl: './roof-window-details.component.html',
  styleUrls: ['./roof-window-details.component.css']
})
export class RoofWindowDetailsComponent implements OnInit {
  windowToShow = {} as RoofWindowSkylight;
  picturesOfWindow = [];
  @Input() logInUser: User;
  priceAfterDisc: any;
  availableSizes = ['55x78', '55x98', '66x98', '66x118', '66x140', '78x98', '78x118', '78x140', '78x160', '94x118', '94x140', '94x160', '114x118', '114x140', '134x98'];
  quantity = 1;
  availableExtras: Accessory[] = [];

  constructor(private route: ActivatedRoute,
              private db: DatabaseService) { }

  ngOnInit(): void {
    const windowId = this.route.snapshot.paramMap.get('windowId');
    this.windowToShow = this.db.getWindowById(+windowId);
    this.picturesOfWindow.push('1');
    this.picturesOfWindow.push('2');
    this.picturesOfWindow.push('3');
    this.picturesOfWindow.push('4');
    this.priceAfterDisc = this.getDiscountPrice();
    this.availableExtras.push(this.db.getAccessoryById(9), this.db.getAccessoryById(10));
  }

  getDiscountPrice() {
    if (this.logInUser) {
      return (this.windowToShow.windowPrice - (this.windowToShow.windowPrice * this.logInUser.discount));
    }
  }

  decreaseQuantity() {
    if (this.quantity === 1) {
      return this.quantity;
    } else {
      this.quantity--;
    }
  }


  increaseQuantity() {
    this.quantity++;
  }
}
