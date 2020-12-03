import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DatabaseService} from '../services/database.service';
import {Company} from '../models/company';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // TODO przekazać tutaj id z zalogowanego użytkownika
  // TODO POŁĄCZYĆ SASSA Z BEMEM SKRÓCENIE PISANIA KODU - PATRZ KURS
  id: any;
  mostRecentProducts: any = [];
  availableSellers: any = [];
  // TODO przygotować koszyk przetrzymujący dodawane z całej aplikacji produkty
  @Input() cart: any;

  constructor(public translate: TranslateService,
              public db: DatabaseService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  ngOnInit(): void {
    this.mostRecentProducts = this.db.getMostRecentProductsHomePage();
    this.availableSellers = this.db.getAllSellers();
  }

  addToCart(product: any) {
    this.cart.add(product);
  }

  getAvailableSellers() {

  }
}
