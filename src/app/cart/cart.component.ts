import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {CartState} from '../store/cart/cart.state';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {Item} from '../models/item';
import {AddProductToCart, DeleteProductFromCart} from '../store/cart/cart.actions';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  @Select(CartState) cart$: Observable<any>;
  isDestroyed$ = new Subject();
  isLoading = true;
  quantityInCart$ = new BehaviorSubject<number>(0);
  shippingOptions = ['Odbiór własny', 'Wysyłka kurierem', 'Spedycja'];
  shipping: string;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe((data) => {
      let quantityInCart = 0;
      for (const item of data.cart.cartItems) {
        // @ts-ignore
        quantityInCart += item._quantity;
      }
      this.quantityInCart$.next(quantityInCart);
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }

  resize(delta: number, cartItem: Item) {
    // @ts-ignore
    this.store.dispatch(new AddProductToCart(cartItem._product, delta))
      .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
  }

  decreaseQuantity(cartItem: Item) {
    // @ts-ignore
    if (cartItem._quantity === 1) {
      // @ts-ignore
      cartItem._quantity = 1;
    } else {
      this.resize(-1, cartItem);
    }
  }

  increaseQuantity(cartItem: Item) {
    this.resize(+1, cartItem);
  }

  deleteFromCart(cartItem: Item) {
    // @ts-ignore
    this.store.dispatch(new DeleteProductFromCart(cartItem._product))
      .pipe(takeUntil(this.isDestroyed$)).subscribe(console.log);
  }

  setDiscount(discountCode: HTMLInputElement) {
    // TODO kod się przenosi w to miejsce trzeba przygotować obsługę
    console.log(discountCode.value);
  }

  shippingChange() {
    // TODO sposób wysyłki się przenosi w to miejsce trzeba przygotować obsługę
    console.log(this.shipping);
  }

  order() {
    // TODO przygotować proces zamówieniowy
  }
}
