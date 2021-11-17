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

  private static idGenerator() {
    return '' + Math.random().toString(36).substr(2, 9);
  }

  createItem(product: RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow, quantity: number) {
    return new Item(ShoppingCartService.idGenerator(), product, quantity, new Date(), true);
  }

  // TODO czy tutaj potrzebny jest ID Cart???
  addToCart(product, quantity: number) {
    this.cart = new Cart(ShoppingCartService.idGenerator(), [], new Date(), 0, 0, 'PLN');
    if (this.cart.cartItems.length === 0) {
      this.cart.currency = 'EUR';
      const pro = this.createItem(product, quantity);
      this.cart.cartItems.push(pro);
    } else {
      let foundInCart = null;
      for (const cartItem of this.cart.cartItems) {
        if (product.kod === cartItem.product.kod) {
          foundInCart = cartItem;
        }
      }
      if (foundInCart) {
        const updatedQuantity = foundInCart.quantity + quantity;
        this.updateQuantity(foundInCart, updatedQuantity);
      } else {
        this.cart.cartItems.push(this.createItem(product, quantity));
      }
    }
    return this.cart;
  }

  removeFromCart(product) {
    for (let cartItem of this.cart.cartItems) {
      if (cartItem.product.kod === product.kod) {
        const index = this.cart.cartItems.indexOf(cartItem);
        if (index > -1) {
          this.cart.cartItems.splice(index, 1);
        }
        cartItem = null;
      }
    }
    return this.cart;
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
    this.cart = new Cart(ShoppingCartService.idGenerator(), [], new Date(), 0, 0, 'PLN');
    return this.cart;
  }

  updateCartIntoLocalStorage(cart: Cart) {
    if (cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  getCartFromLocalStorage() {
    this.cart = JSON.parse(localStorage.getItem('cart')) as Cart;
    if (this.cart === null) {
      this.cart = new Cart(ShoppingCartService.idGenerator(), [], new Date(), 0, 0, 'PLN');
    }
    return this.cart;
  }
}
