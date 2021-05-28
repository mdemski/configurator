import {RoofWindowSkylight} from './roof-window-skylight';

export interface WindowConfig {
  id: number;
  window: RoofWindowSkylight | null;
  quantity: number;
  windowFormName: string;
  windowFormData: any | null;
}
