import {Params} from '@angular/router';
import {Selector, State} from '@ngxs/store';
import {RouterStateModel as RouterStateOuterModel} from '@ngxs/router-plugin/src/router.state';
import {Injectable} from '@angular/core';

export interface RouterStateModel {
  url: string;
  params: Params;
  queryParams: Params;
  data: any;
}

@State<RouterStateModel>({
  name: 'customRouter',
  defaults: {
    url: '',
    params: null,
    queryParams: null,
    data: null
  }
})
@Injectable()
export class RouterState {

  @Selector([RouterState])
  static data({state}: RouterStateOuterModel<RouterStateModel>) {
    return state.data;
  }

  @Selector([RouterState])
  static params({state}: RouterStateOuterModel<RouterStateModel>) {
    return state.params;
  }

  @Selector([RouterState])
  static queryParams({state}: RouterStateOuterModel<RouterStateModel>) {
    return state.queryParams;
  }

  @Selector([RouterState])
  static url({state}: RouterStateOuterModel<RouterStateModel>) {
    return state.url;
  }
}
