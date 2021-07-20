import {FlashingKombi} from './flashing-kombi';

export interface FlashingConfig {
  id: number;
  flashing: FlashingKombi | null;
  quantity: number;
  flashingFormName: string;
  flashingFormData: any | null;
}
