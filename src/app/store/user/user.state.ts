import {Address} from '../../models/address';
import {Company} from '../../models/company';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {CrudService} from '../../services/crud-service';
import {
  AddFavoriteProductsForUser,
  DeleteUser,
  GetUserData, RemoveFavoriteProductsForUser,
  SetCompanyUserForUser,
  SetUserMainAddress,
  SetUserMainAndToSendSameAddress,
  SetUserToSendAddress,
  UpdateDiscountForUser,
  UpdateUserData,
  UpdateUserMainAddress,
  UpdateUserToSendAddress
} from './user.actions';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {User} from '../../models/user';
import cloneDeep from 'lodash/cloneDeep';
import {of} from 'rxjs';
import {append, patch, removeItem} from '@ngxs/store/operators';
import { Injectable } from '@angular/core';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {Flashing} from '../../models/flashing';
import {FlatRoofWindow} from '../../models/flat-roof-window';
import {Accessory} from '../../models/accessory';
import {VerticalWindow} from '../../models/vertical-window';

export interface UserStateModel {
  _id: string;
  email: string;
  name: string;
  activated: boolean;
  basicDiscount: number;
  roofWindowsDiscount: number;
  skylightsDiscount: number;
  flashingsDiscount: number;
  accessoriesDiscount: number;
  flatRoofWindowsDiscount: number;
  verticalWindowsDiscount: number;
  companyNip: string;
  company: Company;
  address: Address;
  preferredLanguage: string;
  favoriteProducts: (RoofWindowSkylight | Flashing | FlatRoofWindow | Accessory | VerticalWindow)[];
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    _id: '',
    email: '',
    name: '',
    activated: false,
    basicDiscount: 0,
    roofWindowsDiscount: 0,
    skylightsDiscount: 0,
    flashingsDiscount: 0,
    accessoriesDiscount: 0,
    flatRoofWindowsDiscount: 0,
    verticalWindowsDiscount: 0,
    companyNip: '',
    company: null,
    address: null,
    preferredLanguage: '',
    favoriteProducts: []
  }
})
@Injectable()
export class UserState {
  constructor(private crud: CrudService) {
  }

  @Selector()
  static user(state: UserStateModel) {
    return state;
  }

  @Action(GetUserData)
  getUser(ctx: StateContext<UserStateModel>, {email, isLogged}: GetUserData) {
    if (isLogged) {
      return this.crud.readUserByEmail(email).pipe(
        filter(user => user !== null),
        switchMap((user: User) => {
          if ((user.mainAddressId === '' || user.mainAddressId === null)) {
            return of([user, null]);
          } else {
            return this.crud.readAddressByMongoId(user.mainAddressId).pipe(map(address => [user, address]));
          }
        }),
        switchMap((values: any[]) => {
          if (values[0].companyNip === null || values[0].companyNip === '') {
            return of([values[0], values[1], null]);
          } else {
            // TODO odkomentować ten fragment po przygotowaniu API z enova
            return this.crud.readCompanyByNIP(values[0].companyNip).pipe(map(company => [values[0], values[1], company]));
          }
        }),
        map((values: any[]) => {
          const user: User = values[0];
          const address: Address = values[1];
          const company: Company = values[2];
          const state = ctx.getState();
          const updateState = cloneDeep(state);
          updateState._id = user._id;
          updateState.email = user.email;
          updateState.name = user.name;
          updateState.activated = user.activated;
          updateState.basicDiscount = user.basicDiscount;
          updateState.roofWindowsDiscount = user.roofWindowsDiscount;
          updateState.flashingsDiscount = user.flashingsDiscount;
          updateState.accessoriesDiscount = user.accessoriesDiscount;
          updateState.skylightsDiscount = user.skylightsDiscount;
          updateState.flatRoofWindowsDiscount = user.flatRoofWindowsDiscount;
          updateState.verticalWindowsDiscount = user.verticalWindowsDiscount;
          updateState.companyNip = user.companyNip;
          updateState.address = address;
          updateState.company = company;
          updateState.preferredLanguage = user.preferredLanguage;
          updateState.favoriteProducts = user.favoriteProducts;
          ctx.setState({
            ...state,
            _id: updateState._id,
            email: updateState.email,
            name: updateState.name,
            activated: updateState.activated,
            basicDiscount: updateState.basicDiscount,
            roofWindowsDiscount: updateState.roofWindowsDiscount,
            flashingsDiscount: updateState.flashingsDiscount,
            accessoriesDiscount: updateState.accessoriesDiscount,
            skylightsDiscount: updateState.skylightsDiscount,
            flatRoofWindowsDiscount: updateState.flatRoofWindowsDiscount,
            verticalWindowsDiscount: updateState.verticalWindowsDiscount,
            companyNip: updateState.companyNip,
            company: updateState.company,
            address: updateState.address,
            preferredLanguage: updateState.preferredLanguage,
            favoriteProducts: updateState.favoriteProducts
          });
        }));
    }
  }

  @Action(UpdateUserData)
  updateUserData(ctx: StateContext<UserStateModel>, {user}: UpdateUserData) {
    return this.crud.updateUserByMongoId(user).pipe(tap((updatedUser: User) => {
      ctx.setState(
        patch({
          _id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          activated: updatedUser.activated,
          basicDiscount: updatedUser.basicDiscount,
          roofWindowsDiscount: updatedUser.roofWindowsDiscount,
          flashingsDiscount: updatedUser.flashingsDiscount,
          accessoriesDiscount: updatedUser.accessoriesDiscount,
          skylightsDiscount: updatedUser.skylightsDiscount,
          flatRoofWindowsDiscount: updatedUser.flatRoofWindowsDiscount,
          verticalWindowsDiscount: updatedUser.verticalWindowsDiscount,
          companyNip: updatedUser.companyNip,
          preferredLanguage: updatedUser.preferredLanguage,
          favoriteProducts: updatedUser.favoriteProducts
        }));
    }));
  }

  @Action(UpdateDiscountForUser)
  updateDiscountForUser(ctx: StateContext<UserStateModel>, {user, discount, code}: UpdateDiscountForUser) {
    return this.crud.setDiscountForIndividualUser(user, discount, null, code).pipe(tap((result: User) => {
      ctx.setState(
        patch({
          basicDiscount: result.basicDiscount
        }));
    }));
  }

  @Action(AddFavoriteProductsForUser)
  addFavoriteProductsForUser(ctx: StateContext<UserStateModel>, {user, favoriteProducts}: AddFavoriteProductsForUser) {
    return this.crud.addFavoriteProductsForUser(user, favoriteProducts).pipe(tap((result: User) => {
      console.log(result);
      ctx.setState(
        patch({
          favoriteProducts: result.favoriteProducts
        }));
    }));
  }

  @Action(RemoveFavoriteProductsForUser)
  removeFavoriteProductsForUser(ctx: StateContext<UserStateModel>, {user, favoriteProduct}: RemoveFavoriteProductsForUser) {
    return this.crud.removeFavoriteProductForUser(user, favoriteProduct).pipe(tap((result: User) => {
      ctx.setState(
        patch({
          favoriteProducts: removeItem(favoriteProduct)
        }));
    }));
  }

  @Action(SetUserMainAddress)
  setMainAddressForUser(ctx: StateContext<UserStateModel>, {user, address}: SetUserMainAddress) {
    return this.crud.setUserMainAddressByMongoId(user, address).pipe(tap((result: User) => {
      this.crud.readAddressByMongoId(result.mainAddressId).subscribe(addressAfter => {
        ctx.setState(
          patch({
            address: addressAfter
          }));
      });
    }));
  }

  @Action(SetUserToSendAddress)
  setUserToSendAddress(ctx: StateContext<UserStateModel>, {user, address}: SetUserMainAddress) {
    return this.crud.setAddressToSendForUser(user, address).pipe(tap(() => console.log));
  }

  @Action(SetUserMainAndToSendSameAddress)
  setUserMainAndToSendSameAddress(ctx: StateContext<UserStateModel>, {user, address}: SetUserMainAndToSendSameAddress) {
    return this.crud.setUserMainAndToSendAddressByMongoId(user, address).pipe(tap((result: User) => {
      this.crud.readAddressByMongoId(result.mainAddressId).subscribe(addressAfter => {
        ctx.setState(
          patch({
            address: addressAfter
          }));
      });
    }));
  }

  @Action(UpdateUserMainAddress)
  updateUserMainAddress(ctx: StateContext<UserStateModel>, {user, address}: UpdateUserMainAddress) {
    return this.crud.updateMainAddressByMongoId(user, address).pipe(tap(result => {
      ctx.setState(
        patch({
          address: result
        })
      );
    }));
  }

  @Action(UpdateUserToSendAddress)
  updateUserToSendAddress(ctx: StateContext<UserStateModel>, {user, address}: UpdateUserMainAddress) {
    return this.crud.updateToSendAddressByMongoId(user, address).pipe(tap(() => console.log));
  }

  @Action(SetCompanyUserForUser)
  setCompanyForUser(ctx: StateContext<UserStateModel>, {user, company}: SetCompanyUserForUser) {
    return this.crud.readCompanyByNIP(company.nip).pipe(tap(gotCompany => {
      ctx.setState(
        patch({
          company: gotCompany
        }));
    }));
  }

  @Action(DeleteUser)
  deleteUser(ctx: StateContext<UserStateModel>, {user}: DeleteUser) {
    return this.crud.deleteUser(user).pipe(tap(() => {
      ctx.setState(
        {
          _id: '',
          email: '',
          name: '',
          activated: false,
          basicDiscount: 0,
          roofWindowsDiscount: 0,
          skylightsDiscount: 0,
          flashingsDiscount: 0,
          accessoriesDiscount: 0,
          flatRoofWindowsDiscount: 0,
          verticalWindowsDiscount: 0,
          companyNip: '',
          company: null,
          address: null,
          preferredLanguage: '',
          favoriteProducts: []
        });
    }));
  }
}
