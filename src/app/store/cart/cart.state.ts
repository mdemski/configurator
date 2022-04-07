import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Cart} from '../../models/cart';
import {AddProductToCart, DeleteCart, DeleteProductFromCart, GetCart, UpdateCartCurrency, UpdateCartVatRate} from './cart.actions';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {CookieService} from '../../services/cookie.service';
import {CrudService} from '../../services/crud-service';
import {tap} from 'rxjs/operators';
import cloneDeep from 'lodash/cloneDeep';
import {Injectable} from '@angular/core';

export interface CartStateModel {
  cart: Cart;
}

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    cart: null
  }
})
@Injectable()
export class CartState {
  constructor(private shoppingCart: ShoppingCartService,
              private crud: CrudService,
              private cookie: CookieService) {
  }

  @Selector()
  static cart(state: CartStateModel) {
    return state.cart;
  }

  @Selector()
  static cartItemByProduct(state: CartStateModel) {
    return (productCode: string) => {
      // @ts-ignore
      return state.cart.cartItems.find(item => item._product._kod === productCode);
    };
  }

  @Action(GetCart)
  getCartItems(ctx: StateContext<CartStateModel>) {
    const cartId = this.cookie.getCookie('trac');
    if (cartId !== undefined) {
      return this.crud.readCartByMongoId(cartId).pipe(tap((cart: Cart) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          cart
        });
      }));
    } else {
      const newCart = this.shoppingCart.createCart();
      return this.crud.createCart(newCart).pipe(tap((cart: { cartId: string }) => {
        this.cookie.setCookie('trac', cart.cartId);
        const state = ctx.getState();
        ctx.setState({
          ...state,
          cart: newCart
        });
      }));
    }
  }

  @Action(AddProductToCart)
  addProductToCart(ctx: StateContext<CartStateModel>, {product, quantity}: AddProductToCart) {
    const state = ctx.getState();
    const updatedCart = cloneDeep(state.cart);
    const cartAfter = this.shoppingCart.addToCart(updatedCart, product, quantity);
    return this.crud.updateCart(cartAfter).pipe(tap(() => {
      ctx.setState({
        ...state,
        cart: cartAfter
      });
    }));
  }

  @Action(UpdateCartCurrency)
  updateCurrencyInCart(ctx: StateContext<CartStateModel>, {currency}: UpdateCartCurrency) {
    const state = ctx.getState();
    const updatedCart = cloneDeep(state.cart);
    const cartAfter = this.shoppingCart.changeCurrency(currency, updatedCart);
    return this.crud.updateCart(cartAfter).pipe(tap(() => {
      ctx.setState({
        ...state,
        cart: cartAfter
      });
    }));
  }

  @Action(UpdateCartVatRate)
  updateVarRateInCart(ctx: StateContext<CartStateModel>, {vatRate}: UpdateCartVatRate) {
    const state = ctx.getState();
    const updatedCart = cloneDeep(state.cart);
    const cartAfter = this.shoppingCart.changeVatRate(vatRate, updatedCart);
    return this.crud.updateCart(cartAfter).pipe(tap(() => {
      ctx.setState({
        ...state,
        cart: cartAfter
      });
    }));
  }

  @Action(DeleteProductFromCart)
  deleteProductFromCart(ctx: StateContext<CartStateModel>, {product}: DeleteProductFromCart) {
    const state = ctx.getState();
    const updatedCart = cloneDeep(state.cart);
    const cartAfter = this.shoppingCart.removeFromCart(updatedCart, product);
    return this.crud.updateCart(cartAfter).pipe(tap(() => {
      ctx.setState({
        ...state,
        cart: cartAfter
      });
    }));
  }

  @Action(DeleteCart)
  deleteCart(ctx: StateContext<CartStateModel>) {
    const state = ctx.getState();
    const updatedCart = cloneDeep(state.cart);
    return this.crud.deleteCart(updatedCart).pipe(tap(() => {
      const newCart = this.shoppingCart.deleteCart();
      return this.crud.createCart(newCart).pipe(tap((createdCart: Cart) => {
        this.cookie.setCookie('trac', createdCart._id);
        ctx.setState({
          ...state,
          cart: createdCart
        });
      }));
    }));
  }
}
