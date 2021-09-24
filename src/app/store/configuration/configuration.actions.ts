import {SingleConfiguration} from '../../models/single-configuration';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {Flashing} from '../../models/flashing';
import {FlashingConfig} from '../../models/flashing-config';
import {Accessory} from '../../models/accessory';
import {FlatRoofWindow} from '../../models/flat-roof-window';
import {VerticalWindow} from '../../models/vertical-window';

// Global Configuration Actions
export class GetConfigurations {
  static readonly type = '[Configuration] Get All Configurations';
}

export class AddGlobalConfiguration {
  static readonly type = '[Configuration] Add Global Configuration';

  constructor(public user: string, public payload: SingleConfiguration) {
  }
}

export class UpdateGlobalConfigurationNameByConfigId {
  static readonly type = '[Configuration] Update Global Configuration Name By Config Id';

  constructor(public mongoId: string, public configName: string) {
  }
}

export class DeleteGlobalConfiguration {
  static readonly type = '[Configuration] Delete Global Configuration';

  constructor(public payload: SingleConfiguration) {
  }
}

// ---------------------------------------------------------------------------------------------------------- //

// Roof Window Configuration Actions
export class AddRoofWindowConfiguration {
  static readonly type = '[Configuration] Add Roof Window Configuration By Global Config Id';

  constructor(public globalConfiguration: SingleConfiguration, public payload: RoofWindowSkylight,
              public formName: string, public formData: any, public configLink: string) {
  }
}

export class UpdateRoofWindowConfiguration {
  static readonly type = '[Configuration] Update Roof Window Configuration By Global Config Id';

  constructor(public globalConfiguration: SingleConfiguration, public windowId: number, public payload: RoofWindowSkylight) {
  }
}

export class UpdateRoofWindowQuantityByConfigAndWindowId {
  static readonly type = '[Configuration] Update Roof Window Quantity By Global Config And Window Id';

  constructor(public globalConfiguration: SingleConfiguration, public windowId: number, public payload: number) {
  }
}

export class UpdateRoofWindowFormByFormName {
  static readonly type = '[Configuration] Update Roof Window Form Data By Form Name';

  constructor(public globalConfiguration: SingleConfiguration, public windowFormName: string, public payload: any) {
  }
}

export class DeleteRoofWindowConfigurationByConfigAndWindowId {
  static readonly type = '[Configuration] Delete Roof Window Configuration By Global Config And Window Id';

  constructor(public globalConfiguration: SingleConfiguration, public windowId: number) {
  }
}

// ---------------------------------------------------------------------------------------------------------- //

// Flashing Configuration Actions
export class GetFlashingConfigurationsByConfigId {
  static readonly type = '[Configuration] Get All Flashing Configurations By Global Config Id';

  constructor(public payload: string) {
  }
}

export class GetFlashingConfigurationByConfigId {
  static readonly type = '[Configuration] Get Flashing Configuration By Flashing Id And By Global Config Id';

  constructor(public configId: string, public flashingId: string) {
  }
}

export class AddFlashingConfiguration {
  static readonly type = '[Configuration] Add Flashing Configuration By Global Config Id';

  constructor(public configId: string, public payload: Flashing,
              public formName: string, public formData: any, public configLink: string) {
  }
}

export class AddFlashingConfigurations {
  static readonly type = '[Configuration] Add Flashing Configurations Array By Global Config Id';

  constructor(public configId: string, public payload: FlashingConfig[]) {
  }
}

export class UpdateFlashingConfiguration {
  static readonly type = '[Configuration] Update Flashing Configuration By Global Config Id';

  constructor(public configId: string, public flashingId: string, public payload: Flashing) {
  }
}

export class UpdateFlashingConfigurations {
  static readonly type = '[Configuration] Update Flashing Configurations Array By Global Config Id';

  constructor(public configId: string, public payload: FlashingConfig[]) {
  }
}

export class UpdateFlashingQuantityByConfigAndFlashingId {
  static readonly type = '[Configuration] Update Flashing Quantity By Global Config And Flashing Id';

  constructor(public configId: string, public flashingId: string, public payload: number) {
  }
}

export class UpdateFlashingFormByFormName {
  static readonly type = '[Configuration] Update Flashing Form Data By Form Name';

  constructor(public configId: string, public flashingFormName: string, public payload: number) {
  }
}

export class DeleteFlashingConfigurationByConfigAndFlashingId {
  static readonly type = '[Configuration] Delete Flashing Configuration By Global Config And Flashing Id';

  constructor(public configId: string, public flashingId: string) {
  }
}

// ---------------------------------------------------------------------------------------------------------- //

// Accessory Configuration Actions
export class GetAccessoryConfigurationsByConfigId {
  static readonly type = '[Configuration] Get All Accessory Configurations By Global Config Id';

  constructor(public payload: string) {
  }
}

export class GetAccessoryConfigurationByConfigId {
  static readonly type = '[Configuration] Get Accessory Configuration By Accessory Id And By Global Config Id';

  constructor(public configId: string, public accessoryId: string) {
  }
}

export class AddAccessoryConfiguration {
  static readonly type = '[Configuration] Add Accessory Configuration By Global Config Id';

  constructor(public configId: string, public payload: Accessory,
              public formName: string, public formData: any, public configLink: string) {
  }
}

export class UpdateAccessoryConfiguration {
  static readonly type = '[Configuration] Update Accessory Configuration By Global Config Id';

  constructor(public configId: string, public accessoryId: string, public payload: Accessory) {
  }
}

export class UpdateAccessoryQuantityByConfigAndAccessoryId {
  static readonly type = '[Configuration] Update Accessory Quantity By Global Config And Accessory Id';

  constructor(public configId: string, public accessoryId: string, public payload: number) {
  }
}

export class UpdateAccessoryFormByFormName {
  static readonly type = '[Configuration] Update Accessory Form Data By Form Name';

  constructor(public configId: string, public accessoryFormName: string, public payload: number) {
  }
}

export class DeleteAccessoryConfigurationByConfigAndAccessoryId {
  static readonly type = '[Configuration] Delete Accessory Configuration By Global Config And Accessory Id';

  constructor(public configId: string, public accessoryId: string) {
  }
}

// ---------------------------------------------------------------------------------------------------------- //

// Flat Roof Configuration Actions
export class GetFlatRoofConfigurationsByConfigId {
  static readonly type = '[Configuration] Get All Flat Roof Configurations By Global Config Id';

  constructor(public payload: string) {
  }
}

export class GetFlatRoofConfigurationByConfigId {
  static readonly type = '[Configuration] Get Flat Roof Configuration By Flat Roof Id And By Global Config Id';

  constructor(public configId: string, public flatId: string) {
  }
}

export class AddFlatRoofConfiguration {
  static readonly type = '[Configuration] Add Flat Roof Configuration By Global Config Id';

  constructor(public configId: string, public payload: FlatRoofWindow,
              public formName: string, public formData: any, public configLink: string) {
  }
}

export class UpdateFlatRoofConfiguration {
  static readonly type = '[Configuration] Update Flat Roof Configuration By Global Config Id';

  constructor(public configId: string, public flatId: string, public payload: FlatRoofWindow) {
  }
}

export class UpdateFlatRoofQuantityByConfigAndFlatId {
  static readonly type = '[Configuration] Update Flat Roof Quantity By Global Config And Flat Roof Id';

  constructor(public configId: string, public flatId: string, public payload: number) {
  }
}

export class UpdateFlatRoofFormByFormName {
  static readonly type = '[Configuration] Update Flat Roof Form Data By Form Name';

  constructor(public configId: string, public flatFormName: string, public payload: number) {
  }
}

export class DeleteFlatRoofConfigurationByConfigAndFlatId {
  static readonly type = '[Configuration] Delete Flat Roof Configuration By Global Config And Flat Roof Id';

  constructor(public configId: string, public flatId: string) {
  }
}

// ---------------------------------------------------------------------------------------------------------- //

// Vertical Window Configuration Actions
export class GetVerticalWindowConfigurationsByConfigId {
  static readonly type = '[Configuration] Get All Vertical Window Configurations By Global Config Id';

  constructor(public payload: string) {
  }
}

export class GetVerticalWindowConfigurationByConfigId {
  static readonly type = '[Configuration] Get Vertical Window Configuration By Vertical Window Id And By Global Config Id';

  constructor(public configId: string, public windowId: string) {
  }
}

export class AddVerticalWindowConfiguration {
  static readonly type = '[Configuration] Add Vertical Window Configuration By Global Config Id';

  constructor(public configId: string, public payload: VerticalWindow,
              public formName: string, public formData: any, public configLink: string) {
  }
}

export class UpdateVerticalWindowConfiguration {
  static readonly type = '[Configuration] Update Vertical Window Configuration By Global Config Id';

  constructor(public configId: string, public windowId: string, public payload: VerticalWindow) {
  }
}

export class UpdateVerticalWindowQuantityByConfigAndWindowId {
  static readonly type = '[Configuration] Update Vertical Window Quantity By Global Config And Vertical Window Id';

  constructor(public configId: string, public windowId: string, public payload: number) {
  }
}

export class UpdateVerticalWindowFormByFormName {
  static readonly type = '[Configuration] Update Vertical Window Form Data By Form Name';

  constructor(public configId: string, public windowFormName: string, public payload: number) {
  }
}

export class DeleteVerticalWindowConfigurationByConfigAndWindowId {
  static readonly type = '[Configuration] Delete Vertical Window Configuration By Global Config And Vertical Window Id';

  constructor(public configId: string, public windowId: string) {
  }
}

// ---------------------------------------------------------------------------------------------------------- //
