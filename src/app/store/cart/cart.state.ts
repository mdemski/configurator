import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Cart} from '../../models/cart';
import {AddProductToCart, DeleteCart, DeleteProductFromCart, GetCart} from './cart.actions';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {CookieService} from '../../services/cookie.service';
import {CrudService} from '../../services/crud-service';
import {tap} from 'rxjs/operators';

export interface CartStateModel {
  cart: Cart;
}

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    cart: null
  }
})
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
      return state.cart.cartItems.find(item => item.product.kod === productCode);
    };
  }

  @Action(GetCart)
  getCartItems(ctx: StateContext<CartStateModel>) {
    const cartId = this.cookie.getCookie('trac');
    console.log(cartId);
    if (cartId) {
      console.log('True cartId');
      return this.crud.readCartByMongoId(cartId).pipe(tap((cart: Cart) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          cart
        });
      }));
    } else {
      console.log('False cartId');
      const newCart = this.shoppingCart.createCart();
      return this.crud.createCart(newCart).pipe(tap((cart: Cart) => {
        this.cookie.setCookie('trac', cart._id);
        const state = ctx.getState();
        ctx.setState({
          ...state,
          cart
        });
      }));
    }
  }

  @Action(AddProductToCart)
  addProductToCart(ctx: StateContext<CartStateModel>, {product, quantity}: AddProductToCart) {
    const state = ctx.getState();
    const updatedCart = this.shoppingCart.addToCart(state.cart, product, quantity);
    return this.crud.updateCart(updatedCart).pipe(tap((cart: Cart) => {
      ctx.setState({
        ...state,
        cart
      });
    }));
  }

  @Action(DeleteProductFromCart)
  deleteProductFromCart(ctx: StateContext<CartStateModel>, {product}: DeleteProductFromCart) {
    const state = ctx.getState();
    const updatedCart = this.shoppingCart.removeFromCart(state.cart, product);
    return this.crud.updateCart(updatedCart).pipe(tap((cart: Cart) => {
      ctx.setState({
        ...state,
        cart
      });
    }));
  }

  @Action(DeleteCart)
  deleteCart(ctx: StateContext<CartStateModel>) {
    const state = ctx.getState();
    return this.crud.deleteCart(state.cart).pipe(tap((cart: Cart) => {
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
