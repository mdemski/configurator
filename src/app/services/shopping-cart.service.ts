import {Injectable} from '@angular/core';
import {Cart} from '../models/cart';
import {Item} from '../models/item';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Flashing} from '../models/flashing';
import {Accessory} from '../models/accessory';
import {FlatRoofWindow} from '../models/flat-roof-window';
import {VerticalWindow} from '../models/vertical-window';
import {Select} from '@ngxs/store';
import {AppState} from '../store/app/app.state';
import {Observable} from 'rxjs';
import {CrudService} from './crud-service';
import {User} from '../models/user';
import {skip} from 'rxjs/operators';
import exchange from '../../assets/json/echange.json';
import vatRate from '../../assets/json/vatRates.json';
import {MdTranslateService} from './md-translate.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  @Select(AppState) user$: Observable<{ currentUser }>;
  currency: string;
  private basicDiscount: number;
  private roofWindowsDiscount: number;
  private skylightsDiscount: number;
  private flashingsDiscount: number;
  private accessoriesDiscount: number;
  private flatRoofWindowsDiscount: number;
  private verticalWindowsDiscount: number;
  exchange: number;
  vatRate: number;

  constructor(private translate: MdTranslateService, private crud: CrudService) {
    this.user$.pipe(skip(2)).subscribe(user => {
      this.crud.readUserByEmail(user.currentUser.email).subscribe((fullUser: User) => {
        if (fullUser) {
          this.basicDiscount = fullUser.basicDiscount;
          this.roofWindowsDiscount = fullUser.roofWindowsDiscount;
          this.skylightsDiscount = fullUser.skylightsDiscount;
          this.flashingsDiscount = fullUser.flashingsDiscount;
          this.accessoriesDiscount = fullUser.accessoriesDiscount;
          this.flatRoofWindowsDiscount = fullUser.flatRoofWindowsDiscount;
          this.verticalWindowsDiscount = fullUser.verticalWindowsDiscount;
        } else {
          this.basicDiscount = 0;
          this.roofWindowsDiscount = 0;
          this.skylightsDiscount = 0;
          this.flashingsDiscount = 0;
          this.accessoriesDiscount = 0;
          this.flatRoofWindowsDiscount = 0;
          this.verticalWindowsDiscount = 0;
        }
      });
    });
    translate.setLanguage();
    switch (translate.getBrowserLang()) {
      case 'pl': {
        this.currency = 'PLN';
        this.exchange = exchange.PLN;
        this.vatRate = vatRate.pl;
        break;
      }
      case 'en': {
        this.currency = 'GB';
        this.exchange = exchange.GB;
        this.vatRate = vatRate.en;
        break;
      }
      case 'de': {
        this.currency = 'EUR';
        this.exchange = exchange.EUR;
        this.vatRate = vatRate.de;
        break;
      }
      case 'fr': {
        this.currency = 'EUR';
        this.exchange = exchange.EUR;
        this.vatRate = vatRate.fr;
        break;
      }
    }
  }

  private static idGenerator() {
    return '' + Math.random().toString(36).substr(2, 9);
  }

  createItem(product: RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow, quantity: number) {
    let totalDiscount = 0;
    if (product instanceof RoofWindowSkylight) {
      totalDiscount = this.basicDiscount + this.roofWindowsDiscount;
    }
    if (product instanceof Flashing) {
      totalDiscount = this.basicDiscount + this.flashingsDiscount;
    }
    if (product instanceof FlatRoofWindow) {
      totalDiscount = this.basicDiscount + this.flashingsDiscount;
    }
    if (product instanceof Accessory) {
      totalDiscount = this.basicDiscount + this.accessoriesDiscount;
    }
    if (product instanceof VerticalWindow) {
      totalDiscount = this.basicDiscount + this.verticalWindowsDiscount;
    }
    return new Item(ShoppingCartService.idGenerator(), product, quantity, totalDiscount, new Date(), true);
  }

  createCart() {
    return new Cart(ShoppingCartService.idGenerator(), [], new Date().valueOf(), 0, 0, this.currency, this.exchange, this.vatRate, true, false);
  }

  // Dodawanie i aktualizowanie ilości w koszyku
  // W razie potrzeby przerobić tą metodą podłączając ją do DB
  // - zabezpieczenie aktualizacji koszyka z wielu kart
  addToCart(cart: Cart, product, quantity: number) {
    if (cart.cartItems.length === 0) {
      cart.cartItems.push(this.createItem(product, quantity));
    } else {
      let foundInCart = null;
      for (const cartItem of cart.cartItems) {
        // @ts-ignore
        if (product._kod === cartItem._product._kod) {
          foundInCart = cartItem;
        }
      }
      if (foundInCart) {
        const updatedQuantity = foundInCart._quantity + quantity;
        this.updateQuantity(cart, foundInCart, updatedQuantity);
      } else {
        cart.cartItems.push(this.createItem(product, quantity));
      }
    }
    cart.currency = this.currency;
    cart.vatRate = this.vatRate;
    this.calculateTotalAmounts(cart);
    cart.timestamp = new Date().valueOf();
    return cart;
  }

  removeFromCart(cart: Cart, product) {
    for (let cartItem of cart.cartItems) {
      // @ts-ignore
      if (cartItem._product._kod === product._kod) {
        const index = cart.cartItems.indexOf(cartItem);
        if (index > -1) {
          cart.cartItems.splice(index, 1);
        }
        cartItem = null;
      }
    }
    cart.currency = this.currency;
    this.calculateTotalAmounts(cart);
    cart.timestamp = new Date().valueOf();
    return cart;
  }

  updateQuantity(cart: Cart, item: Item, quantity: number) {
    for (const cartItem of cart.cartItems) {
      // @ts-ignore
      if (item._itemId === cartItem._itemId) {
        // @ts-ignore
        cartItem._quantity = quantity;
      }
    }
  }

  markUnmarkItemToOrder(cart: Cart, item: Item) {
  }

  deleteCart() {
    return this.createCart();
  }

  calculateTotalAmounts(cart) {
    let value = 0;
    let valueAfterDiscount = 0;
    for (const cartItem of cart.cartItems) {
      // @ts-ignore
      value += cartItem._product._CenaDetaliczna * cartItem._quantity;
      if (cartItem._product._grupaAsortymentowa === 'OknoDachowe') {
        valueAfterDiscount += value - (value * (this.roofWindowsDiscount + this.basicDiscount));
      }
      if (cartItem._product._grupaAsortymentowa === 'OknoZintegrowane') {
        valueAfterDiscount += value - (value * (this.roofWindowsDiscount + this.basicDiscount));
      }
      if (cartItem._product._grupaAsortymentowa === 'OknoDachoweReset') {
        valueAfterDiscount += value - (value * (this.roofWindowsDiscount + this.basicDiscount));
      }
      if (cartItem._product._grupaAsortymentowa === 'OknoKolankowe') {
        valueAfterDiscount += value - (value * (this.roofWindowsDiscount + this.basicDiscount));
      }
      if (cartItem._product._grupaAsortymentowa === 'WyłazDachowy') {
        valueAfterDiscount += value - (value * (this.skylightsDiscount + this.basicDiscount));
      }
      if (cartItem._product._grupaAsortymentowa === 'WyłazReset') {
        valueAfterDiscount += value - (value * (this.skylightsDiscount + this.basicDiscount));
      }
      if (cartItem._product._grupaAsortymentowa === 'KołnierzUszczelniający') {
        valueAfterDiscount += value - (value * (this.flashingsDiscount + this.basicDiscount));
      }
      if (cartItem._product._grupaAsortymentowa === 'DachPłaski') {
        valueAfterDiscount += value - (value * (this.flatRoofWindowsDiscount + this.basicDiscount));
      }
      if (cartItem._product._grupaAsortymentowa === 'Akcesorium') {
        valueAfterDiscount += value - (value * (this.accessoriesDiscount + this.basicDiscount));
      }
      if (cartItem._product._grupaAsortymentowa === 'Fasadowe') {
        valueAfterDiscount += value - (value * (this.verticalWindowsDiscount + this.basicDiscount));
      }
    }
    if (cart.currency === 'PLN') {
      cart.totalAmount = value;
      cart.totalAmountAfterDiscount = valueAfterDiscount;
    } else {
      cart.totalAmount = value / this.exchange;
      cart.totalAmountAfterDiscount = valueAfterDiscount / this.exchange;
    }
  }

  changeCurrency(newCurrency: string, cart: Cart) {
    cart.currency = newCurrency;
    this.currency = newCurrency;
    this.exchange = exchange[this.currency];
    cart.exchange = this.exchange;
    this.calculateTotalAmounts(cart);
    cart.timestamp = new Date().valueOf();
    return cart;
  }

  changeVatRate(newVatRate: number, cart: Cart) {
    cart.vatRate = newVatRate;
    this.vatRate = newVatRate;
    return cart;
  }
}
