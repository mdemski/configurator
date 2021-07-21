import {FlashingKombi} from './flashing-kombi';

export interface FlashingConfig {
  id: number;
  flashingKombi: FlashingKombi | null;
  quantity: number;
  flashingFormName: string;
  flashingFormData: any | null;
}
