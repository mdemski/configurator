import {Injectable} from '@angular/core';
import {Cart} from '../models/cart';
import {Item} from '../models/item';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Flashing} from '../models/flashing';
import {Accessory} from '../models/accessory';
import {FlatRoofWindow} from '../models/flat-roof-window';
import {VerticalWindow} from '../models/vertical-window';
import {TranslateService} from '@ngx-translate/core';
import {Select} from '@ngxs/store';
import {AppState} from '../store/app/app.state';
import {Observable} from 'rxjs';
import {CrudService} from './crud-service';
import {User} from '../models/user';
import {skip} from 'rxjs/operators';
import exchange from '../../assets/json/echange.json';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  @Select(AppState) user$: Observable<{ currentUser }>;
  currency: string;
  discount;
  exchange: number;

  constructor(public translate: TranslateService, private crud: CrudService) {
    this.user$.pipe(skip(2)).subscribe(user => {
      this.crud.readUserByEmail(user.currentUser.email).subscribe((fullUser: User) => {
        this.discount = fullUser.discount;
      });
    });
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
    if (translate.getBrowserLang() === 'pl') {
      this.currency = 'PLN';
      this.exchange = 1;
    } else {
      this.currency = 'EUR';
      this.exchange = exchange.EUR;
    }
  }

  private static idGenerator() {
    return '' + Math.random().toString(36).substr(2, 9);
  }

  createItem(product: RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow, quantity: number) {
    return new Item(ShoppingCartService.idGenerator(), product, quantity, this.discount, new Date(), true);
  }

  createCart() {
    return new Cart(ShoppingCartService.idGenerator(), [], new Date().valueOf(), 0, 0, this.currency, true, false);
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
    this.calculateTotalAmount(cart);
    this.calculateTotalAmountAfterDiscount(cart);
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
    this.calculateTotalAmount(cart);
    this.calculateTotalAmountAfterDiscount(cart);
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

  calculateTotalAmount(cart) {
    let value = 0;
    for (const cartItem of cart.cartItems) {
      // @ts-ignore
      value += cartItem._product._CenaDetaliczna * cartItem._quantity;
    }
    if (cart.currency === 'PLN') {
      cart.totalAmount = value;
    } else {
      cart.totalAmount = value / this.exchange;
    }
  }

  calculateTotalAmountAfterDiscount(cart) {
    if (this.discount > 0) {
      cart.totalAmountAfterDiscount = cart.totalAmount - (cart.totalAmount * this.discount);
    } else {
      cart.totalAmountAfterDiscount = cart.totalAmount;
    }
  }

  changeCurrency(newCurrency: string, cart: Cart) {
    cart.currency = newCurrency;
    this.currency = newCurrency;
    this.calculateTotalAmount(cart);
    this.calculateTotalAmountAfterDiscount(cart);
    cart.timestamp = new Date().valueOf();
    return cart;
  }
}
