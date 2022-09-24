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

export class UpdateGlobalConfigurationInfoByConfigId {
  static readonly type = '[Configuration] Update Global Configuration Info By Config Id';

  constructor(public configuration: SingleConfiguration) {
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
export class AddFlashingConfiguration {
  static readonly type = '[Configuration] Add Flashing Configuration By Global Config Id';

  constructor(public globalConfiguration: SingleConfiguration, public payload: Flashing,
              public formName: string, public formData: any, public configLink: string) {
  }
}

export class AddFlashingConfigurations {
  static readonly type = '[Configuration] Add Flashing Configurations Array By Global Config Id';

  constructor(public globalConfiguration: SingleConfiguration, public payload: FlashingConfig[]) {
  }
}

export class UpdateFlashingConfiguration {
  static readonly type = '[Configuration] Update Flashing Configuration By Global Config Id';

  constructor(public globalConfiguration: SingleConfiguration, public flashingId: number, public payload: Flashing) {
  }
}

export class UpdateFlashingConfigurations {
  static readonly type = '[Configuration] Update Flashing Configurations Array By Global Config Id';

  constructor(public globalConfiguration: SingleConfiguration, public payload: FlashingConfig[]) {
  }
}

export class UpdateFlashingQuantityByConfigAndFlashingId {
  static readonly type = '[Configuration] Update Flashing Quantity By Global Config And Flashing Id';

  constructor(public globalConfiguration: SingleConfiguration, public flashingId: number, public payload: number) {
  }
}

export class UpdateFlashingFormByFormName {
  static readonly type = '[Configuration] Update Flashing Form Data By Form Name';

  constructor(public globalConfiguration: SingleConfiguration, public flashingFormName: string, public payload: number) {
  }
}

export class DeleteFlashingConfigurationByConfigAndFlashingId {
  static readonly type = '[Configuration] Delete Flashing Configuration By Global Config And Flashing Id';

  constructor(public globalConfiguration: SingleConfiguration, public flashingId: number) {
  }
}

// ---------------------------------------------------------------------------------------------------------- //

// Accessory Configuration Actions
export class AddAccessoryConfiguration {
  static readonly type = '[Configuration] Add Accessory Configuration By Global Config Id';

  constructor(public globalConfiguration: SingleConfiguration, public payload: Accessory,
              public formName: string, public formData: any, public configLink: string) {
  }
}

export class UpdateAccessoryConfiguration {
  static readonly type = '[Configuration] Update Accessory Configuration By Global Config Id';

  constructor(public globalConfiguration: SingleConfiguration, public accessoryId: number, public payload: Accessory) {
  }
}

export class UpdateAccessoryQuantityByConfigAndAccessoryId {
  static readonly type = '[Configuration] Update Accessory Quantity By Global Config And Accessory Id';

  constructor(public globalConfiguration: SingleConfiguration, public accessoryId: number, public payload: number) {
  }
}

export class UpdateAccessoryFormByFormName {
  static readonly type = '[Configuration] Update Accessory Form Data By Form Name';

  constructor(public globalConfiguration: SingleConfiguration, public accessoryFormName: string, public payload: number) {
  }
}

export class DeleteAccessoryConfigurationByConfigAndAccessoryId {
  static readonly type = '[Configuration] Delete Accessory Configuration By Global Config And Accessory Id';

  constructor(public globalConfiguration: SingleConfiguration, public accessoryId: number) {
  }
}

// ---------------------------------------------------------------------------------------------------------- //

// Flat Roof Configuration Actions
export class AddFlatRoofConfiguration {
  static readonly type = '[Configuration] Add Flat Roof Configuration By Global Config Id';

  constructor(public globalConfiguration: SingleConfiguration, public payload: FlatRoofWindow,
              public formName: string, public formData: any, public configLink: string) {
  }
}

export class UpdateFlatRoofConfiguration {
  static readonly type = '[Configuration] Update Flat Roof Configuration By Global Config Id';

  constructor(public globalConfiguration: SingleConfiguration, public flatId: number, public payload: FlatRoofWindow) {
  }
}

export class UpdateFlatRoofQuantityByConfigAndFlatId {
  static readonly type = '[Configuration] Update Flat Roof Quantity By Global Config And Flat Roof Id';

  constructor(public globalConfiguration: SingleConfiguration, public flatId: number, public payload: number) {
  }
}

export class UpdateFlatRoofFormByFormName {
  static readonly type = '[Configuration] Update Flat Roof Form Data By Form Name';

  constructor(public globalConfiguration: SingleConfiguration, public flatFormName: string, public payload: number) {
  }
}

export class DeleteFlatRoofConfigurationByConfigAndFlatId {
  static readonly type = '[Configuration] Delete Flat Roof Configuration By Global Config And Flat Roof Id';

  constructor(public globalConfiguration: SingleConfiguration, public flatId: number) {
  }
}

// ---------------------------------------------------------------------------------------------------------- //

// Vertical Window Configuration Actions
export class AddVerticalWindowConfiguration {
  static readonly type = '[Configuration] Add Vertical Window Configuration By Global Config Id';

  constructor(public globalConfiguration: SingleConfiguration, public payload: VerticalWindow,
              public formName: string, public formData: any, public configLink: string) {
  }
}

export class UpdateVerticalWindowConfiguration {
  static readonly type = '[Configuration] Update Vertical Window Configuration By Global Config Id';

  constructor(public globalConfiguration: SingleConfiguration, public verticalId: number, public payload: VerticalWindow) {
  }
}

export class UpdateVerticalWindowQuantityByConfigAndWindowId {
  static readonly type = '[Configuration] Update Vertical Window Quantity By Global Config And Vertical Window Id';

  constructor(public globalConfiguration: SingleConfiguration, public verticalId: number, public payload: number) {
  }
}

export class UpdateVerticalWindowFormByFormName {
  static readonly type = '[Configuration] Update Vertical Window Form Data By Form Name';

  constructor(public globalConfiguration: SingleConfiguration, public verticalFormName: string, public payload: number) {
  }
}

export class DeleteVerticalWindowConfigurationByConfigAndWindowId {
  static readonly type = '[Configuration] Delete Vertical Window Configuration By Global Config And Vertical Window Id';

  constructor(public globalConfiguration: SingleConfiguration, public verticalId: number) {
  }
}

// ---------------------------------------------------------------------------------------------------------- //
