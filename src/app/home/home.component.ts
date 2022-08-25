import {Component, Input, OnInit} from '@angular/core';
import {DatabaseService} from '../services/database.service';
import {MdTranslateService} from '../services/md-translate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // TODO przekazać tutaj id z zalogowanego użytkownika
  // TODO Sprawdzić wszystkie linki na stronie czy mają ścieżki
  id: any;
  mostRecentProducts: any = [];
  availableSellers: any = [];
  activeClass1 = '';
  activeClass2 = '';
  activeClass3 = '';
  activeClass4 = '';
  // TODO przygotować koszyk przetrzymujący dodawane z całej aplikacji produkty
  @Input() cart: any;

  constructor(private translate: MdTranslateService,
              private db: DatabaseService) {
    translate.setLanguage();
  }

  ngOnInit(): void {
    // TODO dodać do stanu i wczytywać z niego obie poniższe
    this.mostRecentProducts = this.db.getMostRecentProductsHomePage();
    this.availableSellers = this.db.getAllSellers();
  }

  addToCart(product: any) {
    this.cart.add(product);
  }

  getAvailableSellers() {

  }

  setActive1() {
    this.activeClass1 = 'active';
    this.activeClass2 = '';
    this.activeClass3 = '';
    this.activeClass4 = '';
  }

  setActive2() {
    this.activeClass1 = '';
    this.activeClass2 = 'active';
    this.activeClass3 = '';
    this.activeClass4 = '';
  }

  setActive3() {
    this.activeClass1 = '';
    this.activeClass2 = '';
    this.activeClass3 = 'active';
    this.activeClass4 = '';
  }

  setActive4() {
    this.activeClass1 = '';
    this.activeClass2 = '';
    this.activeClass3 = '';
    this.activeClass4 = 'active';
  }
}
