import {Injectable} from '@angular/core';
import {Cart} from '../models/cart';
import {Item} from '../models/item';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Flashing} from '../models/flashing';
import {Accessory} from '../models/accessory';
import {FlatRoofWindow} from '../models/flat-roof-window';
import {VerticalWindow} from '../models/vertical-window';
import {TranslateService} from '@ngx-translate/core';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../store/app/app.state';
import {Observable} from 'rxjs';
import {CrudService} from './crud-service';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  @Select(AppState) user$: Observable<{ currentUser }>;
  currency: string;
  currentUser;

  constructor(public translate: TranslateService, private crud: CrudService, private store: Store) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
    if (translate.getBrowserLang() === 'pl') {
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
    return new Cart(ShoppingCartService.idGenerator(), [], new Date().valueOf(), 0, 0, this.currency, true, false);
  }

  // TODO czy tutaj potrzebny jest ID Cart???
  addToCart(cart: Cart, product, quantity: number) {
    if (cart.cartItems.length === 0) {
      cart.cartItems.push(this.createItem(product, quantity));
    } else {
      let foundInCart = null;
      for (const cartItem of cart.cartItems) {
        // @ts-ignore
        if (product.kod === cartItem._product._kod) {
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
      if (cartItem._product._kod === product.kod) {
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
    cart.totalAmount = value;
  }

  calculateTotalAmountAfterDiscount(cart) {
    this.user$.subscribe(user => {
      this.currentUser = user.currentUser;
      if (user.currentUser.isLogged) {
        this.crud.readUserByEmail(user.currentUser.email).subscribe((fullUser: User) => {
          if (this.currentUser.isLogged) {
            cart.totalAmountAfterDiscount = cart.totalAmount - (cart.totalAmount * fullUser.discount);
          } else {
            cart.totalAmountAfterDiscount = cart.totalAmount;
          }
        });
      }
    });
  }
}
