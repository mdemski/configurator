import {VerticalWindow} from './vertical-window';

export interface VerticalConfig {
  id: number;
  vertical: VerticalWindow | null;
  quantity: number;
  verticalFormName: string;
  verticalFormData: any | null;
}
