import {SingleConfiguration} from './single-configuration';

export interface ConfigurationModel {
  user: string;
  userConfigurations: SingleConfiguration[];
}
