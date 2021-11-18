import {Injectable} from '@angular/core';
import {Cart} from '../models/cart';
import {Item} from '../models/item';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Flashing} from '../models/flashing';
import {Accessory} from '../models/accessory';
import {FlatRoofWindow} from '../models/flat-roof-window';
import {VerticalWindow} from '../models/vertical-window';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  currency: string;

  constructor(public translate: TranslateService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
    if (translate.currentLang === 'pl') {
      this.currency = 'PLN';
    } else {
      this.currency = 'EUR';
    }
  }

  private static idGenerator() {
    return '' + Math.random().toString(36).substr(2, 9);
  }

  createItem(product: RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow, quantity: number) {
    return new Item(ShoppingCartService.idGenerator(), product, quantity, new Date(), true);
  }

  createCart() {
    return new Cart(ShoppingCartService.idGenerator(), [], new Date().valueOf(), 0, 0, this.currency);
  }

  // TODO czy tutaj potrzebny jest ID Cart???
  addToCart(cart: Cart, product, quantity: number) {
    if (cart.cartItems.length === 0) {
      cart.cartItems.push(this.createItem(product, quantity));
    } else {
      let foundInCart = null;
      for (const cartItem of cart.cartItems) {
        if (product.kod === cartItem.product.kod) {
          foundInCart = cartItem;
        }
      }
      if (foundInCart) {
        const updatedQuantity = foundInCart.quantity + quantity;
        this.updateQuantity(cart, foundInCart, updatedQuantity);
      } else {
        cart.cartItems.push(this.createItem(product, quantity));
      }
    }
    cart.timestamp = new Date().valueOf();
    return cart;
  }

  removeFromCart(cart: Cart, product) {
    for (let cartItem of cart.cartItems) {
      if (cartItem.product.kod === product.kod) {
        const index = cart.cartItems.indexOf(cartItem);
        if (index > -1) {
          cart.cartItems.splice(index, 1);
        }
        cartItem = null;
      }
    }
    cart.timestamp = new Date().valueOf();
    return cart;
  }

  updateQuantity(cart: Cart, item: Item, quantity: number) {
    for (const cartItem of cart.cartItems) {
      if (item.itemId === cartItem.itemId) {
        cartItem.quantity = quantity;
      }
    }
  }

  markUnmarkItemToOrder(cart: Cart, item: Item) {
  }

  deleteCart() {
    return this.createCart();
  }
}
