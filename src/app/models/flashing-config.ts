import {Flashing} from './flashing';
import {FlashingKombi} from './flashing-kombi';

export interface FlashingConfig {
  id: number;
  flashing: Flashing | FlashingKombi | null;
  quantity: number;
  flashingFormName: string;
  flashingFormData: any | null;
}
