import {Flashing} from './flashing';

export interface FlashingConfig {
  id: number;
  flashing: Flashing | null;
  quantity: number;
  flashingFormName: string;
  flashingFormData: any | null;
}
