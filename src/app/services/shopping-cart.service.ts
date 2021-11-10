import {Injectable} from '@angular/core';
import {Cart} from '../models/cart';
import {Item} from '../models/item';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Flashing} from '../models/flashing';
import {Accessory} from '../models/accessory';
import {FlatRoofWindow} from '../models/flat-roof-window';
import {VerticalWindow} from '../models/vertical-window';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  cart: Cart;

  constructor() {
    this.cart = new Cart('Autogenerate', [], new Date(), 0, 0, 'PLN');
  }

  createItem(product: RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow, quantity: number) {
    return new Item('Autogenerate', product, quantity, new Date(), true);
  }

  // TODO czy tutaj potrzebny jest ID Cart???
  addToCart(product, quantity: number) {
    for (const cartItem of this.cart.cartItems) {
      // @ts-ignore
      if (product.kod === cartItem.product.kod) {
        this.updateQuantity(cartItem, quantity);
      } else {
        this.cart.cartItems.push(this.createItem(product, quantity));
      }
    }
  }

  removeFromCart(product) {
    for (let cartItem of this.cart.cartItems) {
      // @ts-ignore
      if (cartItem.product.kod === product.kod) {
        const index = this.cart.cartItems.indexOf(cartItem);
        if (index > -1) {
          this.cart.cartItems.splice(index, 1);
        }
        cartItem = null;
      }
    }
  }

  updateQuantity(item: Item, quantity: number) {
    for (const cartItem of this.cart.cartItems) {
      if (item.itemId === cartItem.itemId) {
        cartItem.quantity = quantity;
      }
    }
  }

  markUnmarkItemToOrder(item: Item) {
  }

  deleteCart() {
    this.cart = new Cart('Autogenerate', [], new Date(), 0, 0, 'PLN');
    this.updateCartIntoLocalStorage(this.cart);
  }

  updateCartIntoLocalStorage(cart: Cart) {
    if (cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  getCartFromLocalStorage() {
    return localStorage.getItem('cart');
  }
}
