import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Cart} from '../../models/cart';
import {Company} from '../../models/company';
import {User} from '../../models/user';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {OrderService} from '../../services/order.service';
import {ChangeOrderComment, ChangeOrderStatus, MakeOrder, SetUser, SetUserAndCompany} from './order.actions';
import {tap} from 'rxjs/operators';
import {Order} from '../../models/order';
import cloneDeep from 'lodash/cloneDeep';
import {patch} from '@ngxs/store/operators';
import {Injectable} from '@angular/core';

export interface OrderStateModel {
  orderNumber: string;
  cart: Cart;
  erpId: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  company: Company;
  user: User;
  comments: string;
}

@State<OrderStateModel>({
  name: 'order',
  defaults: {
    orderNumber: '',
    cart: null,
    erpId: '',
    createdAt: null,
    updatedAt: null,
    status: '',
    company: null,
    user: null,
    comments: '',
  }
})
@Injectable()
export class OrderState {
  constructor(private shoppingCart: ShoppingCartService,
              private orderService: OrderService) {
  }

  @Selector()
  static order(state: OrderStateModel) {
    return state;
  }

  @Action(MakeOrder)
  makeOrder(ctx: StateContext<OrderStateModel>, {cart, user, company}: MakeOrder) {
    return this.orderService.makeOrder(cart, user, company).pipe(tap((result: Order) => {
      const state = ctx.getState();
      ctx.setState({
        ...state,
        orderNumber: result.orderNumber,
        cart: result.cart,
        erpId: result.erpId,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        status: result.status,
        company: result.company,
        user: result.user,
        comments: result.comments,
      });
    }));
  }

  @Action(ChangeOrderStatus)
  changeOrderStatus(ctx: StateContext<OrderStateModel>, {status}: ChangeOrderStatus) {
    const updateOrder = cloneDeep(ctx.getState());
    return this.orderService.updateOrderStatus(updateOrder, status).pipe(tap((result: Order) => {
      ctx.setState(
        patch({
          status: result.status
        }));
    }));
  }

  @Action(ChangeOrderComment)
  changeOrderComment(ctx: StateContext<OrderStateModel>, {comment}: ChangeOrderComment) {
    const updateOrder = cloneDeep(ctx.getState());
    return this.orderService.updateOrderComment(updateOrder, comment).pipe(tap((result: Order) => {
      ctx.setState(
        patch({
          comments: result.comments
        }));
    }));
  }

  @Action(SetUser)
  setUser(ctx: StateContext<OrderStateModel>, {user}: SetUser) {
    const updateOrder = cloneDeep(ctx.getState());
    return this.orderService.setUserForOrder(updateOrder, user).pipe(tap((result: Order) => {
      ctx.setState(
        patch({
          user: result.user
        }));
    }));
  }

  @Action(SetUserAndCompany)
  setUserAndCompany(ctx: StateContext<OrderStateModel>, {user, company}: SetUserAndCompany) {
    const updateOrder = cloneDeep(ctx.getState());
    return this.orderService.setUserAndCompanyForOrder(updateOrder, user, company).pipe(tap((result: Order) => {
      ctx.setState(
        patch({
          user: result.user,
          company: result.company
        }));
    }));
  }
}
