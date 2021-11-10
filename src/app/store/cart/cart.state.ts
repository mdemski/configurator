import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Cart} from '../../models/cart';
import {AddProductToCart, DeleteCart, DeleteProductFromCart, GetCart} from './cart.actions';
import {ShoppingCartService} from '../../services/shopping-cart.service';

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
  constructor(private shoppingCart: ShoppingCartService) {
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

  @Action(AddProductToCart)
  addProductToCart(ctx: StateContext<CartStateModel>, {product, quantity}: AddProductToCart) {
    const newCart = this.shoppingCart.addToCart(product, quantity);
    this.shoppingCart.updateCartIntoLocalStorage(newCart);
    const state = ctx.getState();
    ctx.setState({
      ...state,
      cart: newCart
    });
  }

  @Action(DeleteProductFromCart)
  deleteProductFromCart(ctx: StateContext<CartStateModel>, {product}: DeleteProductFromCart) {
    const newCart = this.shoppingCart.removeFromCart(product);
    this.shoppingCart.updateCartIntoLocalStorage(newCart);
    const state = ctx.getState();
    ctx.setState({
      ...state,
      cart: newCart
    });
  }

  @Action(GetCart)
  getCartItems(ctx: StateContext<CartStateModel>) {
    const cart = this.shoppingCart.getCartFromLocalStorage();
    const state = ctx.getState();
    ctx.setState({
      ...state,
      cart
    });
  }

  @Action(DeleteCart)
  deleteCart(ctx: StateContext<CartStateModel>) {
    const cart = this.shoppingCart.deleteCart();
    this.shoppingCart.updateCartIntoLocalStorage(cart);
    const state = ctx.getState();
    ctx.setState({
      ...state,
      cart
    });
  }
}
