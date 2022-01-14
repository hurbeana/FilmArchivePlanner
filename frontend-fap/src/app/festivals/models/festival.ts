import { FestivalEffects } from '../state/festivals.effects';
import { FestivalEvent } from './event';

export interface Festival {
  id: number;
  name: string;
  location: string;
  description?: string;
  firstDate: Date;
  events: FestivalEvent[];
  created_at: string;
}
